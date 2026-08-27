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
import GalleryGroupTile from "./GalleryGroupTile";
import GalleryViewer from "./GalleryViewer";

interface GuestGalleryPageProps {
  initialInviteToken?: string;
}

type QueuedMediaStatus = "queued" | "uploading" | "processing" | "success" | "error";

interface QueuedMedia {
  id: string;
  file: File;
  previewUrl: string;
  status: QueuedMediaStatus;
  progress: number;
  batchId?: string;
  message?: string;
}

const UPLOAD_CONCURRENCY = 2;

function queueStatusLabel(media: QueuedMedia): string {
  if (media.status === "uploading") return `${media.progress}%`;
  if (media.status === "processing") return "Procesando";
  if (media.status === "success") return "Publicado";
  if (media.status === "error") return "Reintentar";
  return "Listo";
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
  const [batchUploading, setBatchUploading] = useState(false);
  const [uploadHasError, setUploadHasError] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [viewerGroup, setViewerGroup] = useState<GalleryMediaGroup>();
  const exchangedInvite = useRef<string | undefined>(undefined);
  const selectedMediaRef = useRef<QueuedMedia[]>([]);

  const uploadableCount = selectedMedia.filter((media) => media.status === "queued" || media.status === "error").length;
  const completedCount = selectedMedia.filter((media) => media.status === "success").length;
  const overallProgress = selectedMedia.length
    ? Math.round(selectedMedia.reduce((sum, media) => sum + media.progress, 0) / selectedMedia.length)
    : 0;
  const galleryGroups = groupGalleryMedia(items);
  const useCollageLayout = shouldUseCollageLayout(galleryGroups.length);

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
      if (event.key === "Escape" && !batchUploading) setIsUploadOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [batchUploading, isUploadOpen]);

  function updateQueuedMedia(id: string, values: Partial<QueuedMedia>): void {
    setSelectedMedia((current) => current.map((media) => media.id === id ? { ...media, ...values } : media));
  }

  function addFiles(files: FileList | readonly File[]): void {
    if (batchUploading) return;
    const incoming = Array.from(files);
    const accepted: QueuedMedia[] = [];
    const validationErrors: string[] = [];

    for (const file of incoming) {
      const validationError = galleryFileValidationError(file);
      if (validationError) {
        validationErrors.push(`${file.name}: ${validationError}`);
        continue;
      }
      accepted.push({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        status: "queued",
        progress: 0,
      });
    }

    if (accepted.length) setSelectedMedia((current) => [...current, ...accepted]);
    setUploadHasError(validationErrors.length > 0);
    if (validationErrors.length) {
      setUploadMessage(
        `${validationErrors.length} ${validationErrors.length === 1 ? "archivo no se agregó" : "archivos no se agregaron"}. ${validationErrors[0]}`,
      );
    } else if (accepted.length) {
      setUploadMessage(
        `${accepted.length} ${accepted.length === 1 ? "archivo listo" : "archivos listos"} para compartir.`,
      );
    }
  }

  function onFileSelection(event: ChangeEvent<HTMLInputElement>): void {
    if (event.target.files) addFiles(event.target.files);
    event.target.value = "";
  }

  function onFileDrop(event: DragEvent<HTMLLabelElement>): void {
    event.preventDefault();
    if (event.dataTransfer.files.length) addFiles(event.dataTransfer.files);
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
      ?? (mediaToUpload.length > 1 ? crypto.randomUUID() : undefined);
    if (uploadBatchId) {
      const mediaIds = new Set(mediaToUpload.map((media) => media.id));
      setSelectedMedia((current) => current.map((media) =>
        mediaIds.has(media.id) ? { ...media, batchId: uploadBatchId } : media,
      ));
    }
    let succeeded = 0;
    let failed = 0;
    let sessionExpired = false;
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
        await waitForProcessedMedia(
          session,
          ticket.mediaId,
          demoMode ? { intervalMs: 200, maxAttempts: 20 } : undefined,
        );
        updateQueuedMedia(media.id, { status: "success", progress: 100 });
        succeeded += 1;
      } catch (error) {
        sessionExpired = handleSessionExpired(error) || sessionExpired;
        const message = error instanceof Error ? error.message : "No pudimos subir este archivo.";
        updateQueuedMedia(media.id, { status: "error", message });
        failed += 1;
      }
    });

    setBatchUploading(false);
    setUploadHasError(failed > 0);
    if (failed === 0) {
      setUploadMessage(
        `${succeeded} ${succeeded === 1 ? "recuerdo publicado" : "recuerdos publicados"}. ¡Gracias!`,
      );
      setSelectedMedia((current) => {
        current.forEach((media) => URL.revokeObjectURL(media.previewUrl));
        return [];
      });
      setDisplayName("");
      setCaption("");
    } else {
      setUploadMessage(
        `${succeeded} ${succeeded === 1 ? "publicado" : "publicados"} · ${failed} ${failed === 1 ? "con error" : "con errores"}. Puedes reintentar.`,
      );
    }
    if (!sessionExpired) await refreshGallery(session);
  }

  if (!session) {
    return (
      <main className="gallery-page relative isolate min-h-screen overflow-hidden px-4 py-20 text-[var(--color-forest)] md:px-8 lg:py-28">
        <div className="paper-grain" aria-hidden />
        <section className="relative z-10 mx-auto grid min-h-[70svh] max-w-2xl place-items-center text-center">
          <div className="paper-surface rounded-[8px] px-6 py-10 md:px-12">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-[var(--color-olive)]">Recuerdos de la boda</p>
            <h1 className="font-heading mt-4 text-[clamp(2.7rem,8vw,4.6rem)] font-medium italic leading-[0.92]">Galería de invitados</h1>
            {authStatus === "loading" ? (
              <p className="mt-6" role="status">Abriendo tu invitación segura…</p>
            ) : (
              <>
                <p className="font-editorial mt-6 text-xl italic leading-[1.35] text-[var(--color-forest)]/76">
                  {authError || "Abre esta página desde el enlace del código QR de la boda para compartir y ver recuerdos."}
                </p>
                <a className="gallery-secondary-action mt-8" href="#portada">
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
          aria-label="Actualizar galería"
          className="grid h-11 w-11 place-items-center rounded-full transition hover:bg-black/6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-olive)]"
        >
          <svg viewBox="0 0 24 24" className={`h-5 w-5 ${galleryStatus === "loading" ? "animate-spin" : ""}`} fill="none" aria-hidden>
            <path d="M20 11a8 8 0 1 0-2.35 5.65" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M20 5v6h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
      </button>

      {isUploadOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 backdrop-blur-sm lg:items-stretch lg:justify-end">
          <button
            type="button"
            aria-label="Cerrar formulario de carga"
            onClick={() => !batchUploading && setIsUploadOpen(false)}
            className="absolute inset-0 cursor-default"
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-title"
            className="relative z-10 max-h-[92dvh] w-full overflow-y-auto rounded-t-[28px] bg-[#f8f9f6] shadow-[0_-20px_60px_rgba(0,0,0,0.24)] [padding-bottom:max(1.5rem,env(safe-area-inset-bottom))] lg:h-full lg:max-h-none lg:max-w-[31rem] lg:rounded-none lg:shadow-[-20px_0_60px_rgba(0,0,0,0.18)]"
          >
            <header className="sticky top-0 z-30 flex items-center justify-between border-b border-black/8 bg-[#f8f9f6]/92 px-5 py-4 backdrop-blur-xl">
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-olive)]">Comparte un momento</p>
                <h2 id="upload-title" className="mt-1 text-xl font-semibold">Subir recuerdos</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                disabled={batchUploading}
                aria-label="Cerrar"
                className="grid h-11 w-11 place-items-center rounded-full bg-black/6 text-2xl transition hover:bg-black/10 disabled:opacity-35"
              >
                ×
              </button>
            </header>

            <form onSubmit={onUpload} className="grid gap-6 px-5 py-6 sm:px-7">
              <input
                id="gallery-media-picker"
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,.mov"
                className="sr-only"
                onChange={onFileSelection}
                multiple
                disabled={batchUploading}
              />
              <label
                htmlFor="gallery-media-picker"
                onDragOver={(event) => event.preventDefault()}
                onDrop={onFileDrop}
                className={`group grid min-h-40 cursor-pointer place-items-center rounded-3xl border border-dashed border-black/18 bg-white px-5 py-6 text-center shadow-sm transition hover:border-[var(--color-olive)] ${batchUploading ? "pointer-events-none opacity-50" : ""}`}
              >
                <span>
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-forest)] text-2xl text-white" aria-hidden>＋</span>
                  <span className="mt-3 block text-sm font-semibold">Elegir fotos y videos</span>
                  <span className="mt-1 block text-xs leading-relaxed text-black/48">Selecciona varios o arrástralos aquí<br />20 MB por imagen · 500 MB por video</span>
                </span>
              </label>

              {selectedMedia.length > 0 && (
                <div className="grid gap-3" aria-label="Archivos seleccionados">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold">{selectedMedia.length} {selectedMedia.length === 1 ? "archivo seleccionado" : "archivos seleccionados"}</p>
                    <label htmlFor="gallery-media-picker" className={`cursor-pointer text-xs font-semibold text-[var(--color-olive)] ${batchUploading ? "pointer-events-none opacity-50" : ""}`}>Agregar más</label>
                  </div>
                  <ul className="grid max-h-72 grid-cols-3 gap-1.5 overflow-y-auto">
                    {selectedMedia.map((media) => (
                      <li key={media.id} className="relative overflow-hidden rounded-xl bg-black/8">
                        <div className="pointer-events-none aspect-square select-none" aria-hidden="true">
                          {media.file.type.startsWith("image/") ? (
                            <img src={media.previewUrl} alt="" draggable={false} className="pointer-events-none h-full w-full object-cover" />
                          ) : (
                            <video src={media.previewUrl} muted playsInline preload="metadata" className="pointer-events-none h-full w-full bg-black object-cover" />
                          )}
                        </div>
                        <button
                          type="button"
                          aria-label={`Quitar ${media.file.name}`}
                          onClick={() => removeQueuedMedia(media.id)}
                          disabled={media.status === "uploading" || media.status === "processing"}
                          className="absolute right-1 top-1 z-20 grid h-11 w-11 touch-manipulation place-items-center rounded-full bg-black/66 text-2xl text-white shadow-md backdrop-blur-sm disabled:hidden sm:h-9 sm:w-9 sm:text-xl"
                        >×</button>
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-2 pb-2 pt-7 text-white">
                          <p className="truncate text-[0.62rem] font-semibold">{media.file.name}</p>
                          <div className="mt-0.5 flex justify-between gap-1 text-[0.55rem] text-white/72"><span>{formatFileSize(media.file.size)}</span><span>{queueStatusLabel(media)}</span></div>
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

              <label className="grid gap-2">
                <span className="text-xs font-medium text-black/55">Tu nombre <span className="font-normal">(opcional)</span></span>
                <input className="min-h-12 rounded-2xl border border-black/10 bg-white px-4 outline-none transition focus:border-[var(--color-olive)] focus:ring-2 focus:ring-[var(--color-olive)]/20" value={displayName} maxLength={80} onChange={(event) => setDisplayName(event.target.value)} />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-medium text-black/55">Mensaje para este grupo <span className="font-normal">(opcional)</span></span>
                <textarea className="min-h-28 resize-none rounded-2xl border border-black/10 bg-white p-4 outline-none transition focus:border-[var(--color-olive)] focus:ring-2 focus:ring-[var(--color-olive)]/20" rows={3} value={caption} maxLength={280} onChange={(event) => setCaption(event.target.value)} />
                <span className="text-right text-[0.65rem] text-black/40">{caption.length}/280</span>
              </label>

              <button type="submit" disabled={batchUploading || uploadableCount === 0} className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-[var(--color-forest)] px-5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-wait disabled:opacity-40">
                {batchUploading ? "Compartiendo recuerdos…" : uploadableCount === 1 ? "Compartir 1 recuerdo" : `Compartir ${uploadableCount} recuerdos`}
              </button>
              {batchUploading && <div className="h-1.5 overflow-hidden rounded-full bg-black/8" aria-hidden><div className="h-full rounded-full bg-[var(--color-olive)] transition-[width]" style={{ width: `${overallProgress}%` }} /></div>}
              {completedCount > 0 && !batchUploading && <button type="button" onClick={clearCompletedMedia} className="text-xs font-semibold text-[var(--color-olive)]">Limpiar {completedCount === 1 ? "archivo publicado" : `${completedCount} archivos publicados`}</button>}
              {uploadMessage && <p className={`rounded-2xl p-4 text-sm leading-relaxed ${uploadHasError ? "bg-red-50 text-red-900" : "bg-[var(--color-moss-soft)]/22 text-[var(--color-forest)]"}`} role={uploadHasError ? "alert" : "status"}>{uploadMessage}</p>}
            </form>
          </section>
        </div>
      )}

      {viewerGroup && <GalleryViewer key={viewerGroup.id} group={viewerGroup} onClose={() => setViewerGroup(undefined)} />}
    </main>
  );
}
