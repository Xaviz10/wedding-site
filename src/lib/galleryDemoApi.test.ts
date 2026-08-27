import {
  createDemoSession,
  createDemoUploadTicket,
  getDemoMedia,
  listDemoMedia,
  resetDemoGallery,
  uploadDemoMedia,
} from "./galleryDemoApi";

describe("local gallery demo", () => {
  beforeEach(() => resetDemoGallery());

  it("provides an anonymous local session and seeded gallery", () => {
    expect(createDemoSession(1_000_000)).toEqual({
      token: "local-gallery-demo",
      expiresAt: 1_000 + 24 * 60 * 60,
    });
    expect(listDemoMedia().items).toHaveLength(21);
    expect(listDemoMedia().items.every((item) => item.status === "READY")).toBe(true);
  });

  it("simulates upload progress, processing, and publication", async () => {
    vi.useFakeTimers();
    const originalCreateObjectUrl = URL.createObjectURL;
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => "blob:local-preview"),
    });

    try {
      const ticket = createDemoUploadTicket({
        fileName: "recuerdo.jpg",
        contentType: "image/jpeg",
        size: 10,
        displayName: "Invitada local",
      });
      const progress = vi.fn();
      const upload = uploadDemoMedia(
        ticket,
        new File(["photo"], "recuerdo.jpg", { type: "image/jpeg" }),
        progress,
      );

      await vi.runAllTimersAsync();
      await upload;

      expect(progress).toHaveBeenLastCalledWith(100);
      expect(getDemoMedia(ticket.mediaId)).toMatchObject({
        status: "READY",
        mediaUrl: "blob:local-preview",
        displayName: "Invitada local",
      });
      expect(listDemoMedia().items[0]).toMatchObject({ id: ticket.mediaId });
    } finally {
      vi.useRealTimers();
      if (originalCreateObjectUrl) {
        Object.defineProperty(URL, "createObjectURL", { configurable: true, value: originalCreateObjectUrl });
      } else {
        Reflect.deleteProperty(URL, "createObjectURL");
      }
    }
  });
});
