export const COLLAGE_MINIMUM_GROUPS = 8;

export type GalleryTileSize = "standard" | "large";

interface TilePlacement {
  column: number;
  row: number;
  span: number;
}

const COLLAGE_COLUMN_COUNTS = [4, 5, 6, 7, 8] as const;
const MINIMUM_ITEMS_BETWEEN_LARGE_TILES = 3;

export function shouldUseCollageLayout(groupCount: number): boolean {
  return groupCount >= COLLAGE_MINIMUM_GROUPS;
}

function stableHash(value: string): number {
  let hash = 2_166_136_261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }
  return hash >>> 0;
}

function tilePlacements(sizes: readonly GalleryTileSize[], columns: number): TilePlacement[] {
  const occupied: boolean[][] = [];

  function canPlace(row: number, column: number, span: number): boolean {
    if (column + span > columns) return false;
    for (let rowOffset = 0; rowOffset < span; rowOffset += 1) {
      for (let columnOffset = 0; columnOffset < span; columnOffset += 1) {
        if (occupied[row + rowOffset]?.[column + columnOffset]) return false;
      }
    }
    return true;
  }

  function occupy(row: number, column: number, span: number): void {
    for (let rowOffset = 0; rowOffset < span; rowOffset += 1) {
      occupied[row + rowOffset] ??= Array.from({ length: columns }, () => false);
      for (let columnOffset = 0; columnOffset < span; columnOffset += 1) {
        occupied[row + rowOffset]![column + columnOffset] = true;
      }
    }
  }

  return sizes.map((size) => {
    const span = size === "large" ? 2 : 1;
    for (let row = 0; ; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        if (!canPlace(row, column, span)) continue;
        occupy(row, column, span);
        return { row, column, span };
      }
    }
  });
}

function cellsBetween(startA: number, spanA: number, startB: number, spanB: number): number {
  const endA = startA + spanA - 1;
  const endB = startB + spanB - 1;
  if (endA < startB) return startB - endA - 1;
  if (endB < startA) return startA - endB - 1;
  return -1;
}

export function largeTilesAreSeparated(sizes: readonly GalleryTileSize[]): boolean {
  const largeIndexes = sizes.flatMap((size, index) => size === "large" ? [index] : []);
  if (largeIndexes.some((index, position) => {
    const nextIndex = largeIndexes[position + 1];
    return nextIndex !== undefined && nextIndex - index <= MINIMUM_ITEMS_BETWEEN_LARGE_TILES;
  })) return false;

  return COLLAGE_COLUMN_COUNTS.every((columns) => {
    const placements = tilePlacements(sizes, columns);
    return largeIndexes.every((index, position) => {
      const current = placements[index];
      if (!current) return false;
      return largeIndexes.slice(position + 1).every((nextIndex) => {
        const next = placements[nextIndex];
        if (!next) return false;
        const rowGap = cellsBetween(current.row, current.span, next.row, next.span);
        const columnGap = cellsBetween(current.column, current.span, next.column, next.span);
        // An empty grid cell must separate their edges, so two featured tiles
        // never touch at any of the gallery's responsive column counts.
        return rowGap >= 1 || columnGap >= 1;
      });
    });
  });
}

export function galleryTileSizes(groupIds: readonly string[]): GalleryTileSize[] {
  const sizes: GalleryTileSize[] = groupIds.map(() => "standard");
  if (!shouldUseCollageLayout(groupIds.length)) return sizes;

  const targetLargeTiles = Math.max(1, Math.ceil(groupIds.length / 14));
  const candidates = groupIds
    .map((id, index) => ({ index, score: stableHash(`${id}:wedding-collage`) }))
    .sort((left, right) => left.score - right.score || left.index - right.index);

  // Try each hashed candidate as a starting point. This produces a stable,
  // random-looking layout while finding the fullest non-touching selection.
  let best: number[] = [];
  for (let start = 0; start < candidates.length; start += 1) {
    const selected: number[] = [];
    const ordered = [...candidates.slice(start), ...candidates.slice(0, start)];
    for (const candidate of ordered) {
      const proposal = sizes.map((size, index) =>
        selected.includes(index) || index === candidate.index ? "large" : size,
      );
      if (!largeTilesAreSeparated(proposal)) continue;
      selected.push(candidate.index);
      if (selected.length === targetLargeTiles) break;
    }
    if (selected.length > best.length) best = selected;
    if (best.length === targetLargeTiles) break;
  }

  for (const index of best) sizes[index] = "large";
  return sizes;
}
