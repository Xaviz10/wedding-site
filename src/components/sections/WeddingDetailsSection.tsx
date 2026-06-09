import { motion, useReducedMotion } from "framer-motion";
import SectionWrapper from "../SectionWrapper";
import RSVPForm from "../RSVPForm";
import type { DressCodeConfig, EventBlock, RSVPConfig, WeddingContent } from "../../types/wedding";

interface WeddingDetailsSectionProps {
  event: WeddingContent["event"];
  rsvp: RSVPConfig;
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-[1.15rem] w-[1.15rem]">
      <path
        d="M12 21C14.2 18.2 18.2 13.9 18.2 10.1C18.2 6.73 15.46 4 12 4C8.54 4 5.8 6.73 5.8 10.1C5.8 13.9 9.8 18.2 12 21Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="12" cy="10.1" r="2.2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function hasConfirmedLocation(block: EventBlock) {
  return /^https?:\/\//u.test(block.locationCtaHref) && !/por confirmar/i.test(`${block.venue} ${block.location ?? ""}`);
}

interface EventTimelineItemProps {
  block: EventBlock;
  index: number;
  shouldReduceMotion: boolean;
}

function EventTimelineItem({ block, index, shouldReduceMotion }: EventTimelineItemProps) {
  const showLocationLink = hasConfirmedLocation(block);
  const isEven = index % 2 === 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: shouldReduceMotion ? 0 : 1.2 }}
      className={`grid items-center gap-10 md:gap-16 lg:grid-cols-2 ${
        isEven ? "" : "lg:[&>*:first-child]:order-2"
      }`}
    >
      <figure className="relative aspect-[3/4] w-full overflow-hidden rounded-[8px] shadow-[0_24px_54px_rgba(36,41,31,0.08)] md:aspect-[4/5] lg:w-[90%]">
        <img 
          src={block.image} 
          alt={block.imageAlt} 
          className="h-full w-full object-cover transition-transform duration-[2s] hover:scale-105" 
          loading="lazy" 
        />
      </figure>

      <div className={`flex flex-col justify-center px-2 md:px-8 ${isEven ? "lg:pr-12" : "lg:pl-12"}`}>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[var(--color-olive)]">
          {block.title}
        </p>
        
        <h3 className="font-heading mt-6 text-[clamp(2.5rem,5vw,3.5rem)] leading-[1.05] text-[var(--color-forest)]">
          {block.venue}
        </h3>
        
        <div className="mt-8 grid gap-4">
          <p className="font-editorial text-3xl text-[var(--color-terracotta)]">
            {block.time}
          </p>
          {block.location && (
            <p className="font-editorial text-2xl text-[var(--color-forest)]/80">
              {block.location}
            </p>
          )}
        </div>

        {showLocationLink && (
          <a
            href={block.locationCtaHref}
            target="_blank"
            rel="noreferrer"
            className="group mt-10 inline-flex w-fit items-center gap-3 rounded-full border border-[var(--color-olive)]/40 px-6 py-3 transition-all hover:bg-[var(--color-olive)]/5"
          >
            <PinIcon />
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-forest)]">
              {block.locationCtaLabel}
            </span>
          </a>
        )}
      </div>
    </motion.article>
  );
}

interface DressCodeNoteProps {
  config: DressCodeConfig;
  shouldReduceMotion: boolean;
}

function DressCodeNote({ config, shouldReduceMotion }: DressCodeNoteProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: shouldReduceMotion ? 0 : 1.2 }}
      className="mx-auto mt-20 max-w-3xl px-4 text-center md:mt-32"
      aria-labelledby="dress-code-title"
    >
      <p id="dress-code-title" className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[var(--color-olive)]">
        {config.title}
      </p>
      <p className="font-editorial mt-5 text-[clamp(2.5rem,4vw,3.5rem)] leading-tight text-[var(--color-forest)]">
        {config.subtitle}
      </p>

      <div className="mt-10 grid gap-6">
        {config.guidance.map((item) => (
          <p key={item} className="font-editorial text-[1.4rem] leading-relaxed text-[var(--color-forest)]/85">
            {item}
          </p>
        ))}
        
        <div className="mt-8 flex justify-center gap-4" aria-label="Paleta sugerida para el código de vestimenta">
          {config.palette.map((color) => (
            <span 
              key={color} 
              className="h-12 w-12 rounded-full shadow-md" 
              style={{ backgroundColor: color, border: '1px solid rgba(0,0,0,0.06)' }} 
            />
          ))}
        </div>
        <p className="mt-8 text-sm italic tracking-wide text-[var(--color-terracotta)]">{config.note}</p>
      </div>
    </motion.aside>
  );
}

export default function WeddingDetailsSection({ event, rsvp }: WeddingDetailsSectionProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const dateParts = event.date.match(/^(.+?) de (\d{4})$/i);
  const dateText = dateParts?.[1] ?? "5 de septiembre";
  const yearText = dateParts?.[2] ?? "2026";

  return (
    <SectionWrapper
      id="el-gran-dia-rsvp"
      className="bg-[var(--color-ivory)] pb-0 pt-24 md:pt-32"
      contentClassName="relative max-w-none px-0"
      hideDivider
    >
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        
        {/* Editorial Header */}
        <motion.header
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1.2 }}
          className="text-center"
        >
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[var(--color-olive)]">
            El Gran Día
          </p>
          <h2 className="font-heading mt-8 text-[clamp(4.5rem,10vw,8rem)] leading-[0.85] text-[var(--color-forest)]">
            {dateText}
          </h2>
          <p className="font-editorial mt-4 text-[clamp(3rem,6vw,5rem)] italic text-[var(--color-terracotta)]">
            {yearText}
          </p>
          <div className="mx-auto mt-12 max-w-2xl">
            {event.paragraphs.map((p, i) => (
              <p key={i} className="mb-6 font-editorial text-2xl text-[var(--color-forest)]/80">
                {p}
              </p>
            ))}
          </div>
        </motion.header>

        {/* Unboxed, Editorial Itinerary */}
        <section className="mt-24 grid gap-24 md:mt-32 md:gap-32" aria-label="Itinerario de la boda">
          <EventTimelineItem block={event.ceremony} index={0} shouldReduceMotion={shouldReduceMotion} />
          <EventTimelineItem block={event.reception} index={1} shouldReduceMotion={shouldReduceMotion} />
        </section>

        <DressCodeNote config={event.dressCode} shouldReduceMotion={shouldReduceMotion} />
      </div>

      {/* RSVP Form Section - Softly integrated at the bottom */}
      <div className="relative mt-24 bg-[var(--color-surface)] py-24 md:mt-32 md:py-32">
        <div className="absolute inset-0 pointer-events-none border-t border-[var(--color-olive)]/10" aria-hidden />
        <div className="mx-auto max-w-[760px] px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: shouldReduceMotion ? 0 : 1.2 }}
          >
            <RSVPForm config={rsvp} />
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}