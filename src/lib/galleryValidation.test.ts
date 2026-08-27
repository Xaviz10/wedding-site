import { galleryFileValidationError } from "./galleryValidation";

function file(name: string, type: string, size: number): File {
  const value = new File([new Uint8Array(Math.max(1, Math.min(size, 16)))], name, { type });
  Object.defineProperty(value, "size", { value: size });
  return value;
}

describe("gallery upload validation", () => {
  it("accepts supported image and video boundaries", () => {
    expect(galleryFileValidationError(file("photo.jpeg", "image/jpeg", 20 * 1024 * 1024))).toBeUndefined();
    expect(galleryFileValidationError(file("clip.mov", "video/quicktime", 500 * 1024 * 1024))).toBeUndefined();
  });

  it("rejects oversize, empty, unsupported, and mismatched files", () => {
    expect(galleryFileValidationError(file("large.png", "image/png", 20 * 1024 * 1024 + 1))).toContain("20 MB");
    expect(galleryFileValidationError(file("empty.webp", "image/webp", 0))).toContain("vacío");
    expect(galleryFileValidationError(file("photo.gif", "image/gif", 10))).toContain("JPEG");
    expect(galleryFileValidationError(file("renamed.jpg", "image/png", 10))).toContain("extensión");
  });
});
