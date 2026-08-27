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
import { groupGalleryMedia } from "../../lib/galleryGrouping";
import { runWithConcurrency } from "../../lib/uploadBatch";
import MediaCarouselCard from "./MediaCarouselCard";

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
  const exchangedInvite = useRef<string | undefined>(undefined);
  const selectedMediaRef = useRef<QueuedMedia[]>([]);

  const uploadableCount = selectedMedia.filter((media) => media.status === "queued" || media.status === "error").length;
  const completedCount = selectedMedia.filter((media) => media.status === "success").length;
  const overallProgress = selectedMedia.length
    ? Math.round(selectedMedia.reduce((sum, media) => sum + media.progress, 0) / selectedMedia.length)
    : 0;
  const galleryGroups = groupGalleryMedia(items);

  useEffect(() => {
    selectedMediaRef.current = selectedMedia;
  }, [selectedMedia]);

  useEffect(() => () => {
    selectedMediaRef.current.forEach((media) => URL.revokeObjectURL(media.previewUrl));
  }, []);

  const handleSessionExpired = useCallback((error: unknown) => {
    if (error instanceof SessionExpiredError) {
      setSession(undefined);
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
    <main className="gallery-page relative isolate min-h-screen overflow-hidden text-[var(--color-forest)]">
      <div className="paper-grain" aria-hidden />
      <header className="gallery-hero relative z-10 px-5 py-12 text-center text-white md:px-10 md:py-20">
        <div className="mx-auto max-w-4xl">
          <a href="#portada" className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--color-gold)]/55 px-5 py-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)] transition hover:border-[var(--color-gold)] hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]">
            ← Volver a la invitación
          </a>
          <p className="mt-10 text-[0.62rem] font-semibold uppercase tracking-[0.38em] text-[var(--color-gold)] md:text-[0.7rem]">Cata &amp; Javier</p>
          <h1 className="font-heading mt-3 text-[clamp(3.2rem,9vw,6.2rem)] font-medium italic leading-[0.88] tracking-normal">Nuestros recuerdos</h1>
          <p className="font-editorial mx-auto mt-5 max-w-2xl text-[clamp(1.15rem,3vw,1.55rem)] italic leading-[1.35] text-white/84">
            Ayúdanos a guardar la boda desde todas las miradas.
          </p>
          {demoMode && (
            <p className="mx-auto mt-5 w-fit rounded-full border border-[var(--color-gold)]/55 bg-black/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-gold)]">
              Modo demo local · sin conexión a AWS
            </p>
          )}
        </div>
      </header>

      <div className="relative z-10 mx-auto grid max-w-[1180px] gap-12 px-4 py-20 md:px-8 lg:grid-cols-[minmax(22rem,0.42fr)_minmax(0,0.58fr)] lg:py-28">
        <section aria-labelledby="upload-title">
          <form onSubmit={onUpload} className="gallery-upload-form paper-surface grid gap-6 rounded-[8px] p-6 md:p-8">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-[var(--color-olive)]">Comparte un momento</p>
              <h2 id="upload-title" className="font-heading mt-3 text-[clamp(2.5rem,6vw,3.6rem)] font-medium italic leading-[0.92]">Sube tus fotos y videos</h2>
              <p className="font-editorial mt-3 text-xl italic leading-[1.35] text-[var(--color-terracotta)]">
                Elige varios archivos de tu galería y compártelos juntos.
              </p>
            </div>

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
              className={`paper-surface--soft group grid min-h-44 cursor-pointer place-items-center rounded-[8px] px-5 py-7 text-center transition hover:border-[var(--color-olive)] hover:bg-white/60 focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-[var(--color-olive)] ${batchUploading ? "pointer-events-none opacity-55" : ""}`}
            >
              <span>
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-[var(--color-olive)]/35 bg-[var(--color-ivory)] text-2xl text-[var(--color-forest)] shadow-[0_8px_20px_rgba(36,41,31,0.1)] transition group-hover:border-[var(--color-forest)]" aria-hidden>
                  ＋
                </span>
                <span className="mt-4 block text-[0.72rem] font-semibold uppercase tracking-[0.18em]">Elegir fotos y videos</span>
                <span className="mt-1 block text-xs leading-relaxed text-[var(--color-forest)]/65">
                  Selecciona varios desde tu galería o arrástralos aquí<br />
                  Imágenes hasta 20 MB · Videos hasta 500 MB cada uno
                </span>
              </span>
            </label>

            {selectedMedia.length > 0 && (
              <div className="grid gap-3" aria-label="Archivos seleccionados">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-olive)]">
                    {selectedMedia.length} {selectedMedia.length === 1 ? "archivo seleccionado" : "archivos seleccionados"}
                  </p>
                  <label htmlFor="gallery-media-picker" className={`gallery-text-action cursor-pointer ${batchUploading ? "pointer-events-none opacity-50" : ""}`}>
                    Agregar más
                  </label>
                </div>

                <ul className="grid max-h-80 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                  {selectedMedia.map((media) => (
                    <li key={media.id} className="relative overflow-hidden rounded-[8px] bg-[var(--color-forest)]/10">
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
                        className="absolute right-1 top-1 z-20 grid h-11 w-11 touch-manipulation place-items-center rounded-full border border-white/45 bg-[rgba(252,251,248,0.9)] text-2xl leading-none text-[var(--color-forest)] shadow-md backdrop-blur-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)] disabled:hidden sm:h-9 sm:w-9 sm:text-xl"
                      >
                        ×
                      </button>
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/65 to-transparent px-2 pb-2 pt-8 text-white">
                        <p className="truncate text-[0.68rem] font-semibold" title={media.file.name}>{media.file.name}</p>
                        <div className="mt-1 flex items-center justify-between gap-2 text-[0.6rem]">
                          <span className="opacity-75">{formatFileSize(media.file.size)}</span>
                          <span className={media.status === "error" ? "font-semibold text-red-200" : media.status === "success" ? "font-semibold text-emerald-200" : "font-semibold text-[var(--color-gold)]"}>
                            {queueStatusLabel(media)}
                          </span>
                        </div>
                        {media.status === "uploading" && (
                          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/25" aria-hidden>
                            <div className="h-full rounded-full bg-[var(--color-gold)] transition-[width]" style={{ width: `${media.progress}%` }} />
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                {selectedMedia.some((media) => media.status === "error" && media.message) && (
                  <ul className="grid gap-1 text-xs text-red-800" aria-label="Errores de carga">
                    {selectedMedia.filter((media) => media.status === "error" && media.message).map((media) => (
                      <li key={media.id}><strong>{media.file.name}:</strong> {media.message}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <label className="grid gap-2">
              <span className="form-label">Tu nombre <span className="font-normal normal-case opacity-65">(opcional)</span></span>
              <input className="form-control" value={displayName} maxLength={80} onChange={(event) => setDisplayName(event.target.value)} />
            </label>

            <label className="grid gap-2">
              <span className="form-label">Mensaje para este grupo <span className="font-normal normal-case opacity-65">(opcional)</span></span>
              <textarea className="form-control resize-none" rows={3} value={caption} maxLength={280} onChange={(event) => setCaption(event.target.value)} />
              <span className="text-right text-xs text-[var(--color-forest)]/60">{caption.length}/280</span>
            </label>

            <button
              type="submit"
              disabled={batchUploading || uploadableCount === 0}
              className="gallery-primary-action"
            >
              {batchUploading
                ? "Compartiendo recuerdos…"
                : uploadableCount === 1
                  ? "Compartir 1 recuerdo"
                  : `Compartir ${uploadableCount} recuerdos`}
            </button>

            {batchUploading && (
              <div className="h-2 overflow-hidden rounded-full bg-[var(--color-forest)]/10" aria-hidden>
                <div className="h-full rounded-full bg-[var(--color-gold)] transition-[width]" style={{ width: `${overallProgress}%` }} />
              </div>
            )}
            {completedCount > 0 && !batchUploading && (
              <button type="button" onClick={clearCompletedMedia} className="gallery-text-action mx-auto">
                Limpiar {completedCount === 1 ? "archivo publicado" : `${completedCount} archivos publicados`}
              </button>
            )}
            {uploadMessage && (
              <p className={uploadHasError ? "form-feedback form-feedback--error" : "form-feedback form-feedback--success"} role={uploadHasError ? "alert" : "status"}>
                {uploadMessage}
              </p>
            )}
          </form>
        </section>

        <section aria-labelledby="gallery-title">
          <div className="flex items-end justify-between gap-4 border-b border-[var(--color-olive)]/20 pb-5">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-[var(--color-olive)]">La boda desde todos los ángulos</p>
              <h2 id="gallery-title" className="font-heading mt-3 text-[clamp(2.7rem,6vw,4.6rem)] font-medium italic leading-[0.92]">Galería</h2>
            </div>
            <button type="button" onClick={() => void refreshGallery(session)} className="gallery-secondary-action shrink-0">
              Actualizar
            </button>
          </div>

          {galleryStatus === "loading" && items.length === 0 && <p className="mt-10" role="status">Cargando recuerdos…</p>}
          {galleryError && <p className="form-feedback form-feedback--error mt-8" role="alert">{galleryError}</p>}
          {galleryStatus !== "loading" && items.length === 0 && !galleryError && (
            <div className="paper-surface mt-8 rounded-[8px] p-8 text-center">
              <p className="font-editorial text-2xl italic">Sé la primera persona en compartir un recuerdo.</p>
            </div>
          )}

          <div className="mt-8 columns-1 gap-5 sm:columns-2">
            {galleryGroups.map((group) => <MediaCarouselCard key={group.id} group={group} />)}
          </div>

          {nextCursor && (
            <div className="mt-8 text-center">
              <button type="button" disabled={galleryStatus === "loading"} onClick={() => void refreshGallery(session, nextCursor)} className="gallery-secondary-action px-6">
                {galleryStatus === "loading" ? "Cargando…" : "Ver más recuerdos"}
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
