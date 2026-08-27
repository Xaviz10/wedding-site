import heroImage from "../assets/hero.jpg";
import milkaImage from "../assets/milka-retrato-circular.jpg";
import type { GalleryMedia, GalleryPageResult, UploadRequest, UploadTicket } from "./galleryApi";
import type { GallerySession } from "./gallerySession";

const DEMO_SESSION_SECONDS = 24 * 60 * 60;
const DEMO_PROCESSING_DELAY_MS = 700;
const SEEDED_BATCH_ID = "33333333-3333-4333-8333-333333333333";

interface DemoMedia extends GalleryMedia {
  localObjectUrl?: string;
}

function seededMedia(now = Date.now()): DemoMedia[] {
  const firstCreatedAt = new Date(now - 2 * 60 * 1000).toISOString();
  const secondCreatedAt = new Date(now - 5 * 60 * 1000).toISOString();
  return [
    {
      id: "11111111-1111-4111-8111-111111111111",
      mediaKind: "image",
      status: "READY",
      batchId: SEEDED_BATCH_ID,
      createdAt: firstCreatedAt,
      readyAt: firstCreatedAt,
      displayName: "Familia y amigos",
      caption: "Un recuerdo de ejemplo para revisar la galería local.",
      mediaUrl: heroImage,
      thumbnailUrl: heroImage,
    },
    {
      id: "22222222-2222-4222-8222-222222222222",
      mediaKind: "image",
      status: "READY",
      batchId: SEEDED_BATCH_ID,
      createdAt: secondCreatedAt,
      readyAt: secondCreatedAt,
      displayName: "Familia y amigos",
      caption: "Un recuerdo de ejemplo para revisar la galería local.",
      mediaUrl: milkaImage,
      thumbnailUrl: milkaImage,
    },
  ];
}

let demoMedia = seededMedia();

function pause(milliseconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function cloneMedia(media: DemoMedia): GalleryMedia {
  const view = { ...media };
  delete view.localObjectUrl;
  return view;
}

export function isGalleryDemoMode(): boolean {
  return import.meta.env.DEV && import.meta.env.VITE_GALLERY_DEMO_MODE === "true";
}

export function createDemoSession(now = Date.now()): GallerySession {
  return {
    token: "local-gallery-demo",
    expiresAt: Math.floor(now / 1000) + DEMO_SESSION_SECONDS,
  };
}

export function resetDemoGallery(): void {
  for (const media of demoMedia) {
    if (media.localObjectUrl && typeof URL.revokeObjectURL === "function") {
      URL.revokeObjectURL(media.localObjectUrl);
    }
  }
  demoMedia = seededMedia();
}

export function createDemoUploadTicket(request: UploadRequest, now = Date.now()): UploadTicket {
  const mediaId = crypto.randomUUID();
  demoMedia.unshift({
    id: mediaId,
    mediaKind: request.contentType.startsWith("image/") ? "image" : "video",
    status: "AWAITING_UPLOAD",
    createdAt: new Date(now).toISOString(),
    ...(request.batchId ? { batchId: request.batchId } : {}),
    ...(request.displayName ? { displayName: request.displayName } : {}),
    ...(request.caption ? { caption: request.caption } : {}),
  });
  return {
    mediaId,
    expiresAt: Math.floor(now / 1000) + 15 * 60,
    upload: { url: `local-demo://${mediaId}`, fields: {} },
  };
}

export async function uploadDemoMedia(
  ticket: UploadTicket,
  file: File,
  onProgress: (percent: number) => void,
): Promise<void> {
  const media = demoMedia.find((item) => item.id === ticket.mediaId);
  if (!media) throw new Error("No encontramos la carga local de demostración.");

  for (const progress of [15, 38, 64, 86, 100]) {
    await pause(70);
    onProgress(progress);
  }

  media.status = "PROCESSING";
  const objectUrl = URL.createObjectURL(file);
  media.localObjectUrl = objectUrl;
  window.setTimeout(() => {
    media.status = "READY";
    media.readyAt = new Date().toISOString();
    media.mediaUrl = objectUrl;
    if (media.mediaKind === "image") media.thumbnailUrl = objectUrl;
  }, DEMO_PROCESSING_DELAY_MS);
}

export function getDemoMedia(id: string): GalleryMedia | undefined {
  const media = demoMedia.find((item) => item.id === id);
  return media ? cloneMedia(media) : undefined;
}

export function listDemoMedia(): GalleryPageResult {
  return {
    items: demoMedia
      .filter((item) => item.status === "READY")
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      .map(cloneMedia),
  };
}
