const SESSION_STORAGE_KEY = "wedding-gallery-session-v1";

export interface GallerySession {
  token: string;
  expiresAt: number;
}

interface BrowserLocation {
  hash: string;
  pathname: string;
  search: string;
}

interface BrowserHistory {
  replaceState(data: unknown, unused: string, url?: string | URL | null): void;
}

export function isGalleryHash(hash: string): boolean {
  return hash === "#/gallery" || hash.startsWith("#/gallery?");
}

export function consumeInviteToken(
  location: BrowserLocation = window.location,
  history: BrowserHistory = window.history,
): string | undefined {
  if (!isGalleryHash(location.hash)) return undefined;
  const query = location.hash.split("?", 2)[1];
  const inviteToken = query ? new URLSearchParams(query).get("invite")?.trim() : undefined;
  if (!inviteToken) return undefined;
  history.replaceState(null, "", `${location.pathname}${location.search}#/gallery`);
  return inviteToken;
}

export function readStoredSession(storage: Storage = window.localStorage, now = Date.now()): GallerySession | undefined {
  const raw = storage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw) as Partial<GallerySession>;
    if (typeof parsed.token !== "string" || typeof parsed.expiresAt !== "number" || parsed.expiresAt <= Math.floor(now / 1000)) {
      storage.removeItem(SESSION_STORAGE_KEY);
      return undefined;
    }
    return { token: parsed.token, expiresAt: parsed.expiresAt };
  } catch {
    storage.removeItem(SESSION_STORAGE_KEY);
    return undefined;
  }
}

export function storeSession(session: GallerySession, storage: Storage = window.localStorage): void {
  storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(storage: Storage = window.localStorage): void {
  storage.removeItem(SESSION_STORAGE_KEY);
}
