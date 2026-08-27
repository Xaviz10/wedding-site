export const COLLAGE_MINIMUM_GROUPS = 8;

export type GalleryTileSize = "standard" | "wide" | "large";

export function shouldUseCollageLayout(groupCount: number): boolean {
  return groupCount >= COLLAGE_MINIMUM_GROUPS;
}

export function galleryTileSize(index: number, groupCount: number): GalleryTileSize {
  const patternIndex = index % 16;
  if (patternIndex === 0) return "large";
  if (groupCount >= 12 && patternIndex === 10) return "wide";
  return "standard";
}
