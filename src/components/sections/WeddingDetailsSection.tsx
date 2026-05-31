import { motion, useReducedMotion } from "framer-motion";
import SectionWrapper from "../SectionWrapper";
import RSVPForm from "../RSVPForm";
import type { RSVPConfig, WeddingContent } from "../../types/wedding";

interface WeddingDetailsSectionProps {
  event: WeddingContent["event"];
  rsvp: RSVPConfig;
}

export default function WeddingDetailsSection({ event, rsvp }: WeddingDetailsSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <SectionWrapper
      id="el-gran-dia-rsvp"
      eyebrow="Capítulo 06"
      title={event.title}
      intro={event.subtitle}
      className="bg-[var(--color-ivory)]"
      hideDivider
    >
      <div className="grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="grid gap-6">
          <motion.article
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: shouldReduceMotion ? 0 : 1 }}
            className="paper-surface rounded-[8px] p-6 md:p-8"
          >
            <h3 className="font-heading text-3xl">Detalles</h3>
            <dl className="mt-6 grid gap-4">
              {event.details.map((detail) => (
                <div key={detail.label} className="border-b border-[var(--color-olive)]/20 pb-3 last:border-b-0 last:pb-0">
                  <dt className="text-xs uppercase tracking-[0.18em] text-[var(--color-olive)]">{detail.label}</dt>
                  <dd className="section-caption mt-1 text-[var(--color-forest)]/88">{detail.value}</dd>
                </div>
              ))}
            </dl>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: shouldReduceMotion ? 0 : 1, delay: shouldReduceMotion ? 0 : 0.12 }}
            className="paper-surface--soft rounded-[8px] p-6 md:p-8"
          >
            <h3 className="font-heading text-3xl">Cronograma</h3>
            <ol className="mt-6 grid gap-3">
              {event.schedule.map((item) => (
                <li key={item.time} className="flex items-baseline gap-3">
                  <span className="min-w-[7rem] text-sm uppercase tracking-[0.14em] text-[var(--color-terracotta)]">{item.time}</span>
                  <span className="section-caption text-[var(--color-forest)]/88">{item.event}</span>
                </li>
              ))}
            </ol>
            <p className="section-caption mt-6 text-[var(--color-forest)]/78">{event.note}</p>
          </motion.article>
        </div>

        <RSVPForm config={rsvp} />
      </div>
    </SectionWrapper>
  );
}
