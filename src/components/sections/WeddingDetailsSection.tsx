import { motion, useReducedMotion } from "framer-motion";
import SectionWrapper from "../SectionWrapper";
import RSVPForm from "../RSVPForm";
import type { EventBlock, RSVPConfig, WeddingContent } from "../../types/wedding";

interface WeddingDetailsSectionProps {
  event: WeddingContent["event"];
  rsvp: RSVPConfig;
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-5 w-5">
      <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7.5 3.8V7.2M16.5 3.8V7.2M3.5 9.5H20.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="8.1" cy="13.1" r="0.85" fill="currentColor" />
      <circle cx="12" cy="13.1" r="0.85" fill="currentColor" />
      <circle cx="15.9" cy="13.1" r="0.85" fill="currentColor" />
      <circle cx="8.1" cy="16.8" r="0.85" fill="currentColor" />
      <circle cx="12" cy="16.8" r="0.85" fill="currentColor" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-5 w-5">
      <path
        d="M12 21C14.2 18.2 18.2 13.9 18.2 10.1C18.2 6.73 15.46 4 12 4C8.54 4 5.8 6.73 5.8 10.1C5.8 13.9 9.8 18.2 12 21Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="10.1" r="2.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

interface EventCardProps {
  block: EventBlock;
  delay: number;
  shouldReduceMotion: boolean;
}

function EventCard({ block, delay, shouldReduceMotion }: EventCardProps) {
  const isExternal = /^https?:\/\//u.test(block.locationCtaHref);

  return (
    <motion.article
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: shouldReduceMotion ? 0 : 1, delay: shouldReduceMotion ? 0 : delay }}
      className="paper-surface--soft overflow-hidden rounded-[10px]"
    >
      <figure className="aspect-[16/9] w-full overflow-hidden border-b border-[var(--color-olive)]/20">
        <img src={block.image} alt={block.imageAlt} loading="lazy" className="h-full w-full object-cover" />
      </figure>

      <div className="grid gap-4 p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.26em] text-[var(--color-terracotta)]/86">{block.title}</p>
        <h3 className="font-heading text-4xl leading-[1.04]">{block.venue}</h3>

        <div className="flex items-center gap-3 text-[var(--color-forest)]/82">
          <CalendarIcon />
          <p className="text-base md:text-lg">{block.time}</p>
        </div>

        {block.location && <p className="section-caption text-[var(--color-forest)]/84">{block.location}</p>}

        <a
          href={block.locationCtaHref}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noreferrer" : undefined}
          className="mt-2 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[var(--color-forest)]/55 px-5 py-3 text-sm uppercase tracking-[0.14em] text-[var(--color-forest)] transition hover:bg-[var(--color-forest)] hover:text-[var(--color-ivory)]"
        >
          <PinIcon />
          <span>{block.locationCtaLabel}</span>
        </a>
      </div>
    </motion.article>
  );
}

export default function WeddingDetailsSection({ event, rsvp }: WeddingDetailsSectionProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;

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
            <h3 className="font-heading text-3xl">Celebra con nosotros</h3>
            <div className="mt-5 grid gap-4">
              {event.paragraphs.map((paragraph) => (
                <p key={paragraph} className="section-caption text-[var(--color-forest)]/86">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.article>

          <EventCard block={event.ceremony} delay={0.12} shouldReduceMotion={shouldReduceMotion} />
          <EventCard block={event.reception} delay={0.18} shouldReduceMotion={shouldReduceMotion} />
        </div>

        <RSVPForm config={rsvp} />
      </div>
    </SectionWrapper>
  );
}
