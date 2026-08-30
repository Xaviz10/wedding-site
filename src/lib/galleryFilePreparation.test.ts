import { isHeicFile, prepareGalleryFile } from "./galleryFilePreparation";

function file(name: string, type: string, contents = "image"): File {
  return new File([contents], name, { type, lastModified: 1234 });
}

describe("iPhone gallery file preparation", () => {
  it("recognizes HEIC and HEIF from MIME types and case-insensitive extensions", () => {
    expect(isHeicFile(file("IMG_1001", "image/heic"))).toBe(true);
    expect(isHeicFile(file("IMG_1002.HEIF", ""))).toBe(true);
    expect(isHeicFile(file("photo.jpg", "image/jpeg"))).toBe(false);
  });

  it("converts an HEIC photo to a JPEG File with an upload-safe name", async () => {
    const converter = vi.fn(async () => new Blob(["jpeg"], { type: "image/jpeg" }));

    const prepared = await prepareGalleryFile(file("IMG_1003.HEIC", "image/heic"), converter);

    expect(prepared.convertedFromHeic).toBe(true);
    expect(prepared.file).toBeInstanceOf(File);
    expect(prepared.file.name).toBe("IMG_1003.jpg");
    expect(prepared.file.type).toBe("image/jpeg");
    expect(prepared.file.lastModified).toBe(1234);
    expect(converter).toHaveBeenCalledOnce();
  });

  it("leaves supported non-HEIC files unchanged", async () => {
    const original = file("photo.jpg", "image/jpeg");
    const converter = vi.fn();

    await expect(prepareGalleryFile(original, converter)).resolves.toEqual({
      file: original,
      convertedFromHeic: false,
    });
    expect(converter).not.toHaveBeenCalled();
  });

  it("rejects oversized HEIC photos before decoding them", async () => {
    const original = file("large.heic", "image/heic");
    Object.defineProperty(original, "size", { value: 20 * 1024 * 1024 + 1 });
    const converter = vi.fn();

    await expect(prepareGalleryFile(original, converter)).rejects.toThrow("20 MB");
    expect(converter).not.toHaveBeenCalled();
  });

  it("returns a guest-friendly error if HEIC decoding fails", async () => {
    const converter = vi.fn(async () => {
      throw new Error("decoder failure");
    });

    await expect(prepareGalleryFile(file("broken.heic", "image/heic"), converter))
      .rejects.toThrow("No pudimos convertir esta foto HEIC");
  });
});
