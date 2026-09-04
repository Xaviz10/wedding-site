import { uploadToPresignedPost, type UploadTicket } from "./galleryApi";

describe("presigned S3 upload", () => {
  it("submits all signed fields and reports progress", async () => {
    const requestListeners = new Map<string, EventListener>();
    const uploadListeners = new Map<string, EventListener>();
    const request = {
      status: 204,
      upload: {
        addEventListener: (name: string, listener: EventListener) => uploadListeners.set(name, listener),
      },
      open: vi.fn(),
      addEventListener: (name: string, listener: EventListener) => requestListeners.set(name, listener),
      send: vi.fn(() => {
        uploadListeners.get("progress")?.({ lengthComputable: true, loaded: 5, total: 10 } as ProgressEvent);
        requestListeners.get("load")?.(new Event("load"));
      }),
    } as unknown as XMLHttpRequest;
    const ticket: UploadTicket = {
      mediaId: "id",
      expiresAt: 1,
      upload: { url: "https://s3.example.test", fields: { key: "uploads/id/source.jpg", policy: "signed" } },
    };
    const progress = vi.fn();

    await uploadToPresignedPost(ticket, new File(["photo"], "photo.jpg", { type: "image/jpeg" }), progress, () => request);
    expect(request.open).toHaveBeenCalledWith("POST", "https://s3.example.test");
    expect(request.timeout).toBe(120_000);
    expect(request.send).toHaveBeenCalledWith(expect.any(FormData));
    expect(progress).toHaveBeenNthCalledWith(1, 1);
    expect(progress).toHaveBeenNthCalledWith(2, 50);
    expect(progress).toHaveBeenLastCalledWith(100);
  });

  it("reports iPhone-style progress when the browser does not mark the total computable", async () => {
    const requestListeners = new Map<string, EventListener>();
    const uploadListeners = new Map<string, EventListener>();
    const request = {
      status: 204,
      upload: {
        addEventListener: (name: string, listener: EventListener) => uploadListeners.set(name, listener),
      },
      open: vi.fn(),
      addEventListener: (name: string, listener: EventListener) => requestListeners.set(name, listener),
      send: vi.fn(() => {
        uploadListeners.get("progress")?.({ lengthComputable: false, loaded: 6, total: 0 } as ProgressEvent);
        requestListeners.get("load")?.(new Event("load"));
      }),
    } as unknown as XMLHttpRequest;
    const ticket: UploadTicket = {
      mediaId: "video-id",
      expiresAt: 1,
      upload: { url: "https://s3.example.test", fields: { key: "uploads/video-id/source.mov" } },
    };
    const progress = vi.fn();

    await uploadToPresignedPost(
      ticket,
      new File(["1234567890"], "video.mov", { type: "video/quicktime" }),
      progress,
      () => request,
    );

    expect(progress).toHaveBeenCalledWith(60);
    expect(progress).toHaveBeenLastCalledWith(100);
  });

  it("rejects an image upload that exceeds the browser timeout", async () => {
    const requestListeners = new Map<string, EventListener>();
    const request = {
      timeout: 0,
      upload: { addEventListener: vi.fn() },
      open: vi.fn(),
      addEventListener: (name: string, listener: EventListener) => requestListeners.set(name, listener),
      send: vi.fn(() => requestListeners.get("timeout")?.(new Event("timeout"))),
    } as unknown as XMLHttpRequest;
    const ticket: UploadTicket = {
      mediaId: "id",
      expiresAt: 1,
      upload: { url: "https://s3.example.test", fields: { key: "uploads/id/source.jpg" } },
    };

    await expect(uploadToPresignedPost(
      ticket,
      new File(["photo"], "photo.jpg", { type: "image/jpeg" }),
      vi.fn(),
      () => request,
    )).rejects.toMatchObject({ code: "UPLOAD_TIMEOUT" });
    expect(request.timeout).toBe(120_000);
  });
});
