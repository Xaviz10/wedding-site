import heroImage from "../assets/hero.jpg";
import milkaImage from "../assets/milka-retrato-circular.jpg";
import ceremonyImage from "../assets/capilla-inmaculada.jpg";
import proposalImage from "../assets/propuesta-anillo-nieve-2025.jpg";
import homeImage from "../assets/hogar-1.jpg";
import friendsImage from "../assets/inicio-amigos-2016.png";
import landscapeImage from "../assets/distancia-vuelo-nubes-1.jpg";
import portraitImage from "../assets/hero-img-jkm-0396.jpg";
import celebrationImage from "../assets/hogar-2.jpg";
import snowFamilyImage from "../assets/propuesta-familia-nieve-2025.jpg";
import puppyImage from "../assets/milka-carrusel-1.jpg";
import beachImage from "../assets/hogar-playa-2023.jpg";
import madridImage from "../assets/distancia-madrid.jpg";
import coupleImage from "../assets/hero-img-1531.jpg";
import milkaFamilyImage from "../assets/milka-con-nosotros.jpg";
import yesImage from "../assets/propuesta-cata-dijo-si-2025.jpg";
import venueImage from "../assets/finca-la-mara.avif";
import homeMomentImage from "../assets/hogar-5.jpg";
import reunionImage from "../assets/distancia-reencuentro-2018.jpg";
import milkaWalkImage from "../assets/milka-carrusel-2.jpg";
import winterPortraitImage from "../assets/propuesta-cata-anillo-nieve-2025.jpg";
import type { GalleryMedia, GalleryPageResult, UploadRequest, UploadTicket } from "./galleryApi";
import type { GallerySession } from "./gallerySession";

const DEMO_SESSION_SECONDS = 24 * 60 * 60;
const DEMO_PROCESSING_DELAY_MS = 700;
const SEEDED_BATCH_ID = "33333333-3333-4333-8333-333333333333";

interface DemoMedia extends GalleryMedia {
  localObjectUrl?: string;
}

function seededImage(
  id: string,
  now: number,
  minutesAgo: number,
  image: string,
  displayName: string,
  caption: string,
): DemoMedia {
  const createdAt = new Date(now - minutesAgo * 60 * 1000).toISOString();
  return {
    id,
    mediaKind: "image",
    status: "READY",
    createdAt,
    readyAt: createdAt,
    displayName,
    caption,
    mediaUrl: image,
    thumbnailUrl: image,
  };
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
    {
      id: "44444444-4444-4444-8444-444444444444",
      mediaKind: "image",
      status: "READY",
      createdAt: new Date(now - 7 * 60 * 1000).toISOString(),
      displayName: "Laura",
      caption: "Un instante antes de la ceremonia.",
      mediaUrl: ceremonyImage,
      thumbnailUrl: ceremonyImage,
    },
    {
      id: "55555555-5555-4555-8555-555555555555",
      mediaKind: "image",
      status: "READY",
      createdAt: new Date(now - 9 * 60 * 1000).toISOString(),
      displayName: "Andrés y Sofía",
      caption: "Una aventura que apenas comienza.",
      mediaUrl: proposalImage,
      thumbnailUrl: proposalImage,
    },
    {
      id: "66666666-6666-4666-8666-666666666666",
      mediaKind: "image",
      status: "READY",
      createdAt: new Date(now - 11 * 60 * 1000).toISOString(),
      displayName: "María",
      caption: "Los pequeños momentos también cuentan.",
      mediaUrl: homeImage,
      thumbnailUrl: homeImage,
    },
    {
      id: "77777777-7777-4777-8777-777777777777",
      mediaKind: "image",
      status: "READY",
      createdAt: new Date(now - 13 * 60 * 1000).toISOString(),
      displayName: "Amigos de siempre",
      caption: "Celebrando juntos, como siempre.",
      mediaUrl: friendsImage,
      thumbnailUrl: friendsImage,
    },
    {
      id: "88888888-8888-4888-8888-888888888888",
      mediaKind: "image",
      status: "READY",
      createdAt: new Date(now - 15 * 60 * 1000).toISOString(),
      displayName: "Camila",
      caption: "El viaje hasta este día.",
      mediaUrl: landscapeImage,
      thumbnailUrl: landscapeImage,
    },
    {
      id: "99999999-9999-4999-8999-999999999999",
      mediaKind: "image",
      status: "READY",
      createdAt: new Date(now - 17 * 60 * 1000).toISOString(),
      displayName: "Daniel",
      caption: "Una mirada que dice todo.",
      mediaUrl: portraitImage,
      thumbnailUrl: portraitImage,
    },
    {
      id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      mediaKind: "image",
      status: "READY",
      createdAt: new Date(now - 19 * 60 * 1000).toISOString(),
      displayName: "Familia",
      caption: "El comienzo de una gran celebración.",
      mediaUrl: celebrationImage,
      thumbnailUrl: celebrationImage,
    },
    seededImage(
      "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      now,
      21,
      snowFamilyImage,
      "Natalia",
      "Una historia para celebrar siempre.",
    ),
    seededImage(
      "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      now,
      23,
      puppyImage,
      "Milka",
      "Lista para acompañar la fiesta.",
    ),
    seededImage(
      "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      now,
      25,
      beachImage,
      "Valentina y Juan",
      "Recuerdos de todos los caminos recorridos.",
    ),
    seededImage(
      "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      now,
      27,
      madridImage,
      "Paula",
      "Desde lejos, pero siempre cerca.",
    ),
    seededImage(
      "ffffffff-ffff-4fff-8fff-ffffffffffff",
      now,
      29,
      coupleImage,
      "Sebastián",
      "Una tarde para recordar.",
    ),
    seededImage(
      "12121212-1212-4212-8212-121212121212",
      now,
      31,
      milkaFamilyImage,
      "La familia completa",
      "Todos juntos para el gran día.",
    ),
    seededImage(
      "13131313-1313-4313-8313-131313131313",
      now,
      33,
      yesImage,
      "Juliana",
      "El sí que empezó esta celebración.",
    ),
    seededImage(
      "14141414-1414-4414-8414-141414141414",
      now,
      35,
      venueImage,
      "Felipe",
      "El lugar donde nos encontraremos.",
    ),
    seededImage(
      "15151515-1515-4515-8515-151515151515",
      now,
      37,
      homeMomentImage,
      "Isabella",
      "La felicidad también vive en lo cotidiano.",
    ),
    seededImage(
      "16161616-1616-4616-8616-161616161616",
      now,
      39,
      reunionImage,
      "Santiago",
      "Cada reencuentro nos trajo hasta aquí.",
    ),
    seededImage(
      "17171717-1717-4717-8717-171717171717",
      now,
      41,
      milkaWalkImage,
      "Milka y amigos",
      "También tenemos nuestra invitada especial.",
    ),
    seededImage(
      "18181818-1818-4818-8818-181818181818",
      now,
      43,
      winterPortraitImage,
      "Carolina",
      "Un momento que cambió todo.",
    ),
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
