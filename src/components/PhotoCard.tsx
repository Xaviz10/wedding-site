import { motion, useReducedMotion } from "framer-motion";
import type { GalleryPhoto } from "../types/wedding";

interface PhotoCardProps {
  photo: GalleryPhoto;
  index: number;
}

const formatClasses: Record<GalleryPhoto["format"], string> = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[16/10]",
  square: "aspect-square",
};

export default function PhotoCard({ photo, index }: PhotoCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const angle = shouldReduceMotion ? 0 : (index % 2 === 0 ? -1.4 : 1.4);

  return (
    <motion.figure
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24, rotate: angle }}
      whileInView={{ opacity: 1, y: 0, rotate: angle }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: shouldReduceMotion ? 0 : 1 }}
      className="paper-surface relative overflow-hidden rounded-[8px] p-3"
    >
      <div className={`overflow-hidden rounded-[6px] ${formatClasses[photo.format]}`}>
        <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <figcaption className="section-caption mt-3 text-[1.02rem] leading-tight text-[var(--color-forest)]/85">{photo.caption}</figcaption>
    </motion.figure>
  );
}
