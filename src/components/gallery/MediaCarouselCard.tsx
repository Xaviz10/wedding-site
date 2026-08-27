import { useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import type { GalleryMedia } from "../../lib/galleryApi";
import type { GalleryMediaGroup } from "../../lib/galleryGrouping";

interface MediaCarouselCardProps {
  group: GalleryMediaGroup;
}

function MediaMetadata({ group }: MediaCarouselCardProps) {
  if (!group.caption && !group.displayName) return null;
  return (
    <div className="px-2 pb-2 pt-4">
      {group.caption && <p className="font-editorial text-xl italic leading-snug">“{group.caption}”</p>}
      {group.displayName && <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-olive)]">— {group.displayName}</p>}
    </div>
  );
}

function SingleMediaCard({ group }: MediaCarouselCardProps) {
  const item = group.items[0];
  if (!item) return null;

  return (
    <article className="paper-surface mb-5 break-inside-avoid overflow-hidden rounded-[8px] p-3">
      {item.mediaKind === "image" && item.mediaUrl ? (
        <a href={item.mediaUrl} target="_blank" rel="noreferrer" aria-label="Abrir foto en tamaño completo">
          <img
            src={item.thumbnailUrl ?? item.mediaUrl}
            alt={item.caption || "Foto compartida por un invitado"}
            loading="lazy"
            className="h-auto w-full rounded-[6px]"
          />
        </a>
      ) : item.mediaUrl ? (
        <video controls preload="metadata" playsInline className="aspect-video w-full rounded-[6px] bg-black" src={item.mediaUrl}>
          Tu navegador no puede reproducir este video.
        </video>
      ) : null}
      <MediaMetadata group={group} />
    </article>
  );
}

function MediaSlide({ item }: { item: GalleryMedia }) {
  if (!item.mediaUrl) {
    return <div className="grid h-full w-full place-items-center bg-[var(--color-forest)]/10 text-sm">Archivo no disponible</div>;
  }

  if (item.mediaKind === "image") {
    return (
      <a href={item.mediaUrl} target="_blank" rel="noreferrer" aria-label="Abrir foto en tamaño completo" className="block h-full w-full">
        <img
          src={item.thumbnailUrl ?? item.mediaUrl}
          alt={item.caption || "Foto compartida por un invitado"}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </a>
    );
  }

  return (
    <video controls preload="metadata" playsInline className="h-full w-full bg-black object-contain" src={item.mediaUrl}>
      Tu navegador no puede reproducir este video.
    </video>
  );
}

export default function MediaCarouselCard({ group }: MediaCarouselCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | undefined>(undefined);
  const itemCount = group.items.length;
  const hasMultipleItems = itemCount > 1;

  function moveBy(amount: number): void {
    setActiveIndex((current) => (current + amount + itemCount) % itemCount);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (!hasMultipleItems) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveBy(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveBy(1);
    }
  }

  function onTouchStart(event: TouchEvent<HTMLDivElement>): void {
    touchStartX.current = event.changedTouches[0]?.clientX;
  }

  function onTouchEnd(event: TouchEvent<HTMLDivElement>): void {
    const startX = touchStartX.current;
    touchStartX.current = undefined;
    const endX = event.changedTouches[0]?.clientX;
    if (startX === undefined || endX === undefined || Math.abs(endX - startX) < 40) return;
    moveBy(endX < startX ? 1 : -1);
  }

  if (!hasMultipleItems) return <SingleMediaCard group={group} />;

  const owner = group.displayName ? ` por ${group.displayName}` : "";

  return (
    <article className="paper-surface mb-5 break-inside-avoid overflow-hidden rounded-[8px] p-3">
      <div
        role="region"
        aria-label={`${hasMultipleItems ? "Carrusel de recuerdos" : "Recuerdo compartido"}${owner}`}
        aria-roledescription={hasMultipleItems ? "carrusel" : undefined}
        tabIndex={hasMultipleItems ? 0 : undefined}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative aspect-square overflow-hidden rounded-[6px] bg-black/5 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-olive)] focus-visible:ring-offset-2"
      >
        <div
          className="flex h-full transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {group.items.map((item, index) => (
            <div
              key={item.id}
              aria-hidden={index !== activeIndex}
              className="h-full min-w-full"
            >
              <MediaSlide item={item} />
            </div>
          ))}
        </div>

        {hasMultipleItems && (
          <>
            <button
              type="button"
              onClick={() => moveBy(-1)}
              aria-label="Mostrar recuerdo anterior"
              className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/45 bg-[rgba(252,251,248,0.88)] text-2xl text-[var(--color-forest)] shadow-md backdrop-blur-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-olive)] md:h-10 md:w-10"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => moveBy(1)}
              aria-label="Mostrar recuerdo siguiente"
              className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/45 bg-[rgba(252,251,248,0.88)] text-2xl text-[var(--color-forest)] shadow-md backdrop-blur-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-olive)] md:h-10 md:w-10"
            >
              ›
            </button>
            <p className="absolute right-2 top-2 rounded-full bg-[rgba(252,251,248,0.88)] px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.12em] text-[var(--color-forest)] shadow-sm backdrop-blur-sm" aria-live="polite">
              {activeIndex + 1} / {itemCount}
            </p>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1 rounded-full bg-white/60 px-2 py-1.5 shadow-sm backdrop-blur-md">
              {group.items.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Mostrar archivo ${index + 1} de ${itemCount}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  className="group/dot inline-flex h-6 w-6 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-forest)]"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all ${
                      index === activeIndex
                        ? "w-5 bg-[var(--color-forest)]"
                        : "w-1.5 bg-[var(--color-forest)]/45 group-hover/dot:bg-[var(--color-forest)]/70"
                    }`}
                    aria-hidden
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <MediaMetadata group={group} />
    </article>
  );
}
