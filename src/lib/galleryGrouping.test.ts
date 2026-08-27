import type { GalleryMedia } from "./galleryApi";
import { groupGalleryMedia } from "./galleryGrouping";

const batchId = "33333333-3333-4333-8333-333333333333";
const batchItems: GalleryMedia[] = [
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

describe("gallery grouping", () => {
  it("keeps one upload batch together and leaves individual uploads separate", () => {
    const groups = groupGalleryMedia([
      ...batchItems,
      { ...batchItems[0]!, id: "single", batchId: undefined },
    ]);

    expect(groups).toHaveLength(2);
    expect(groups[0]).toMatchObject({ displayName: "Ana", caption: "La ceremonia" });
    expect(groups[0]?.items).toHaveLength(2);
    expect(groups[1]?.items).toHaveLength(1);
  });
});
