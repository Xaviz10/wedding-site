import { motion, useReducedMotion } from "framer-motion";
import SectionWrapper from "../SectionWrapper";
import StoryCard from "../StoryCard";
import type { WeddingContent } from "../../types/wedding";

interface ProposalSectionProps {
  content: WeddingContent["proposal"];
}

export default function ProposalSection({ content }: ProposalSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <SectionWrapper
      id="propuesta"
      eyebrow="Capítulo 04"
      title="La propuesta"
      intro={content.intro}
      className="bg-[var(--color-ivory)]"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
        <motion.figure
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1 }}
          className="paper-surface relative overflow-hidden rounded-[8px] p-4 md:p-5"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] md:aspect-[4/4]">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#f2e9cc_0%,#d9d3c4_45%,#b8c4cf_100%)]" />
            <motion.div
              aria-hidden
              className="absolute bottom-0 left-0 right-0 h-[56%] bg-[linear-gradient(180deg,#9bacb8_0%,#78919f_65%,#5f7281_100%)]"
              animate={shouldReduceMotion ? undefined : { y: [0, -6, 0] }}
              transition={shouldReduceMotion ? undefined : { duration: 10, ease: "easeInOut", repeat: Infinity }}
              style={{ clipPath: "polygon(0% 100%, 17% 62%, 33% 74%, 47% 54%, 64% 72%, 79% 57%, 100% 100%)" }}
            />
            <motion.div
              aria-hidden
              className="absolute bottom-0 left-0 right-0 h-[48%] bg-[linear-gradient(180deg,#ecede8_0%,#d3d7dc_70%,#b7bec8_100%)]"
              animate={shouldReduceMotion ? undefined : { y: [0, -8, 0] }}
              transition={shouldReduceMotion ? undefined : { duration: 8.5, ease: "easeInOut", repeat: Infinity }}
              style={{ clipPath: "polygon(0% 100%, 0% 84%, 15% 64%, 28% 76%, 46% 50%, 57% 70%, 72% 58%, 86% 72%, 100% 60%, 100% 100%)" }}
            />
            <motion.div
              aria-hidden
              className="absolute bottom-0 left-0 right-0 h-[36%] bg-[linear-gradient(180deg,#ebe9df_0%,#c8c3b2_90%)]"
              animate={shouldReduceMotion ? undefined : { y: [0, -10, 0] }}
              transition={shouldReduceMotion ? undefined : { duration: 7, ease: "easeInOut", repeat: Infinity }}
              style={{ clipPath: "polygon(0% 100%, 0% 88%, 18% 74%, 30% 79%, 44% 68%, 58% 80%, 73% 69%, 88% 82%, 100% 74%, 100% 100%)" }}
            />
            <div className="wood-tint absolute bottom-0 left-0 right-0 h-[26%] opacity-75" />
          </div>
          <figcaption className="section-caption mt-3 text-[var(--color-forest)]/84">
            Un paisaje inmenso para una pregunta íntima.
          </figcaption>
        </motion.figure>

        <div className="grid gap-5">
          {content.beats.map((beat, index) => (
            <StoryCard key={beat.title} title={beat.title} meta="Suiza" text={beat.text} index={index} />
          ))}
          <a
            href={content.videoUrl}
            className="paper-surface inline-flex min-h-12 items-center justify-center rounded-[8px] px-5 py-3 text-sm uppercase tracking-[0.14em] text-[var(--color-terracotta)] transition hover:text-[var(--color-olive)]"
          >
            {content.videoLabel}
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
}
