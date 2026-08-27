import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { GalleryMedia } from "../../lib/galleryApi";
import { groupGalleryMedia } from "../../lib/galleryGrouping";
import MediaCarouselCard from "./MediaCarouselCard";

const batchId = "33333333-3333-4333-8333-333333333333";
const items: GalleryMedia[] = [
  {
    id: "first",
    batchId,
    mediaKind: "image",
    status: "READY",
    createdAt: "2026-09-05T20:01:00Z",
    displayName: "Ana",
    caption: "La ceremonia",
    mediaUrl: "https://media.example/first.webp",
  },
  {
    id: "second",
    batchId,
    mediaKind: "image",
    status: "READY",
    createdAt: "2026-09-05T20:00:00Z",
    displayName: "Ana",
    caption: "La ceremonia",
    mediaUrl: "https://media.example/second.webp",
  },
];

describe("gallery media carousel", () => {
  it("groups one upload batch while leaving individual uploads separate", () => {
    const groups = groupGalleryMedia([
      ...items,
      { ...items[0], id: "single", batchId: undefined },
    ]);

    expect(groups).toHaveLength(2);
    expect(groups[0]).toMatchObject({ displayName: "Ana", caption: "La ceremonia" });
    expect(groups[0]?.items).toHaveLength(2);
    expect(groups[1]?.items).toHaveLength(1);
  });

  it("shows shared metadata once and navigates between square slides", async () => {
    const user = userEvent.setup();
    const [group] = groupGalleryMedia(items);
    render(<MediaCarouselCard group={group!} />);

    expect(screen.getByText("1 / 2")).toBeInTheDocument();
    expect(screen.getAllByText(/La ceremonia/)).toHaveLength(1);
    expect(screen.getAllByText(/Ana/)).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: "Mostrar recuerdo siguiente" }));
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "La ceremonia" })).toHaveAttribute(
      "src",
      "https://media.example/second.webp",
    );
  });

  it("preserves the original card proportions for an individual upload", () => {
    const [group] = groupGalleryMedia([{ ...items[0], batchId: undefined }]);
    render(<MediaCarouselCard group={group!} />);

    expect(screen.getByRole("img", { name: "La ceremonia" })).toHaveClass("h-auto", "w-full");
    expect(screen.queryByRole("button", { name: "Mostrar recuerdo siguiente" })).not.toBeInTheDocument();
  });
});
