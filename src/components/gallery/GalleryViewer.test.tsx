import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { GalleryMediaGroup } from "../../lib/galleryGrouping";
import GalleryViewer from "./GalleryViewer";

const group: GalleryMediaGroup = {
  id: "batch:group",
  displayName: "Ana",
  caption: "La ceremonia",
  items: [
    {
      id: "first",
      batchId: "group",
      mediaKind: "image",
      status: "READY",
      createdAt: "2026-09-05T20:01:00Z",
      caption: "La ceremonia",
      mediaUrl: "https://media.example/first.webp",
    },
    {
      id: "second",
      batchId: "group",
      mediaKind: "image",
      status: "READY",
      createdAt: "2026-09-05T20:00:00Z",
      caption: "La ceremonia",
      mediaUrl: "https://media.example/second.webp",
    },
  ],
};

describe("full-screen gallery viewer", () => {
  it("shows shared metadata once and navigates the grouped media", async () => {
    const user = userEvent.setup();
    render(<GalleryViewer group={group} onClose={vi.fn()} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("gallery-viewer-shell", "grid-rows-[auto_minmax(0,1fr)_auto]");
    expect(dialog.parentElement).toBe(document.body);
    expect(screen.getByLabelText("Medios del grupo")).toHaveClass("gallery-viewer-stage");
    expect(screen.getByRole("img", { name: "La ceremonia" })).toHaveClass("gallery-viewer-media");
    expect(screen.getByRole("img", { name: "La ceremonia" }).parentElement).toHaveClass("gallery-viewer-media-frame");
    expect(screen.getByRole("img", { name: "La ceremonia" }).parentElement?.parentElement).toHaveClass("gallery-viewer-slide");
    expect(screen.getByText("1 de 2")).toBeInTheDocument();
    expect(screen.getAllByText(/La ceremonia/)).toHaveLength(1);
    expect(screen.getAllByText("Ana")).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: "Mostrar recuerdo siguiente" }));
    expect(screen.getByText("2 de 2")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Abrir" })).toHaveAttribute(
      "href",
      "https://media.example/second.webp",
    );
  });

  it("closes with Escape and restores page scrolling", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { unmount } = render(<GalleryViewer group={group} onClose={onClose} />);

    expect(document.body.style.overflow).toBe("hidden");
    expect(document.documentElement.style.overflow).toBe("hidden");
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
    unmount();
    expect(document.body.style.overflow).toBe("");
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("uses the generated thumbnail before a video starts playing", () => {
    const videoGroup: GalleryMediaGroup = {
      id: "media:video",
      items: [{
        id: "video",
        mediaKind: "video",
        status: "READY",
        createdAt: "2026-09-05T20:02:00Z",
        mediaUrl: "https://media.example/video.mp4",
        thumbnailUrl: "https://media.example/video-thumbnail.webp",
      }],
    };

    render(<GalleryViewer group={videoGroup} onClose={vi.fn()} />);
    expect(screen.getByRole("dialog").querySelector("video")).toHaveAttribute(
      "poster",
      "https://media.example/video-thumbnail.webp",
    );
    expect(screen.getByRole("button", { name: "Reproducir video" }).querySelector("img")).toHaveAttribute(
      "src",
      "https://media.example/video-thumbnail.webp",
    );
  });
});
