import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";
import {
  createUploadTicket,
  exchangeInviteToken,
  listMedia,
  SessionExpiredError,
  uploadToPresignedPost,
  type GalleryMedia,
} from "../../lib/galleryApi";
import { readStoredSession, storeSession, type GallerySession } from "../../lib/gallerySession";
import { waitForProcessedMedia } from "../../lib/galleryPolling";
import { galleryFileValidationError } from "../../lib/galleryValidation";
import { createDemoSession, isGalleryDemoMode } from "../../lib/galleryDemoApi";
import { groupGalleryMedia, type GalleryMediaGroup } from "../../lib/galleryGrouping";
import { galleryTileSize, shouldUseCollageLayout } from "../../lib/galleryLayout";
import { runWithConcurrency } from "../../lib/uploadBatch";
import { createClientUuid } from "../../lib/clientUuid";
import { prepareGalleryFile } from "../../lib/galleryFilePreparation";
import heroImage from "../../assets/hero.jpg";
import GalleryGroupTile from "./GalleryGroupTile";
import GalleryViewer from "./GalleryViewer";

interface GuestGalleryPageProps {
  initialInviteToken?: string;
}

export type QueuedMediaStatus = "queued" | "uploading" | "processing" | "success" | "error";

interface QueuedMedia {
  id: string;
  file: File;
  previewUrl: string;
  status: QueuedMediaStatus;
  progress: number;
  batchId?: string;
  message?: string;
}

interface UploadedMedia {
  media: QueuedMedia;
  mediaId: string;
}

const UPLOAD_CONCURRENCY = 2;

function queueStatusLabel(media: QueuedMedia): string {
  if (media.status === "uploading") return `Subiendo · ${media.progress}%`;
  if (media.status === "processing") return "Procesando";
  if (media.status === "success") return "Publicado";
  if (media.status === "error") return "Error · reintentar";
  return "Listo para subir";
}

