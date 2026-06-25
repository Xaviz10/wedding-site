export interface RSVPInput {
  fullName: string;
  attending: "si" | "no";
  dietaryRestrictions: string;
  travelSupport: "si" | "no";
  messageToCouple: string;
}

export interface RSVPResult {
  id: string;
  receivedAt: string;
}

export interface RSVPSubmitOptions {
  transport?: (payload: RSVPInput) => Promise<RSVPResult>;
}

interface GoogleSheetsResponse {
  ok: boolean;
  id?: string;
  receivedAt?: string;
  error?: string;
}

const RSVP_REQUEST_TIMEOUT_MS = 15_000;

function getRSVPEndpoint(): string {
  const endpoint = (import.meta.env.VITE_RSVP_ENDPOINT ?? "").trim();

  if (!endpoint) {
    throw new Error("Falta configurar VITE_RSVP_ENDPOINT.");
  }

  let url: URL;

  try {
    url = new URL(endpoint);
  } catch {
    throw new Error("VITE_RSVP_ENDPOINT no es una URL válida.");
  }

  const isGoogleAppsScriptUrl =
    url.protocol === "https:" &&
    url.hostname === "script.google.com" &&
    url.pathname.startsWith("/macros/s/") &&
    url.pathname.endsWith("/exec");

  if (!isGoogleAppsScriptUrl) {
    throw new Error("VITE_RSVP_ENDPOINT debe ser la URL /exec publicada por Google Apps Script.");
  }

  return url.toString();
}

async function googleSheetsRSVPTransport(data: RSVPInput): Promise<RSVPResult> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), RSVP_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(getRSVPEndpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(data),
      redirect: "follow",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script respondió con ${response.status}.`);
    }

    let result: GoogleSheetsResponse;

    try {
      result = (await response.json()) as GoogleSheetsResponse;
    } catch {
      throw new Error("Google Apps Script devolvió una respuesta no válida.");
    }

    if (!result.ok || !result.id || !result.receivedAt) {
      throw new Error(result.error ?? "No fue posible guardar la confirmación.");
    }

    return {
      id: result.id,
      receivedAt: result.receivedAt,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("La confirmación tardó demasiado. Intenta de nuevo.");
    }

    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function submitRSVP(data: RSVPInput, options: RSVPSubmitOptions = {}): Promise<RSVPResult> {
  const transport = options.transport ?? googleSheetsRSVPTransport;
  return transport(data);
}
