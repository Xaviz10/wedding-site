import { GalleryApiError, getMedia, type GalleryMedia } from "./galleryApi";
import type { GallerySession } from "./gallerySession";

export interface PollingOptions {
  intervalMs?: number;
  maxAttempts?: number;
  fetchMedia?: typeof getMedia;
  pause?: (milliseconds: number) => Promise<void>;
}

function defaultPause(milliseconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export async function waitForProcessedMedia(
  session: GallerySession,
  mediaId: string,
  options: PollingOptions = {},
): Promise<GalleryMedia> {
  const intervalMs = options.intervalMs ?? 3_000;
  const maxAttempts = options.maxAttempts ?? 100;
  const fetchMedia = options.fetchMedia ?? getMedia;
  const pause = options.pause ?? defaultPause;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    await pause(intervalMs);
    const media = await fetchMedia(session, mediaId);
    if (media.status === "READY") return media;
    if (media.status === "UNSUPPORTED") {
      throw new GalleryApiError(
        "Este video necesita conversión, pero la conversión no está habilitada.",
        422,
        media.errorCode,
      );
    }
    if (media.status === "FAILED") {
      throw new GalleryApiError("No pudimos preparar este archivo. Intenta subirlo nuevamente.", 422, media.errorCode);
    }
  }

  throw new GalleryApiError(
    "El archivo sigue procesándose. Revisa la galería en unos minutos.",
    408,
    "PROCESSING_TIMEOUT",
  );
}