export function QueuedMediaStatusIndicator({ status, progress }: { status: QueuedMediaStatus; progress: number }) {
  if (status === "queued") {
    return <span className="absolute left-2 top-2 rounded-full bg-black/65 px-2 py-1 text-[0.52rem] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-sm">Listo</span>;
  }

  if (status === "uploading") {
    const radius = 15;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - Math.min(100, Math.max(0, progress)) / 100);
    return (
      <span className="absolute inset-0 grid place-items-center bg-black/34" role="status" aria-label={`Subiendo ${progress}%`}>
        <span className="relative grid h-12 w-12 place-items-center rounded-full bg-black/60 text-[0.62rem] font-bold text-white shadow-lg backdrop-blur-sm">
          <svg viewBox="0 0 36 36" className="absolute inset-1 h-10 w-10 -rotate-90" aria-hidden>
            <circle cx="18" cy="18" r={radius} fill="none" stroke="rgba(255,255,255,0.24)" strokeWidth="2.5" />
            <circle cx="18" cy="18" r={radius} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
          </svg>
          <span className="relative">{progress}%</span>
        </span>
      </span>
    );
  }

  if (status === "processing") {
    return (
      <span className="absolute inset-0 grid place-items-center bg-black/38" role="status" aria-label="Procesando archivo">
        <span className="flex flex-col items-center gap-2 rounded-2xl bg-black/60 px-3 py-2.5 text-[0.55rem] font-semibold uppercase tracking-[0.08em] text-white shadow-lg backdrop-blur-sm">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/25 border-t-white" aria-hidden />
          Procesando
        </span>
      </span>
    );
  }

  if (status === "success") {
    return <span className="absolute left-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-emerald-600 text-base font-bold text-white shadow-lg" role="status" aria-label="Archivo publicado">✓</span>;
  }

  return <span className="absolute left-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-red-700 text-base font-bold text-white shadow-lg" role="status" aria-label="Error al compartir archivo">!</span>;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(bytes < 10 * 1024 * 1024 ? 1 : 0)} MB`;
}

export default function GuestGalleryPage({ initialInviteToken }: GuestGalleryPageProps) {
  const demoMode = isGalleryDemoMode();
  const [session, setSession] = useState<GallerySession | undefined>(() =>
    demoMode ? createDemoSession() : readStoredSession(),
  );
  const [authStatus, setAuthStatus] = useState<"idle" | "loading" | "error">(
    initialInviteToken && !demoMode ? "loading" : "idle",
  );
  const [authError, setAuthError] = useState("");
  const [items, setItems] = useState<GalleryMedia[]>([]);
  const [nextCursor, setNextCursor] = useState<string>();
  const [galleryStatus, setGalleryStatus] = useState<"idle" | "loading" | "error">("idle");
  const [galleryError, setGalleryError] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<QueuedMedia[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [caption, setCaption] = useState("");
  const [preparingMedia, setPreparingMedia] = useState(false);
  const [batchUploading, setBatchUploading] = useState(false);
  const [uploadHasError, setUploadHasError] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [viewerGroup, setViewerGroup] = useState<GalleryMediaGroup>();
  const exchangedInvite = useRef<string | undefined>(undefined);
  const selectedMediaRef = useRef<QueuedMedia[]>([]);
  const preparingMediaRef = useRef(false);
  const uploadOperationRef = useRef(0);

  const uploadableCount = selectedMedia.filter((media) => media.status === "queued" || media.status === "error").length;
  const completedCount = selectedMedia.filter((media) => media.status === "success").length;
  const queuedCount = selectedMedia.filter((media) => media.status === "queued").length;
  const errorCount = selectedMedia.filter((media) => media.status === "error").length;
  const processingCount = selectedMedia.filter((media) => media.status === "processing").length;
  const activelyUploadingCount = selectedMedia.filter((media) => media.status === "uploading").length;
  const overallProgress = selectedMedia.length
    ? Math.round(selectedMedia.reduce((sum, media) => sum + media.progress, 0) / selectedMedia.length)
    : 0;
  const galleryGroups = groupGalleryMedia(items);
  const useCollageLayout = shouldUseCollageLayout(galleryGroups.length);
  const uploadStateLabel = preparingMedia
    ? "Preparando tus archivos"
    : batchUploading
      ? `Subiendo ${activelyUploadingCount || uploadableCount} ${activelyUploadingCount === 1 ? "archivo" : "archivos"}`
      : processingCount > 0
        ? `Procesando ${processingCount} ${processingCount === 1 ? "archivo" : "archivos"}`
        : errorCount > 0
          ? `${errorCount} ${errorCount === 1 ? "archivo necesita" : "archivos necesitan"} atención`
          : queuedCount > 0
            ? `${queuedCount} ${queuedCount === 1 ? "archivo listo" : "archivos listos"} para compartir`
            : "Selecciona fotos y videos";

  useEffect(() => {
    selectedMediaRef.current = selectedMedia;
  }, [selectedMedia]);

  useEffect(() => () => {
    selectedMediaRef.current.forEach((media) => URL.revokeObjectURL(media.previewUrl));
  }, []);

  const handleSessionExpired = useCallback((error: unknown) => {
    if (error instanceof SessionExpiredError) {
      setSession(undefined);
      setIsUploadOpen(false);
      setViewerGroup(undefined);
      setAuthStatus("error");
      setAuthError(error.message);
      return true;
    }
    return false;
  }, []);

  const refreshGallery = useCallback(async (activeSession: GallerySession, cursor?: string) => {
    setGalleryStatus("loading");
    setGalleryError("");
    try {
      const page = await listMedia(activeSession, cursor);
      setItems((current) => cursor ? [...current, ...page.items] : page.items);
      setNextCursor(page.nextCursor);
      setGalleryStatus("idle");
    } catch (error) {
      if (!handleSessionExpired(error)) {
        setGalleryStatus("error");
        setGalleryError(error instanceof Error ? error.message : "No pudimos cargar la galería.");
      }
    }
  }, [handleSessionExpired]);

  useEffect(() => {
    if (demoMode || !initialInviteToken || exchangedInvite.current === initialInviteToken) return;
    exchangedInvite.current = initialInviteToken;
    setAuthStatus("loading");
    void exchangeInviteToken(initialInviteToken)
      .then((newSession) => {
        storeSession(newSession);
        setSession(newSession);
        setAuthStatus("idle");
      })
      .catch((error: unknown) => {
        setAuthStatus("error");
        setAuthError(error instanceof Error ? error.message : "El enlace de invitación no es válido.");
      });
  }, [demoMode, initialInviteToken]);

  useEffect(() => {
    if (!session) return undefined;

    const timeoutId = window.setTimeout(() => void refreshGallery(session), 0);
    return () => window.clearTimeout(timeoutId);
  }, [refreshGallery, session]);

  useEffect(() => {
    if (!isUploadOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !batchUploading && !preparingMedia) setIsUploadOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [batchUploading, isUploadOpen, preparingMedia]);

  function updateQueuedMedia(id: string, values: Partial<QueuedMedia>): void {
    setSelectedMedia((current) => current.map((media) => media.id === id ? { ...media, ...values } : media));
  }

  async function addFiles(files: FileList | readonly File[]): Promise<void> {
    if (batchUploading || preparingMediaRef.current) return;
    const incoming = Array.from(files);
    const accepted: QueuedMedia[] = [];
    const validationErrors: string[] = [];
    let convertedHeicCount = 0;

    preparingMediaRef.current = true;
    setPreparingMedia(true);
    setUploadHasError(false);
    setUploadMessage(
      incoming.length === 1 ? "Preparando el archivo…" : `Preparando ${incoming.length} archivos…`,
    );

    for (const originalFile of incoming) {
      try {
        // Convert sequentially to keep memory usage predictable on iPhones.
        const prepared = await prepareGalleryFile(originalFile);
        const validationError = galleryFileValidationError(prepared.file);
        if (validationError) {
          validationErrors.push(`${originalFile.name}: ${validationError}`);
          continue;
        }
        if (prepared.convertedFromHeic) convertedHeicCount += 1;
        accepted.push({
          id: createClientUuid(),
          file: prepared.file,
          previewUrl: URL.createObjectURL(prepared.file),
          status: "queued",
          progress: 0,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "No pudimos preparar este archivo.";
        validationErrors.push(`${originalFile.name}: ${message}`);
      }
    }

    preparingMediaRef.current = false;
    setPreparingMedia(false);

    if (accepted.length) setSelectedMedia((current) => [...current, ...accepted]);
    setUploadHasError(validationErrors.length > 0);
    if (validationErrors.length) {
      setUploadMessage(
        `${validationErrors.length} ${validationErrors.length === 1 ? "archivo no se agregó" : "archivos no se agregaron"}. ${validationErrors[0]}`,
      );
    } else if (accepted.length) {
      const conversionMessage = convertedHeicCount > 0
        ? ` ${convertedHeicCount} ${convertedHeicCount === 1 ? "foto HEIC fue convertida" : "fotos HEIC fueron convertidas"} a JPEG.`
        : "";
      setUploadMessage(
        `${accepted.length} ${accepted.length === 1 ? "archivo listo" : "archivos listos"} para compartir.${conversionMessage}`,
      );
    }
  }

  function onFileSelection(event: ChangeEvent<HTMLInputElement>): void {
    const files = event.target.files ? Array.from(event.target.files) : [];
    event.target.value = "";
    if (files.length) void addFiles(files);
  }

  function onFileDrop(event: DragEvent<HTMLLabelElement>): void {
    event.preventDefault();
    if (event.dataTransfer.files.length) void addFiles(event.dataTransfer.files);
  }

  function removeQueuedMedia(id: string): void {
    setSelectedMedia((current) => {
      const media = current.find((item) => item.id === id);
      if (!media || media.status === "uploading" || media.status === "processing") return current;
      URL.revokeObjectURL(media.previewUrl);
      return current.filter((item) => item.id !== id);
    });
  }

  function clearCompletedMedia(): void {
    setSelectedMedia((current) => {
      current.filter((media) => media.status === "success")
        .forEach((media) => URL.revokeObjectURL(media.previewUrl));
      return current.filter((media) => media.status !== "success");
    });
  }

  async function finishProcessing(
    uploadedMedia: UploadedMedia[],
    activeSession: GallerySession,
    operationId: number,
    earlierFailures: number,
  ): Promise<void> {
    let ready = 0;
    let processingFailures = 0;
    let sessionExpired = false;
    const successfulIds = new Set<string>();

    await runWithConcurrency(uploadedMedia, 4, async ({ media, mediaId }) => {
      try {
        await waitForProcessedMedia(
          activeSession,
          mediaId,
          demoMode ? { intervalMs: 200, maxAttempts: 20 } : undefined,
        );
        updateQueuedMedia(media.id, { status: "success", progress: 100 });
        successfulIds.add(media.id);
        ready += 1;
      } catch (error) {
        sessionExpired = handleSessionExpired(error) || sessionExpired;
        const message = error instanceof Error ? error.message : "No pudimos preparar este archivo.";
        updateQueuedMedia(media.id, { status: "error", message });
        processingFailures += 1;
      }
    });

    setSelectedMedia((current) => {
      current.filter((media) => successfulIds.has(media.id))
        .forEach((media) => URL.revokeObjectURL(media.previewUrl));
      return current.filter((media) => !successfulIds.has(media.id));
    });

    if (uploadOperationRef.current === operationId) {
      const totalFailures = earlierFailures + processingFailures;
      setUploadHasError(totalFailures > 0);
      setUploadMessage(totalFailures === 0
        ? `${ready} ${ready === 1 ? "recuerdo publicado" : "recuerdos publicados"}. ¡Gracias!`
        : `${ready} ${ready === 1 ? "publicado" : "publicados"} · ${totalFailures} ${totalFailures === 1 ? "con error" : "con errores"}. Puedes reintentar.`);
    }
    if (!sessionExpired) await refreshGallery(activeSession);
  }

  async function onUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const mediaToUpload = selectedMedia.filter((media) => media.status === "queued" || media.status === "error");
    if (!session || mediaToUpload.length === 0) {
      setUploadHasError(true);
      setUploadMessage("Selecciona al menos una foto o un video.");
      return;
    }

    const sharedDisplayName = displayName.trim();
    const sharedCaption = caption.trim();
    const uploadBatchId = mediaToUpload.find((media) => media.batchId)?.batchId
      ?? (mediaToUpload.length > 1 ? createClientUuid() : undefined);
    if (uploadBatchId) {
      const mediaIds = new Set(mediaToUpload.map((media) => media.id));
      setSelectedMedia((current) => current.map((media) =>
        mediaIds.has(media.id) ? { ...media, batchId: uploadBatchId } : media,
      ));
    }
    const operationId = uploadOperationRef.current + 1;
    uploadOperationRef.current = operationId;
    const uploadedMedia: UploadedMedia[] = [];
    let failed = 0;
    setBatchUploading(true);
    setUploadHasError(false);
    setUploadMessage(
      `Compartiendo ${mediaToUpload.length} ${mediaToUpload.length === 1 ? "recuerdo" : "recuerdos"}…`,
    );

    await runWithConcurrency(mediaToUpload, UPLOAD_CONCURRENCY, async (media) => {
      updateQueuedMedia(media.id, { status: "uploading", progress: 0, message: undefined });
      try {
        const ticket = await createUploadTicket(session, {
          fileName: media.file.name,
          contentType: media.file.type,
          size: media.file.size,
          ...(uploadBatchId ? { batchId: uploadBatchId } : {}),
          ...(sharedDisplayName ? { displayName: sharedDisplayName } : {}),
          ...(sharedCaption ? { caption: sharedCaption } : {}),
        });
        await uploadToPresignedPost(ticket, media.file, (progress) => {
          updateQueuedMedia(media.id, { progress });
        });
        updateQueuedMedia(media.id, { status: "processing", progress: 100 });
        uploadedMedia.push({ media, mediaId: ticket.mediaId });
      } catch (error) {
        handleSessionExpired(error);
        const message = error instanceof Error ? error.message : "No pudimos subir este archivo.";
        updateQueuedMedia(media.id, { status: "error", message });
        failed += 1;
      }
    });

    setBatchUploading(false);
    setUploadHasError(failed > 0);
    if (uploadedMedia.length > 0) {
      setDisplayName("");
      setCaption("");
      setUploadMessage(failed === 0
        ? `${uploadedMedia.length} ${uploadedMedia.length === 1 ? "recuerdo recibido" : "recuerdos recibidos"}. Los estamos procesando en segundo plano.`
        : `${uploadedMedia.length} ${uploadedMedia.length === 1 ? "recibido" : "recibidos"} y ${failed} ${failed === 1 ? "con error" : "con errores"}. Procesaremos los archivos recibidos.`);
      void finishProcessing(uploadedMedia, session, operationId, failed);
      return;
    }
    setUploadMessage(`0 publicados · ${failed} ${failed === 1 ? "con error" : "con errores"}. Puedes reintentar.`);
  }

  if (!session) {
    return (
      <main className="relative isolate flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-[var(--color-forest)] px-5 py-10 text-center text-white sm:px-8">
        <img
          src={heroImage}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-[50%_44%] md:object-[50%_42%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.76)_0%,rgba(0,0,0,0.46)_42%,rgba(0,0,0,0.84)_100%)]" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.12),transparent_30%),radial-gradient(circle_at_50%_50%,transparent_0,rgba(0,0,0,0.5)_76%)]" aria-hidden />
        <div className="paper-grain opacity-25" aria-hidden />

        <section className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center">
          <svg viewBox="0 0 180 60" fill="none" aria-hidden className="h-auto w-28 text-[var(--color-gold)] opacity-85 sm:w-32">
            <path d="M90 8v43M90 27C73 16 56 12 40 13M90 27c17-11 34-15 50-14M90 37c-21-5-40-5-56-1M90 37c21-5 40-5 56-1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <circle cx="90" cy="7" r="2.4" fill="currentColor" />
            <circle cx="40" cy="13" r="1.8" fill="currentColor" />
            <circle cx="140" cy="13" r="1.8" fill="currentColor" />
          </svg>
          <div className="mt-2 h-px w-36 bg-[linear-gradient(to_right,transparent,var(--color-gold),transparent)]" aria-hidden />

          <p className="mt-6 text-[0.6rem] font-semibold uppercase tracking-[0.38em] text-[var(--color-gold)] drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] sm:text-[0.7rem]">
            Recuerdos de Cata &amp; Javier
          </p>
          <h1 className="font-heading mt-4 text-[clamp(3.2rem,13vw,6rem)] font-medium italic leading-[0.86] text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
            Galería de invitados
          </h1>

          <div className="mt-8 w-full max-w-lg rounded-[8px] border border-[color-mix(in_oklab,var(--color-gold)_42%,transparent)] bg-[rgba(19,20,16,0.58)] px-6 py-7 shadow-[0_18px_50px_rgba(0,0,0,0.3)] backdrop-blur-md sm:px-9 sm:py-8">
            {authStatus === "loading" ? (
              <p className="font-editorial text-xl italic text-white/88" role="status">Abriendo tu invitación segura…</p>
            ) : (
              <>
                <p className="font-editorial text-[clamp(1.2rem,4.8vw,1.55rem)] italic leading-[1.35] text-white/88">
                  {authError || "Abre esta página desde el enlace del código QR de la boda para compartir y ver recuerdos."}
                </p>
                <a
                  className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--color-gold)] bg-black/25 px-6 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[var(--color-gold)] hover:text-[var(--color-forest)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
                  href="#portada"
                >
                  Volver a la invitación
                </a>
              </>
            )}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f5f2] text-[var(--color-forest)] [padding-bottom:calc(5.5rem+env(safe-area-inset-bottom))]">
      <header className="sticky top-0 z-40 flex min-h-16 items-center justify-between gap-3 border-b border-black/8 bg-[#f4f5f2]/88 px-3 backdrop-blur-xl [padding-top:env(safe-area-inset-top)] sm:px-5">
        <a
          href="#portada"
          aria-label="Volver a la invitación"
          className="grid h-11 w-11 place-items-center rounded-full transition hover:bg-black/6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-olive)]"
        >
          <span className="text-2xl" aria-hidden>‹</span>
        </a>
        <div className="min-w-0 flex-1 text-center">
          <h1 className="truncate text-[0.95rem] font-semibold tracking-[-0.01em]">Recuerdos</h1>
          <p className="mt-0.5 text-[0.62rem] uppercase tracking-[0.16em] text-[var(--color-olive)]">Cata &amp; Javier</p>
        </div>
        <button
          type="button"
          onClick={() => void refreshGallery(session)}
          disabled={galleryStatus === "loading"}
          aria-label="Actualizar galería"
          aria-busy={galleryStatus === "loading"}
          className="grid h-11 w-11 place-items-center rounded-full transition hover:bg-black/6 disabled:cursor-wait disabled:bg-black/4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-olive)]"
        >
          <svg viewBox="0 0 24 24" className={`h-5 w-5 ${galleryStatus === "loading" ? "animate-spin" : ""}`} fill="none" aria-hidden>
            <path d="M19 7.5A8 8 0 1 0 20 12" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
            <path d="M19 3v4.5h-4.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </header>

      <section aria-labelledby="gallery-title" className="px-4 pb-5 pt-6 sm:px-6 sm:pb-7 sm:pt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-olive)]">La boda desde todos los ángulos</p>
            <h2 id="gallery-title" className="font-heading mt-1 text-[clamp(2.6rem,8vw,4.5rem)] font-medium italic leading-[0.9]">Nuestra galería</h2>
          </div>
          <p className="shrink-0 pb-1 text-xs text-[var(--color-forest)]/55">
            {galleryGroups.length} {galleryGroups.length === 1 ? "grupo" : "grupos"}
          </p>
        </div>
        {demoMode && (
          <p className="mt-4 w-fit rounded-full bg-[var(--color-forest)] px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white">
            Demo local · sin AWS
          </p>
        )}
      </section>

      {galleryError && <p className="mx-4 mb-4 rounded-2xl bg-red-50 p-4 text-sm text-red-900 sm:mx-6" role="alert">{galleryError}</p>}

      {galleryStatus === "loading" && items.length === 0 ? (
        <div className="grid grid-cols-3 gap-0.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7" aria-label="Cargando galería">
          {Array.from({ length: 14 }, (_, index) => <span key={index} className="aspect-square animate-pulse bg-black/8" />)}
        </div>
      ) : galleryGroups.length === 0 && !galleryError ? (
        <section className="mx-auto grid min-h-[45svh] max-w-md place-items-center px-6 text-center">
          <div>
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white text-3xl shadow-sm" aria-hidden>＋</span>
            <h2 className="mt-5 text-xl font-semibold">Todavía no hay recuerdos</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-forest)]/60">Sé la primera persona en compartir fotos y videos de la boda.</p>
          </div>
        </section>
      ) : (
        <ul
          className={useCollageLayout
            ? "gallery-collage bg-[#f4f5f2]"
            : "grid grid-cols-3 gap-0.5 bg-[#f4f5f2] sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7"}
          aria-label="Recuerdos compartidos"
        >
          {galleryGroups.map((group, index) => (
            <GalleryGroupTile
              key={group.id}
              group={group}
              size={useCollageLayout ? galleryTileSize(index, galleryGroups.length) : undefined}
              onOpen={setViewerGroup}
            />
          ))}
        </ul>
      )}

      {nextCursor && (
        <div className="py-8 text-center">
          <button
            type="button"
            disabled={galleryStatus === "loading"}
            onClick={() => void refreshGallery(session, nextCursor)}
            className="inline-flex min-h-11 items-center rounded-full border border-black/12 bg-white px-6 text-xs font-semibold shadow-sm transition hover:bg-black hover:text-white disabled:opacity-50"
          >
            {galleryStatus === "loading" ? "Cargando…" : "Ver más recuerdos"}
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsUploadOpen(true)}
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 inline-flex min-h-14 touch-manipulation items-center gap-2 rounded-full bg-[var(--color-forest)] px-5 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(20,24,18,0.3)] transition hover:-translate-y-0.5 hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-olive)] sm:right-6"
      >
        <span className="text-2xl font-light leading-none" aria-hidden>＋</span>
        Subir recuerdos
        {(processingCount > 0 || errorCount > 0) && (
          <span className={`ml-1 inline-flex min-w-7 items-center justify-center gap-1 rounded-full px-2 py-1 text-[0.62rem] ${errorCount > 0 ? "bg-red-600 text-white" : "bg-white/14 text-white"}`}>
            {processingCount > 0 && <span className="h-2.5 w-2.5 animate-spin rounded-full border border-white/35 border-t-white" aria-hidden />}
            {errorCount > 0 ? errorCount : processingCount}
          </span>
        )}
      </button>

      {isUploadOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 backdrop-blur-sm lg:items-stretch lg:justify-end">
          <button
            type="button"
            aria-label="Cerrar formulario de carga"
            onClick={() => !batchUploading && !preparingMedia && setIsUploadOpen(false)}
            className="absolute inset-0 cursor-default"
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-title"
            aria-describedby="upload-state"
            className="relative z-10 max-h-[92dvh] w-full overflow-y-auto rounded-t-[28px] bg-[#f8f9f6] shadow-[0_-20px_60px_rgba(0,0,0,0.24)] [padding-bottom:max(1.5rem,env(safe-area-inset-bottom))] lg:h-full lg:max-h-none lg:max-w-[31rem] lg:rounded-none lg:shadow-[-20px_0_60px_rgba(0,0,0,0.18)]"
          >
            <header className="sticky top-0 z-30 flex items-center justify-between border-b border-black/8 bg-[#f8f9f6]/94 px-5 pb-4 pt-5 backdrop-blur-xl">
              <span className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-black/12 lg:hidden" aria-hidden />
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-olive)]">Comparte un momento</p>
                <h2 id="upload-title" className="mt-1 text-xl font-semibold">Subir recuerdos</h2>
                <p id="upload-state" className="mt-1 text-xs text-black/48" aria-live="polite">{uploadStateLabel}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                disabled={batchUploading || preparingMedia}
                aria-label="Cerrar"
                className="grid h-11 w-11 place-items-center rounded-full bg-black/6 text-2xl transition hover:bg-black/10 disabled:opacity-35"
              >
                ×
              </button>
            </header>

            <form onSubmit={onUpload} className="grid gap-5 px-5 pb-0 pt-5 sm:px-7">
              <input
                id="gallery-media-picker"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif,video/mp4,video/quicktime,.mov"
                className="sr-only"
                onChange={onFileSelection}
                multiple
                disabled={batchUploading || preparingMedia}
              />
              {selectedMedia.length === 0 && (
                <label
                  htmlFor="gallery-media-picker"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={onFileDrop}
                  className={`group grid min-h-40 cursor-pointer place-items-center rounded-3xl border border-dashed border-black/18 bg-white px-5 py-6 text-center shadow-sm transition hover:border-[var(--color-olive)] ${batchUploading || preparingMedia ? "pointer-events-none opacity-60" : ""}`}
                >
                  <span>
                    <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-forest)] text-2xl text-white" aria-hidden>
                      {preparingMedia ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : "＋"}
                    </span>
                    <span className="mt-3 block text-sm font-semibold">{preparingMedia ? "Preparando fotos del iPhone…" : "Elegir fotos y videos"}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-black/48">JPEG, PNG, WebP y HEIC · MP4 y MOV<br />20 MB por imagen · 500 MB por video</span>
                  </span>
                </label>
              )}

              {selectedMedia.length > 0 && (
                <div className="grid gap-3" aria-label="Archivos seleccionados">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold">{selectedMedia.length} {selectedMedia.length === 1 ? "archivo seleccionado" : "archivos seleccionados"}</p>
                    <label htmlFor="gallery-media-picker" className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border border-black/10 bg-white px-3 text-xs font-semibold text-[var(--color-olive)] shadow-sm ${batchUploading || preparingMedia ? "pointer-events-none opacity-50" : ""}`}>＋ Agregar más</label>
                  </div>
                  <ul className="grid max-h-[21rem] grid-cols-2 gap-2 overflow-y-auto pr-0.5 sm:grid-cols-3" aria-live="polite">
                    {selectedMedia.map((media) => (
                      <li
                        key={media.id}
                        aria-label={`${media.file.name}: ${queueStatusLabel(media)}`}
                        className={`relative overflow-hidden rounded-xl bg-black/8 ring-1 ${media.status === "error" ? "ring-red-500" : media.status === "success" ? "ring-emerald-500" : "ring-black/6"}`}
                      >
                        <div className="pointer-events-none aspect-square select-none" aria-hidden="true">
                          {media.file.type.startsWith("image/") ? (
                            <img src={media.previewUrl} alt="" draggable={false} className="pointer-events-none h-full w-full object-cover" />
                          ) : (
                            <video src={media.previewUrl} muted playsInline preload="metadata" className="pointer-events-none h-full w-full bg-black object-cover" />
                          )}
                        </div>
                        <QueuedMediaStatusIndicator status={media.status} progress={media.progress} />
                        <button
                          type="button"
                          aria-label={`Quitar ${media.file.name}`}
                          onClick={() => removeQueuedMedia(media.id)}
                          disabled={media.status === "uploading" || media.status === "processing"}
                          className="absolute right-1 top-1 z-20 grid h-11 w-11 touch-manipulation place-items-center rounded-full bg-black/66 text-2xl text-white shadow-md backdrop-blur-sm disabled:hidden sm:h-9 sm:w-9 sm:text-xl"
                        >×</button>
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent px-2 pb-2 pt-8 text-white">
                          <p className="truncate text-[0.66rem] font-semibold">{media.file.name}</p>
                          <div className="mt-0.5 flex items-center justify-between gap-1 text-[0.56rem]"><span className="text-white/65">{formatFileSize(media.file.size)}</span><span className={media.status === "error" ? "font-semibold text-red-200" : "font-medium text-white/90"}>{queueStatusLabel(media)}</span></div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {selectedMedia.some((media) => media.status === "error" && media.message) && (
                    <ul className="grid gap-1 rounded-2xl bg-red-50 p-3 text-xs text-red-900" aria-label="Errores de carga">
                      {selectedMedia.filter((media) => media.status === "error" && media.message).map((media) => <li key={media.id}><strong>{media.file.name}:</strong> {media.message}</li>)}
                    </ul>
                  )}
                </div>
              )}

              <fieldset className="grid gap-4 rounded-2xl border border-black/8 bg-white/58 p-4" disabled={batchUploading || preparingMedia}>
                <legend className="px-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-olive)]">Detalles para todo el grupo</legend>
              <label className="grid gap-2">
                <span className="text-xs font-medium text-black/55">Tu nombre <span className="font-normal">(opcional)</span></span>
                <input className="min-h-12 rounded-2xl border border-black/10 bg-white px-4 outline-none transition focus:border-[var(--color-olive)] focus:ring-2 focus:ring-[var(--color-olive)]/20" value={displayName} maxLength={80} onChange={(event) => setDisplayName(event.target.value)} />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-medium text-black/55">Mensaje para este grupo <span className="font-normal">(opcional)</span></span>
                <textarea className="min-h-28 resize-none rounded-2xl border border-black/10 bg-white p-4 outline-none transition focus:border-[var(--color-olive)] focus:ring-2 focus:ring-[var(--color-olive)]/20" rows={3} value={caption} maxLength={280} onChange={(event) => setCaption(event.target.value)} />
                <span className="text-right text-[0.65rem] text-black/40">{caption.length}/280</span>
              </label>
              </fieldset>

              <div className="sticky bottom-0 z-20 -mx-5 mt-1 grid gap-3 border-t border-black/8 bg-[#f8f9f6]/96 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_-12px_30px_rgba(20,24,18,0.08)] backdrop-blur-xl sm:-mx-7 sm:px-7">
                <div className="flex items-center gap-3" role="status" aria-live="polite">
                  {(preparingMedia || batchUploading || processingCount > 0) ? (
                    <span className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-[var(--color-olive)]/25 border-t-[var(--color-olive)]" aria-hidden />
                  ) : (
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${errorCount > 0 ? "bg-red-600" : uploadableCount > 0 ? "bg-[var(--color-olive)]" : "bg-black/18"}`} aria-hidden />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{uploadStateLabel}</p>
                    {processingCount > 0 && !batchUploading && <p className="mt-0.5 text-[0.62rem] text-black/46">Puedes cerrar esta ventana; continuaremos en segundo plano.</p>}
                  </div>
                  {batchUploading && <span className="text-xs font-bold tabular-nums text-[var(--color-olive)]">{overallProgress}%</span>}
                </div>
                {batchUploading && <div className="h-1.5 overflow-hidden rounded-full bg-black/8" role="progressbar" aria-label="Progreso total de carga" aria-valuemin={0} aria-valuemax={100} aria-valuenow={overallProgress}><div className="h-full rounded-full bg-[var(--color-olive)] transition-[width]" style={{ width: `${overallProgress}%` }} /></div>}
              <button type="submit" disabled={preparingMedia || batchUploading || uploadableCount === 0} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[var(--color-forest)] px-5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-wait disabled:opacity-45">
                {(preparingMedia || batchUploading) && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden />}
                {preparingMedia
                  ? "Preparando fotos…"
                  : batchUploading
                    ? activelyUploadingCount > 0
                      ? `Subiendo ${activelyUploadingCount} ${activelyUploadingCount === 1 ? "recuerdo" : "recuerdos"}…`
                      : "Preparando la carga…"
                    : uploadableCount > 0
                      ? uploadableCount === 1 ? "Compartir 1 recuerdo" : `Compartir ${uploadableCount} recuerdos`
                      : processingCount > 0
                        ? `Procesando ${processingCount} ${processingCount === 1 ? "recuerdo" : "recuerdos"}…`
                        : "Compartir 0 recuerdos"}
              </button>
              {completedCount > 0 && !batchUploading && <button type="button" onClick={clearCompletedMedia} className="text-xs font-semibold text-[var(--color-olive)]">Limpiar {completedCount === 1 ? "archivo publicado" : `${completedCount} archivos publicados`}</button>}
              {uploadMessage && <p className={`rounded-2xl p-4 text-sm leading-relaxed ${uploadHasError ? "bg-red-50 text-red-900" : "bg-[var(--color-moss-soft)]/22 text-[var(--color-forest)]"}`} role={uploadHasError ? "alert" : "status"}>{uploadMessage}</p>}
              </div>
            </form>
          </section>
        </div>
      )}

      {viewerGroup && <GalleryViewer key={viewerGroup.id} group={viewerGroup} onClose={() => setViewerGroup(undefined)} />}
    </main>
  );
}
