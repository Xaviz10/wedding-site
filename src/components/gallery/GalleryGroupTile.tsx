import type { GalleryMediaGroup } from "../../lib/galleryGrouping";
import type { GalleryTileSize } from "../../lib/galleryLayout";

interface GalleryGroupTileProps {
  group: GalleryMediaGroup;
  size?: GalleryTileSize;
  onOpen(group: GalleryMediaGroup): void;
}

const TILE_SIZE_CLASSES: Record<GalleryTileSize, string> = {
  standard: "",
  large: "col-span-2 row-span-2",
};

export default function GalleryGroupTile({ group, size, onOpen }: GalleryGroupTileProps) {
  const cover = group.items[0];
  if (!cover) return null;

  const count = group.items.length;
  const owner = group.displayName ? ` de ${group.displayName}` : "";

  return (
    <li className={`min-h-0 min-w-0 ${size ? TILE_SIZE_CLASSES[size] : ""}`}>
      <button
        type="button"
        onClick={() => onOpen(group)}
        aria-label={`Abrir ${count === 1 ? "recuerdo" : `grupo de ${count} recuerdos`}${owner}`}
        className={`group relative block w-full touch-manipulation overflow-hidden bg-[var(--color-forest)]/10 text-left focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-gold)] ${size ? "h-full min-h-0" : "aspect-square"}`}
      >
        {cover.mediaUrl ? (
          cover.mediaKind === "image" ? (
            <img
              src={cover.thumbnailUrl ?? cover.mediaUrl}
              alt=""
              loading="lazy"
              className="pointer-events-none h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
            />
          ) : (
            <video
              src={cover.mediaUrl}
              poster={cover.thumbnailUrl}
              muted
              playsInline
              preload="metadata"
              className="pointer-events-none h-full w-full bg-black object-cover"
            />
          )
        ) : (
          <span className="grid h-full place-items-center text-xs text-[var(--color-forest)]/55">Procesando</span>
        )}

        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10 opacity-80" aria-hidden />

        {count > 1 && (
          <span className="pointer-events-none absolute right-2 top-2 inline-flex min-h-7 items-center gap-1.5 rounded-full bg-black/62 px-2.5 text-[0.68rem] font-semibold text-white shadow-sm backdrop-blur-md">
            <svg viewBox="0 0 18 18" className="h-3.5 w-3.5" fill="none" aria-hidden>
              <rect x="5.25" y="2.25" width="10.5" height="10.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12.5 15.75H3.75a1.5 1.5 0 0 1-1.5-1.5V5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {count}
          </span>
        )}

        {group.displayName && (
          <span className="font-editorial pointer-events-none absolute inset-x-2 bottom-2 truncate text-sm font-medium italic text-white drop-shadow-md">
            {group.displayName}
          </span>
        )}

        {cover.mediaKind === "video" && (
          <span className="pointer-events-none absolute bottom-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-white/88 text-[0.65rem] text-[var(--color-forest)] shadow-sm" aria-label="Video">
            ▶
          </span>
        )}
      </button>
    </li>
  );
}
