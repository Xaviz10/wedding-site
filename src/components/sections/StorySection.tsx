import { motion, useReducedMotion } from "framer-motion";
import SectionWrapper from "../SectionWrapper";
import StoryCard from "../StoryCard";
import type { WeddingContent } from "../../types/wedding";

interface StorySectionProps {
  content: WeddingContent["story"];
}

export default function StorySection({ content }: StorySectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <SectionWrapper
      id="nuestra-historia"
      eyebrow="Capítulo 01"
      title="Nuestra historia"
      intro={content.intro}
      className="bg-[var(--color-ivory)]"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <motion.aside
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1 }}
          className="paper-surface--soft rounded-[8px] p-6 md:p-8"
        >
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-olive)]">Mensajes que iniciaron todo</p>
          <div className="mt-6 grid gap-4">
            {content.beats.slice(0, 3).map((beat, index) => (
              <article
                key={beat.title}
                className={`rounded-[6px] border border-[var(--color-olive)]/20 p-4 ${
                  index % 2 === 0 ? "mr-7" : "ml-7"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-terracotta)]">{beat.moment}</p>
                <p className="mt-2 section-caption">{beat.text}</p>
              </article>
            ))}
          </div>
        </motion.aside>

        <div className="grid gap-5 md:gap-6">
          {content.beats.map((beat, index) => (
            <StoryCard key={beat.title} title={beat.title} meta={beat.moment} text={beat.text} index={index} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
