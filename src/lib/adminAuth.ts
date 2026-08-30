const ADMIN_SESSION_KEY = "wedding-admin-session-v1";
const ADMIN_OAUTH_KEY = "wedding-admin-oauth-v1";
const OAUTH_TRANSACTION_TTL_MS = 10 * 60 * 1000;

export interface AdminSession {
  idToken: string;
  email: string;
  expiresAt: number;
}

interface OAuthTransaction {
  state: string;
  verifier: string;
  createdAt: number;
}

interface TokenResponse {
  id_token?: string;
}

interface IdTokenClaims {
  token_use?: string;
  email?: string;
  exp?: number;
  "cognito:groups"?: unknown;
}

function requiredEnvironment(name: "VITE_COGNITO_DOMAIN" | "VITE_COGNITO_CLIENT_ID" | "VITE_WEBSITE_URL"): string {
  const value = import.meta.env[name]?.trim().replace(/\/$/, "");
  if (!value) throw new Error(`Falta configurar ${name}.`);
  return value;
}

function authConfig() {
  const domain = requiredEnvironment("VITE_COGNITO_DOMAIN");
  const clientId = requiredEnvironment("VITE_COGNITO_CLIENT_ID");
  const websiteUrl = requiredEnvironment("VITE_WEBSITE_URL");
  return { domain, clientId, redirectUri: `${websiteUrl}/` };
}

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomValue(length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
}

function decodeClaims(token: string): IdTokenClaims {
  const payload = token.split(".")[1];
  if (!payload) throw new Error("Cognito devolvió un token inválido.");
  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(payload.length / 4) * 4, "=");
  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes)) as IdTokenClaims;
}

function groupsFromClaims(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((group): group is string => typeof group === "string");
  return typeof value === "string" ? value.split(",").map((group) => group.trim()).filter(Boolean) : [];
}

function scrubCallback(history: History = window.history, location: Location = window.location): void {
  history.replaceState(null, "", `${location.pathname}#/admin`);
}

export function isAdminHash(hash: string): boolean {
  return hash === "#/admin";
}

export function hasAdminOAuthCallback(search: string = window.location.search): boolean {
  const parameters = new URLSearchParams(search);
  return parameters.has("code") || parameters.has("error");
}

export async function beginAdminLogin(
  storage: Storage = window.sessionStorage,
  navigate: (url: string) => void = (url) => window.location.assign(url),
  now = Date.now(),
): Promise<void> {
  const { domain, clientId, redirectUri } = authConfig();
  const transaction: OAuthTransaction = {
    state: randomValue(32),
    verifier: randomValue(64),
    createdAt: now,
  };
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(transaction.verifier));
  storage.setItem(ADMIN_OAUTH_KEY, JSON.stringify(transaction));

  const parameters = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "openid email",
    state: transaction.state,
    code_challenge_method: "S256",
    code_challenge: base64Url(new Uint8Array(digest)),
  });
  navigate(`${domain}/oauth2/authorize?${parameters.toString()}`);
}

export async function completeAdminLogin(options: {
  fetcher?: typeof fetch;
  storage?: Storage;
  location?: Location;
  history?: History;
  now?: number;
} = {}): Promise<AdminSession> {
  const fetcher = options.fetcher ?? fetch;
  const storage = options.storage ?? window.sessionStorage;
  const location = options.location ?? window.location;
  const history = options.history ?? window.history;
  const now = options.now ?? Date.now();
  const parameters = new URLSearchParams(location.search);
  const oauthError = parameters.get("error_description") ?? parameters.get("error");
  if (oauthError) {
    storage.removeItem(ADMIN_OAUTH_KEY);
    scrubCallback(history, location);
    throw new Error(`Cognito rechazó el acceso: ${oauthError}`);
  }

  const code = parameters.get("code");
  const state = parameters.get("state");
  const rawTransaction = storage.getItem(ADMIN_OAUTH_KEY);
  if (!code || !state || !rawTransaction) throw new Error("No encontramos una sesión de inicio de sesión válida.");

  let transaction: OAuthTransaction;
  try {
    transaction = JSON.parse(rawTransaction) as OAuthTransaction;
  } catch {
    throw new Error("La sesión de inicio de sesión está dañada.");
  }
  if (transaction.state !== state || now - transaction.createdAt > OAUTH_TRANSACTION_TTL_MS) {
    storage.removeItem(ADMIN_OAUTH_KEY);
    scrubCallback(history, location);
    throw new Error("El inicio de sesión venció o no coincide. Intenta nuevamente.");
  }

  const { domain, clientId, redirectUri } = authConfig();
  const response = await fetcher(`${domain}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      code,
      code_verifier: transaction.verifier,
      redirect_uri: redirectUri,
    }),
  });
  const body = await response.json() as TokenResponse & { error_description?: string };
  if (!response.ok || !body.id_token) {
    storage.removeItem(ADMIN_OAUTH_KEY);
    scrubCallback(history, location);
    throw new Error(body.error_description ?? "Cognito no pudo completar el inicio de sesión.");
  }

  const claims = decodeClaims(body.id_token);
  if (
    claims.token_use !== "id"
    || typeof claims.email !== "string"
    || typeof claims.exp !== "number"
    || !groupsFromClaims(claims["cognito:groups"]).includes("admins")
    || claims.exp * 1000 <= now
  ) {
    storage.removeItem(ADMIN_OAUTH_KEY);
    scrubCallback(history, location);
    throw new Error("La cuenta autenticada no pertenece al grupo de administradores.");
  }

  const session: AdminSession = {
    idToken: body.id_token,
    email: claims.email,
    expiresAt: claims.exp * 1000,
  };
  storage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  storage.removeItem(ADMIN_OAUTH_KEY);
  scrubCallback(history, location);
  return session;
}

export function readAdminSession(
  storage: Storage = window.sessionStorage,
  now = Date.now(),
): AdminSession | undefined {
  const raw = storage.getItem(ADMIN_SESSION_KEY);
  if (!raw) return undefined;
  try {
    const session = JSON.parse(raw) as Partial<AdminSession>;
    if (
      typeof session.idToken === "string"
      && typeof session.email === "string"
      && typeof session.expiresAt === "number"
      && session.expiresAt > now
    ) return session as AdminSession;
  } catch {
    // Invalid session data is removed below.
  }
  storage.removeItem(ADMIN_SESSION_KEY);
  return undefined;
}

export function clearAdminSession(storage: Storage = window.sessionStorage): void {
  storage.removeItem(ADMIN_SESSION_KEY);
  storage.removeItem(ADMIN_OAUTH_KEY);
}

export function logoutAdmin(
  storage: Storage = window.sessionStorage,
  navigate: (url: string) => void = (url) => window.location.assign(url),
): void {
  const { domain, clientId, redirectUri } = authConfig();
  clearAdminSession(storage);
  const parameters = new URLSearchParams({ client_id: clientId, logout_uri: redirectUri });
  navigate(`${domain}/logout?${parameters.toString()}`);
}
