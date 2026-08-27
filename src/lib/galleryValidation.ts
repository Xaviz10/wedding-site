const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/quicktime"];
const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_VIDEO_BYTES = 500 * 1024 * 1024;
const TYPE_EXTENSIONS: Record<string, readonly string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "video/mp4": [".mp4", ".m4v"],
  "video/quicktime": [".mov"],
};

export function galleryFileValidationError(file: File): string | undefined {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Usa una imagen JPEG, PNG o WebP, o un video MP4 o MOV.";
  }
  if (file.size <= 0) return "El archivo está vacío.";

  const extensions = TYPE_EXTENSIONS[file.type] ?? [];
  if (!extensions.some((extension) => file.name.toLowerCase().endsWith(extension))) {
    return "La extensión del archivo no coincide con su tipo.";
  }

  const isImage = file.type.startsWith("image/");
  if (file.size > (isImage ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES)) {
    return isImage ? "La imagen supera 20 MB." : "El video supera 500 MB.";
  }
  return undefined;
}
