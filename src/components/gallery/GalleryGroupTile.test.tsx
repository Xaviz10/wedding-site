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
});
