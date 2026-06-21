import { motion, useReducedMotion } from "framer-motion";
import { useState, type KeyboardEvent } from "react";
import SectionWrapper from "../SectionWrapper";
import type { GalleryPhoto, WeddingContent } from "../../types/wedding";

interface GallerySectionProps {
  content: WeddingContent["gallery"];
}

interface GalleryPostcardProps {
  photo: GalleryPhoto;
  cardIndex: number;
  shouldReduceMotion: boolean | null;
}

const formatClasses: Record<GalleryPhoto["format"], string> = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[16/10]",
  square: "aspect-square",
};

const widthClasses = ["w-[82vw] max-w-[320px]", "w-[80vw] max-w-[340px]", "w-[78vw] max-w-[300px]"];
const offsetClasses = ["md:-translate-y-2", "md:translate-y-5", "md:-translate-y-4", "md:translate-y-3"];

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function GalleryPostcard({ photo, cardIndex, shouldReduceMotion }: GalleryPostcardProps) {
  const [isCaptionVisible, setIsCaptionVisible] = useState(false);

  const toggleCaption = () => {
    setIsCaptionVisible((current) => !current);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleCaption();
    }
  };

  return (
    <motion.figure
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20, rotate: shouldReduceMotion ? 0 : cardIndex % 2 === 0 ? -1.7 : 1.7 }}
      whileInView={{ opacity: 1, y: 0, rotate: shouldReduceMotion ? 0 : cardIndex % 2 === 0 ? -1.7 : 1.7 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.9 }}
      tabIndex={0}
      role="button"
      aria-pressed={isCaptionVisible}
      aria-label={`Mostrar descripción de la foto: ${photo.caption}`}
      onClick={toggleCaption}
      onKeyDown={onKeyDown}
      className={cx(
        "gallery-postcard paper-surface group relative shrink-0 cursor-pointer overflow-hidden rounded-[8px] p-3 transition",
        widthClasses[cardIndex % widthClasses.length],
        offsetClasses[cardIndex % offsetClasses.length],
      )}
    >
      <div className={cx("overflow-hidden rounded-[6px]", formatClasses[photo.format])}>
        <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover" loading="lazy" />
      </div>

      <figcaption className={cx("gallery-postcard-caption", isCaptionVisible && "is-visible")}>{photo.caption}</figcaption>
      <span className="gallery-postcard-hint">Toca para ver texto</span>
    </motion.figure>
  );
}

export default function GallerySection({ content }: GallerySectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <SectionWrapper
      id="galeria"
      title={content.title}
      intro={content.subtitle}
      className="bg-[var(--color-ivory)]"
    >
      <div className="gallery-shell grid gap-8 md:gap-10">
        {content.categories.map((category, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.article
              key={category.title}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.8 }}
              className={cx(
                "gallery-category-row grid items-start gap-5 rounded-[10px] p-3 md:p-4 lg:grid-cols-[minmax(0,0.3fr)_minmax(0,0.7fr)]",
                !isEven && "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1",
              )}
            >
              <aside className="gallery-category-note paper-surface--soft rounded-[8px] p-5 md:p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-olive)]">Colección {String(index + 1).padStart(2, "0")}</p>
                <h3 className="font-heading mt-2 text-2xl leading-[1] md:text-[1.8rem]">{category.title}</h3>
              </aside>

              <div className="gallery-lane" role="list" aria-label={`Galería ${category.title}`}>
                {category.photos.map((photo, photoIndex) => (
                  <GalleryPostcard
                    key={photo.src}
                    photo={photo}
                    cardIndex={index * 4 + photoIndex}
                    shouldReduceMotion={shouldReduceMotion}
                  />
                ))}
              </div>
            </motion.article>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
