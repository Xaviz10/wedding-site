import {
  COLLAGE_MINIMUM_GROUPS,
  galleryTileSizes,
  largeTilesAreSeparated,
  shouldUseCollageLayout,
} from "./galleryLayout";

function groupIds(count: number): string[] {
  return Array.from({ length: count }, (_, index) =>
    `${index % 2 === 0 ? "photo" : "video"}:${index}:guest-upload`,
  );
}

describe("gallery collage layout", () => {
  it("keeps small galleries uniform and enables the collage for larger galleries", () => {
    expect(shouldUseCollageLayout(COLLAGE_MINIMUM_GROUPS - 1)).toBe(false);
    expect(shouldUseCollageLayout(COLLAGE_MINIMUM_GROUPS)).toBe(true);
    expect(galleryTileSizes(groupIds(COLLAGE_MINIMUM_GROUPS - 1))).toEqual(
      Array.from({ length: COLLAGE_MINIMUM_GROUPS - 1 }, () => "standard"),
    );
  });

  it("assigns sparse 2-by-2 tiles that never touch at any responsive column count", () => {
    const sizes = galleryTileSizes(groupIds(36));

    expect(sizes.filter((size) => size === "large")).toHaveLength(3);
    expect(sizes.filter((size) => size === "standard")).toHaveLength(33);
    expect(largeTilesAreSeparated(sizes)).toBe(true);
  });

  it("is random-looking but stable for the same ordered media", () => {
    const ids = groupIds(24);
    const first = galleryTileSizes(ids, "one-gallery-visit");

    expect(galleryTileSizes(ids, "one-gallery-visit")).toEqual(first);
    expect(galleryTileSizes(ids, "another-gallery-visit")).not.toEqual(first);
  });
});
