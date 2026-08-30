import { clearSession, type GallerySession } from "./gallerySession";
import {
  createDemoSession,
  createDemoUploadTicket,
  getDemoMedia,
  isGalleryDemoMode,
  listDemoMedia,
  uploadDemoMedia,
} from "./galleryDemoApi";

export type GalleryMediaKind = "image" | "video";
export type GalleryMediaStatus = "AWAITING_UPLOAD" | "PROCESSING" | "TRANSCODING" | "READY" | "UNSUPPORTED" | "FAILED";

export interface GalleryMedia {
  id: string;
  mediaKind: GalleryMediaKind;
  status: GalleryMediaStatus;
  createdAt: string;
  readyAt?: string;
  batchId?: string;
  displayName?: string;
  caption?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  errorCode?: string;
}

export interface GalleryPageResult {
  items: GalleryMedia[];
  nextCursor?: string;
}

export interface UploadRequest {
  fileName: string;
  contentType: string;
  size: number;
  batchId?: string;
  displayName?: string;
  caption?: string;
}

export interface UploadTicket {
  mediaId: string;
  expiresAt: number;
  upload: {
    url: string;
    fields: Record<string, string>;
  };
}

interface ApiErrorBody {
  message?: string;
  error?: string;
}

const API_REQUEST_TIMEOUT_MS = 30_000;
const IMAGE_UPLOAD_TIMEOUT_MS = 2 * 60_000;
const VIDEO_UPLOAD_TIMEOUT_MS = 30 * 60_000;

export class GalleryApiError extends Error {
  public constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
  }
}

export class SessionExpiredError extends GalleryApiError {}

function apiBaseUrl(): string {
  const value = (import.meta.env.VITE_WEDDING_API_URL ?? "").trim().replace(/\/$/, "");
  if (!value) throw new GalleryApiError("La galería todavía no está configurada.", 0, "MISSING_API_URL");
  return value;
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) return response.json() as Promise<T>;
  let body: ApiErrorBody = {};
  try {
    body = await response.json() as ApiErrorBody;
  } catch {
    // The status code still provides a useful fallback.
  }
  const message = body.message ?? "No fue posible comunicarnos con la galería.";
  if (response.status === 401 || response.status === 403) {
    clearSession();
    throw new SessionExpiredError("Tu acceso venció. Abre nuevamente el enlace del código QR.", response.status, body.error);
  }
  throw new GalleryApiError(message, response.status, body.error);
}

async function fetchWithTimeout(
  fetcher: typeof fetch,
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), API_REQUEST_TIMEOUT_MS);
  try {
    return await fetcher(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new GalleryApiError(
        "La galería tardó demasiado en responder. Revisa tu conexión e intenta nuevamente.",
        0,
        "API_TIMEOUT",
      );
    }
    throw error;
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}

export async function exchangeInviteToken(inviteToken: string, fetcher: typeof fetch = fetch): Promise<GallerySession> {
  if (isGalleryDemoMode()) return createDemoSession();
  const response = await fetchWithTimeout(fetcher, `${apiBaseUrl()}/session`, {
    method: "POST",
    headers: { "X-Invite-Token": inviteToken },
  });
  const body = await parseResponse<{ sessionToken: string; expiresAt: number }>(response);
  return { token: body.sessionToken, expiresAt: body.expiresAt };
}

async function authorizedRequest<T>(path: string, session: GallerySession, init?: RequestInit): Promise<T> {
  const response = await fetchWithTimeout(fetch, `${apiBaseUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${session.token}`,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  return parseResponse<T>(response);
}

export async function createUploadTicket(session: GallerySession, request: UploadRequest): Promise<UploadTicket> {
  if (isGalleryDemoMode()) return createDemoUploadTicket(request);
  return authorizedRequest("/uploads", session, { method: "POST", body: JSON.stringify(request) });
}

export async function getMedia(session: GallerySession, id: string): Promise<GalleryMedia> {
  if (isGalleryDemoMode()) {
    const media = getDemoMedia(id);
    if (!media) throw new GalleryApiError("No encontramos este archivo local.", 404, "MEDIA_NOT_FOUND");
    return media;
  }
  return authorizedRequest(`/media/${encodeURIComponent(id)}`, session);
}

export async function listMedia(session: GallerySession, cursor?: string): Promise<GalleryPageResult> {
  if (isGalleryDemoMode()) return listDemoMedia();
  const params = new URLSearchParams({ limit: "24" });
  if (cursor) params.set("cursor", cursor);
  return authorizedRequest(`/media?${params.toString()}`, session);
}

export function uploadToPresignedPost(
  ticket: UploadTicket,
  file: File,
  onProgress: (percent: number) => void,
  createRequest: () => XMLHttpRequest = () => new XMLHttpRequest(),
): Promise<void> {
  if (isGalleryDemoMode()) return uploadDemoMedia(ticket, file, onProgress);
  return new Promise((resolve, reject) => {
    const request = createRequest();
    request.open("POST", ticket.upload.url);
    request.timeout = file.type.startsWith("video/") ? VIDEO_UPLOAD_TIMEOUT_MS : IMAGE_UPLOAD_TIMEOUT_MS;
    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    });
    request.addEventListener("load", () => {
      if (request.status >= 200 && request.status < 300) {
        onProgress(100);
        resolve();
      } else {
        reject(new GalleryApiError("S3 rechazó la carga del archivo.", request.status, "UPLOAD_REJECTED"));
      }
    });
    request.addEventListener("error", () => {
      reject(new GalleryApiError("La conexión se interrumpió durante la carga.", 0, "UPLOAD_NETWORK_ERROR"));
    });
    request.addEventListener("timeout", () => {
      reject(new GalleryApiError(
        "La carga tardó demasiado. Revisa tu conexión e intenta nuevamente.",
        0,
        "UPLOAD_TIMEOUT",
      ));
    });

    const form = new FormData();
    for (const [key, value] of Object.entries(ticket.upload.fields)) form.append(key, value);
    form.append("file", file);
    request.send(form);
  });
}
