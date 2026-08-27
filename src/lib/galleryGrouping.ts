import type { GalleryMedia } from "./galleryApi";

export interface GalleryMediaGroup {
  id: string;
  items: GalleryMedia[];
  displayName?: string;
  caption?: string;
}

export function groupGalleryMedia(items: readonly GalleryMedia[]): GalleryMediaGroup[] {
  const groups = new Map<string, GalleryMediaGroup>();

  for (const item of items) {
    const id = item.batchId ? `batch:${item.batchId}` : `media:${item.id}`;
    const existing = groups.get(id);
    if (existing) {
      existing.items.push(item);
      existing.displayName ??= item.displayName;
      existing.caption ??= item.caption;
      continue;
    }

    groups.set(id, {
      id,
      items: [item],
      ...(item.displayName ? { displayName: item.displayName } : {}),
      ...(item.caption ? { caption: item.caption } : {}),
    });
  }

  return [...groups.values()];
}
