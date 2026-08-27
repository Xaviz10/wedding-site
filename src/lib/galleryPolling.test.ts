import { waitForProcessedMedia } from "./galleryPolling";

const session = { token: "opaque", expiresAt: 9_999_999_999 };

describe("media processing polling", () => {
  it("continues through processing and returns READY media", async () => {
    const fetchMedia = vi.fn()
      .mockResolvedValueOnce({ id: "id", mediaKind: "image", status: "PROCESSING", createdAt: "now" })
      .mockResolvedValueOnce({ id: "id", mediaKind: "image", status: "READY", createdAt: "now" });

    const result = await waitForProcessedMedia(session, "id", {
      fetchMedia,
      pause: async () => undefined,
      maxAttempts: 3,
    });

    expect(result.status).toBe("READY");
    expect(fetchMedia).toHaveBeenCalledTimes(2);
  });

  it("reports unsupported video and polling timeout", async () => {
    await expect(waitForProcessedMedia(session, "id", {
      fetchMedia: vi.fn().mockResolvedValue({ id: "id", mediaKind: "video", status: "UNSUPPORTED", createdAt: "now" }),
      pause: async () => undefined,
    })).rejects.toMatchObject({ code: undefined, status: 422 });

    await expect(waitForProcessedMedia(session, "id", {
      fetchMedia: vi.fn().mockResolvedValue({ id: "id", mediaKind: "video", status: "TRANSCODING", createdAt: "now" }),
      pause: async () => undefined,
      maxAttempts: 2,
    })).rejects.toMatchObject({ code: "PROCESSING_TIMEOUT", status: 408 });
  });
});
