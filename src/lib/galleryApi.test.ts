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
    expect(request.send).toHaveBeenCalledWith(expect.any(FormData));
    expect(progress).toHaveBeenNthCalledWith(1, 50);
    expect(progress).toHaveBeenLastCalledWith(100);
  });
});
