import {
  COLLAGE_MINIMUM_GROUPS,
  galleryTileSize,
  shouldUseCollageLayout,
} from "./galleryLayout";

describe("gallery collage layout", () => {
  it("keeps small galleries uniform and enables the collage for larger galleries", () => {
    expect(shouldUseCollageLayout(COLLAGE_MINIMUM_GROUPS - 1)).toBe(false);
    expect(shouldUseCollageLayout(COLLAGE_MINIMUM_GROUPS)).toBe(true);
  });

  it("keeps the featured tiles sparse", () => {
    const sizes = Array.from({ length: 12 }, (_, index) => galleryTileSize(index, 12));

    expect(sizes.filter((size) => size === "large")).toHaveLength(1);
    expect(sizes.filter((size) => size === "wide")).toHaveLength(1);
    expect(sizes.filter((size) => size === "standard")).toHaveLength(10);
    expect(galleryTileSize(10, 11)).toBe("standard");
    expect(galleryTileSize(16, 20)).toBe("large");
  });
});
