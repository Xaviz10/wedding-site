const HEIC_TYPES = new Set([
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);
const HEIC_EXTENSIONS = [".heic", ".heif"];
const MAX_SOURCE_IMAGE_BYTES = 20 * 1024 * 1024;

export interface PreparedGalleryFile {
  file: File;
  convertedFromHeic: boolean;
}

export type HeicToJpegConverter = (file: File) => Promise<Blob>;

export function isHeicFile(file: File): boolean {
  const normalizedType = file.type.toLowerCase();
  const normalizedName = file.name.toLowerCase();
  return HEIC_TYPES.has(normalizedType)
    || HEIC_EXTENSIONS.some((extension) => normalizedName.endsWith(extension));
}

function jpegFileName(fileName: string): string {
  const withoutHeicExtension = fileName.replace(/\.(?:heic|heif)$/i, "");
  return `${withoutHeicExtension || "foto-iphone"}.jpg`;
}

async function convertHeicToJpeg(file: File): Promise<Blob> {
  const { heicTo } = await import("heic-to/csp");
  return heicTo({
    blob: file,
    type: "image/jpeg",
    quality: 0.86,
  });
}

export async function prepareGalleryFile(
  file: File,
  converter: HeicToJpegConverter = convertHeicToJpeg,
): Promise<PreparedGalleryFile> {
  if (!isHeicFile(file)) return { file, convertedFromHeic: false };
  if (file.size <= 0) throw new Error("El archivo está vacío.");
  if (file.size > MAX_SOURCE_IMAGE_BYTES) throw new Error("La imagen supera 20 MB.");

  let jpegBlob: Blob;
  try {
    jpegBlob = await converter(file);
  } catch {
    throw new Error("No pudimos convertir esta foto HEIC. Intenta elegirla nuevamente.");
  }

  if (jpegBlob.size <= 0) throw new Error("La conversión de la foto HEIC produjo un archivo vacío.");

  return {
    file: new File([jpegBlob], jpegFileName(file.name), {
      type: "image/jpeg",
      lastModified: file.lastModified,
    }),
    convertedFromHeic: true,
  };
}
