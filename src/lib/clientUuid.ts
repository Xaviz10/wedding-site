interface ClientCryptoSource {
  randomUUID?: () => string;
  getRandomValues?: (array: Uint8Array) => Uint8Array;
}

let fallbackSequence = 0;

function fillWithoutWebCrypto(bytes: Uint8Array): void {
  const sequence = Date.now() + fallbackSequence;
  fallbackSequence += 1;
  for (let index = 0; index < bytes.length; index += 1) {
    const sequenceByte = (sequence >>> ((index % 4) * 8)) & 0xff;
    bytes[index] = Math.floor(Math.random() * 256) ^ sequenceByte;
  }
}

export function createClientUuid(cryptoSource: ClientCryptoSource | null | undefined = globalThis.crypto): string {
  if (typeof cryptoSource?.randomUUID === "function") {
    try {
      return cryptoSource.randomUUID();
    } catch {
      // Some browsers expose randomUUID on an HTTP origin but reject the call.
    }
  }

  const bytes = new Uint8Array(16);
  if (typeof cryptoSource?.getRandomValues === "function") {
    try {
      cryptoSource.getRandomValues(bytes);
    } catch {
      fillWithoutWebCrypto(bytes);
    }
  } else {
    // These IDs group client uploads; they are not credentials or session tokens.
    fillWithoutWebCrypto(bytes);
  }

  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40;
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
