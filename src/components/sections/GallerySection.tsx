import { motion, useReducedMotion } from "framer-motion";
import SectionWrapper from "../SectionWrapper";
import PhotoCard from "../PhotoCard";
import type { WeddingContent } from "../../types/wedding";

interface GallerySectionProps {
  content: WeddingContent["gallery"];
}

export default function GallerySection({ content }: GallerySectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <SectionWrapper
      id="galeria"
      eyebrow="Capítulo 05"
      title={content.title}
      intro={content.subtitle}
      className="bg-[var(--color-ivory)]"
    >
      <div className="grid gap-9 md:gap-12">
        {content.categories.map((category, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={category.title}
              className={`grid items-start gap-6 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)] ${
                isEven ? "" : "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1"
              }`}
            >
              <motion.aside
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : isEven ? -14 : 14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.95 }}
                className="paper-surface--soft rounded-[8px] p-6 md:p-7"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-olive)]">
                  Colección {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="font-heading mt-3 text-3xl leading-tight">{category.title}</h3>
              </motion.aside>

              <div className="grid gap-4 md:grid-cols-2">
                {category.photos.map((photo, photoIndex) => (
                  <div
                    key={photo.src}
                    className={photoIndex === 1 && index % 3 === 0 ? "md:translate-y-8" : photoIndex === 0 && index % 3 === 1 ? "md:-translate-y-6" : ""}
                  >
                    <PhotoCard photo={photo} index={photoIndex + index} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
