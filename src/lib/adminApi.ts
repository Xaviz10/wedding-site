import type { GalleryMedia } from "./galleryApi";
import { clearAdminSession, type AdminSession } from "./adminAuth";

export interface AdminMedia extends GalleryMedia {
  originalFileName: string;
}

export interface AdminMediaPage {
  items: AdminMedia[];
  nextCursor?: string;
}

export interface AdminDownload {
  id: string;
  fileName: string;
  url: string;
}

interface ApiErrorBody {
  message?: string;
}

export class AdminApiError extends Error {
  public constructor(message: string, public readonly status: number) {
    super(message);
  }
}

function apiBaseUrl(): string {
  const value = (import.meta.env.VITE_WEDDING_API_URL ?? "").trim().replace(/\/$/, "");
  if (!value) throw new AdminApiError("Falta configurar VITE_WEDDING_API_URL.", 0);
  return value;
}

async function adminRequest<T>(
  path: string,
  session: AdminSession,
  init?: RequestInit,
  fetcher: typeof fetch = fetch,
): Promise<T> {
  const response = await fetcher(`${apiBaseUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${session.idToken}`,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  if (response.ok) return response.json() as Promise<T>;
  let body: ApiErrorBody = {};
  try {
    body = await response.json() as ApiErrorBody;
  } catch {
    // The HTTP status is sufficient for a fallback message.
  }
  // A 401 means the token itself is no longer usable. A 403 means Cognito
  // authenticated the user but the API rejected an authorization claim; keep
  // that session so the admin page can show the real error instead of flashing
  // back to its login screen.
  if (response.status === 401) clearAdminSession();
  throw new AdminApiError(body.message ?? "No fue posible completar la operación administrativa.", response.status);
}

export function listAdminMedia(session: AdminSession, cursor?: string): Promise<AdminMediaPage> {
  const parameters = new URLSearchParams({ limit: "50" });
  if (cursor) parameters.set("cursor", cursor);
  return adminRequest(`/admin/media?${parameters.toString()}`, session);
}

export function deleteAdminMedia(session: AdminSession, mediaIds: string[]): Promise<{ deletedMediaIds: string[] }> {
  return adminRequest("/admin/media", session, {
    method: "DELETE",
    body: JSON.stringify({ mediaIds }),
  });
}

export function createAdminDownloads(session: AdminSession, mediaIds: string[]): Promise<{ items: AdminDownload[]; expiresIn: number }> {
  return adminRequest("/admin/downloads", session, {
    method: "POST",
    body: JSON.stringify({ mediaIds }),
  });
}

export function triggerAdminDownloads(items: readonly AdminDownload[], documentObject: Document = document): void {
  for (const item of items) {
    const anchor = documentObject.createElement("a");
    anchor.href = item.url;
    anchor.download = item.fileName;
    anchor.rel = "noreferrer";
    anchor.hidden = true;
    documentObject.body.append(anchor);
    anchor.click();
    anchor.remove();
  }
}
