import { motion, useReducedMotion } from "framer-motion";
import SectionWrapper from "../SectionWrapper";
import StoryCard from "../StoryCard";
import type { WeddingContent } from "../../types/wedding";

interface JourneySectionProps {
  content: WeddingContent["journey"];
}

export default function JourneySection({ content }: JourneySectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <SectionWrapper
      id="distancia-viajes-y-hogar"
      title="Distancia, viajes y hogar"
      intro={content.intro}
      className="bg-[var(--color-ivory)]"
    >
      <div className="paper-surface--soft relative mb-10 overflow-hidden rounded-[8px] px-5 py-8 md:px-10">
        <svg viewBox="0 0 960 210" className="h-[145px] w-full md:h-[180px]" aria-hidden>
          <motion.path
            d="M60 126C160 60 234 58 314 112C392 166 476 168 564 116C668 56 750 58 846 126"
            className="flowing-line"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.75 }}
            transition={{ duration: shouldReduceMotion ? 0 : 1.5 }}
          />
          <motion.path
            d="M862 124L893 124L893 90L927 90L927 156L893 156L893 124L862 124"
            stroke="var(--color-terracotta)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.75 }}
            transition={{ duration: shouldReduceMotion ? 0 : 1.15, delay: shouldReduceMotion ? 0 : 0.35 }}
          />
          <circle cx="60" cy="126" r="5.8" fill="var(--color-olive)" />
          <circle cx="846" cy="126" r="5.8" fill="var(--color-olive)" />
          <text x="32" y="162" fill="var(--color-forest)" fontSize="16">
            Colombia
          </text>
          <text x="786" y="162" fill="var(--color-forest)" fontSize="16">
            Portugal
          </text>
        </svg>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {content.beats.map((beat, index) => (
          <div key={beat.title} className={`${index === 1 ? "lg:translate-y-8" : ""}`}>
            <StoryCard title={beat.title} meta={beat.location} text={beat.text} index={index} />
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
