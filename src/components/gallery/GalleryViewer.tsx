import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";
import type { GalleryMediaGroup } from "../../lib/galleryGrouping";

interface GalleryViewerProps {
  group: GalleryMediaGroup;
  onClose(): void;
}

export default function GalleryViewer({ group, onClose }: GalleryViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | undefined>(undefined);
  const itemCount = group.items.length;
  const activeItem = group.items[activeIndex] ?? group.items[0];
  const hasMultipleItems = itemCount > 1;

  const moveBy = useCallback((amount: number): void => {
    if (!itemCount) return;
    setActiveIndex((current) => (current + amount + itemCount) % itemCount);
  }, [itemCount]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && hasMultipleItems) moveBy(-1);
      if (event.key === "ArrowRight" && hasMultipleItems) moveBy(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [hasMultipleItems, moveBy, onClose]);

  useEffect(() => {
    slidesRef.current?.querySelectorAll("video").forEach((video) => video.pause());
  }, [activeIndex]);

  function onTouchStart(event: TouchEvent<HTMLDivElement>): void {
    touchStartX.current = event.changedTouches[0]?.clientX;
  }

  function onTouchEnd(event: TouchEvent<HTMLDivElement>): void {
    const startX = touchStartX.current;
    touchStartX.current = undefined;
    const endX = event.changedTouches[0]?.clientX;
    if (!hasMultipleItems || startX === undefined || endX === undefined || Math.abs(endX - startX) < 44) return;
    moveBy(endX < startX ? 1 : -1);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={group.displayName ? `Recuerdos de ${group.displayName}` : "Visor de recuerdos"}
      className="fixed inset-0 z-[100] grid h-dvh max-h-dvh w-full max-w-full grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden overscroll-none bg-[#090b09] text-white"
    >
      <header className="relative z-20 flex min-h-16 items-center justify-between gap-3 border-b border-white/10 bg-black/35 px-3 backdrop-blur-xl [padding-top:env(safe-area-inset-top)] sm:px-5">
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar visor"
          className="grid h-11 w-11 touch-manipulation place-items-center rounded-full bg-white/10 text-2xl transition hover:bg-white/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          ×
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-sm font-semibold">{group.displayName || "Recuerdo de la boda"}</p>
          <p className="mt-0.5 text-[0.65rem] text-white/60">{activeIndex + 1} de {itemCount}</p>
        </div>
        {activeItem?.mediaUrl ? (
          <a
            href={activeItem.mediaUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center rounded-full px-3 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/82 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Abrir
          </a>
        ) : <span className="w-11" />}
      </header>

      <div
        ref={slidesRef}
        aria-label="Medios del grupo"
        className="relative min-h-0 min-w-0 overflow-hidden overscroll-contain"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex h-full min-h-0 min-w-0 transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {group.items.map((item, index) => (
            <div key={item.id} aria-hidden={index !== activeIndex} className="grid h-full min-h-0 w-full min-w-full max-w-full place-items-center overflow-hidden sm:p-6">
              {item.mediaUrl ? (
                item.mediaKind === "image" ? (
                  <img
                    src={item.mediaUrl}
                    alt={item.caption || "Foto compartida por un invitado"}
                    className="block h-full min-h-0 w-full min-w-0 max-w-full object-contain"
                  />
                ) : (
                  <video
                    src={item.mediaUrl}
                    controls={index === activeIndex}
                    playsInline
                    preload="metadata"
                    className="block h-full min-h-0 w-full min-w-0 max-w-full bg-black object-contain"
                  >
                    Tu navegador no puede reproducir este video.
                  </video>
                )
              ) : (
                <p className="text-sm text-white/60">Este archivo no está disponible.</p>
              )}
            </div>
          ))}
        </div>

        {hasMultipleItems && (
          <>
            <button
              type="button"
              onClick={() => moveBy(-1)}
              aria-label="Mostrar recuerdo anterior"
              className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-3xl shadow-lg backdrop-blur-md transition hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:grid"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => moveBy(1)}
              aria-label="Mostrar recuerdo siguiente"
              className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-3xl shadow-lg backdrop-blur-md transition hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:grid"
            >
              ›
            </button>
          </>
        )}
      </div>

      <footer className="relative z-20 max-h-[30dvh] overflow-y-auto overscroll-contain border-t border-white/10 bg-black/38 px-5 py-4 text-center backdrop-blur-xl [padding-bottom:max(1rem,env(safe-area-inset-bottom))]">
        {group.caption && <p className="font-editorial mx-auto max-w-2xl text-lg italic leading-snug text-white/90">“{group.caption}”</p>}
        {hasMultipleItems && (
          <div className="mt-3 flex justify-center gap-1">
            {group.items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Mostrar archivo ${index + 1} de ${itemCount}`}
                aria-current={index === activeIndex ? "true" : undefined}
                className="group/dot inline-flex h-6 w-6 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <span className={`block h-1.5 rounded-full transition-all ${index === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/35 group-hover/dot:bg-white/65"}`} aria-hidden />
              </button>
            ))}
          </div>
        )}
      </footer>
    </div>
  );
}
