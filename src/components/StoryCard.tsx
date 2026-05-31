import { motion, useReducedMotion } from "framer-motion";

interface StoryCardProps {
  title: string;
  meta: string;
  text: string;
  index: number;
}

export default function StoryCard({ title, meta, text, index }: StoryCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const direction = index % 2 === 0 ? -16 : 16;

  return (
    <motion.article
      initial={{ opacity: 0, x: shouldReduceMotion ? 0 : direction, y: shouldReduceMotion ? 0 : 22 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.95 }}
      className="paper-surface rounded-[8px] p-6"
    >
      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[var(--color-olive)]">{meta}</p>
      <h3 className="font-heading text-2xl leading-tight">{title}</h3>
      <p className="section-caption mt-3 text-[var(--color-forest)]/85">{text}</p>
    </motion.article>
  );
}
