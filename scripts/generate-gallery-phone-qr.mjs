import { networkInterfaces } from "node:os";
import process from "node:process";
import { fileURLToPath, URL } from "node:url";
import QRCode from "qrcode";

const DEFAULT_PORT = "5173";
const GALLERY_PATH = "/wedding-site/#/gallery";

function isPrivateIpv4(address) {
  if (/^10\./.test(address) || /^192\.168\./.test(address)) return true;
  const match = address.match(/^172\.(\d+)\./);
  return Boolean(match && Number(match[1]) >= 16 && Number(match[1]) <= 31);
}

function findLanAddress() {
  const candidates = Object.entries(networkInterfaces())
    .flatMap(([interfaceName, addresses = []]) => addresses.map((address) => ({ interfaceName, ...address })))
    .filter((address) => address.family === "IPv4" && !address.internal && isPrivateIpv4(address.address));

  return candidates.find((candidate) => candidate.interfaceName === "en0")?.address
    ?? candidates[0]?.address;
}

const host = process.env.GALLERY_PHONE_HOST?.trim() || findLanAddress();
const port = process.env.GALLERY_PHONE_PORT?.trim() || DEFAULT_PORT;

if (!host) {
  throw new Error(
    "No se encontró una dirección IPv4 privada. Define GALLERY_PHONE_HOST con la IP local de este computador.",
  );
}

const galleryUrl = `http://${host}:${port}${GALLERY_PATH}`;
const outputPath = fileURLToPath(new URL("../gallery-phone-qr.png", import.meta.url));

await QRCode.toFile(outputPath, galleryUrl, {
  errorCorrectionLevel: "M",
  margin: 3,
  width: 1024,
  color: {
    dark: "#24291fff",
    light: "#ffffffff",
  },
});

process.stdout.write(`QR generado: ${outputPath}\n`);
process.stdout.write(`URL para el teléfono: ${galleryUrl}\n`);
