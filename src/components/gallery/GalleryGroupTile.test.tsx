import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { GalleryMediaGroup } from "../../lib/galleryGrouping";
import GalleryGroupTile from "./GalleryGroupTile";

const group: GalleryMediaGroup = {
  id: "media:one",
  displayName: "Ana",
  items: [{
    id: "one",
    mediaKind: "image",
    status: "READY",
    createdAt: "2026-09-05T20:01:00Z",
    mediaUrl: "https://media.example/one.webp",
    thumbnailUrl: "https://media.example/one-thumb.webp",
  }],
};

describe("gallery group tile", () => {
  it("uses collage spans while preserving the tile interaction", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(<GalleryGroupTile group={group} size="large" onOpen={onOpen} />);

    const button = screen.getByRole("button", { name: "Abrir recuerdo de Ana" });
    expect(button.closest("li")).toHaveClass("col-span-2", "row-span-2");
    expect(button).toHaveClass("h-full");
    expect(button).not.toHaveClass("aspect-square");

    await user.click(button);
    expect(onOpen).toHaveBeenCalledWith(group);
  });

  it("keeps a normal tile square when the collage is disabled", () => {
    render(<GalleryGroupTile group={group} onOpen={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Abrir recuerdo de Ana" })).toHaveClass("aspect-square");
  });

  it("renders a generated video thumbnail as an image for mobile Safari", () => {
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

    const { container } = render(<GalleryGroupTile group={videoGroup} onOpen={vi.fn()} />);
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "https://media.example/video-thumbnail.webp",
    );
  });

  it("falls back to decoding a first video frame for legacy items without a thumbnail", () => {
    const videoGroup: GalleryMediaGroup = {
      id: "media:legacy-video",
      items: [{
        id: "legacy-video",
        mediaKind: "video",
        status: "READY",
        createdAt: "2026-09-05T20:02:00Z",
        mediaUrl: "https://media.example/legacy-video.mp4",
      }],
    };

    const { container } = render(<GalleryGroupTile group={videoGroup} onOpen={vi.fn()} />);
    expect(container.querySelector("video")).toHaveAttribute(
      "src",
      "https://media.example/legacy-video.mp4#t=0.001",
    );
  });
});
