import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
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
  const articleRef = useRef<HTMLElement | null>(null);
  const showLocationLink = hasConfirmedLocation(block);
  const isEven = index % 2 === 0;
  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ["start 86%", "end 18%"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 84, damping: 28, mass: 0.55 });
  const imageY = useTransform(smoothProgress, [0, 1], shouldReduceMotion ? [0, 0] : [22, -16]);
  const imageScale = useTransform(smoothProgress, [0, 0.55, 1], shouldReduceMotion ? [1, 1, 1] : [1.045, 1.005, 1.02]);
  const imageOpacity = useTransform(smoothProgress, [0, 0.18, 0.92, 1], [0.44, 1, 1, 0.84]);
  const copyY = useTransform(smoothProgress, [0, 0.42], shouldReduceMotion ? [0, 0] : [18, 0]);
  const copyOpacity = useTransform(smoothProgress, [0, 0.28], [0.3, 1]);

  return (
    <motion.article
      ref={articleRef}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.28 }}
      transition={{ duration: shouldReduceMotion ? 0 : 1.25, ease: [0.16, 1, 0.3, 1] }}
      className={`grid items-center gap-7 md:gap-14 lg:grid-cols-2 ${
        isEven ? "" : "lg:[&>*:first-child]:order-2"
      }`}
    >
      <motion.figure
        className="relative mx-auto aspect-[5/4] w-full max-w-[360px] overflow-hidden rounded-[4px] shadow-[0_22px_50px_rgba(36,41,31,0.12)] md:aspect-[4/5] md:max-w-none lg:w-[88%]"
        style={{ y: imageY, opacity: imageOpacity }}
      >
        <motion.img 
          src={block.image} 
          alt={block.imageAlt} 
          className="h-full w-full object-cover" 
          loading="lazy" 
          style={{ scale: imageScale }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(36,41,31,0.01),rgba(36,41,31,0.16))]" />
      </motion.figure>

      <motion.div className={`flex flex-col justify-center px-1 md:px-8 ${isEven ? "lg:pr-12" : "lg:pl-12"}`} style={{ y: copyY, opacity: copyOpacity }}>
        <motion.p
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[var(--color-olive)]"
        >
          {block.title}
        </motion.p>
        
        <motion.h3
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.95, delay: shouldReduceMotion ? 0 : 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading mt-4 text-[clamp(1.9rem,4vw,2.75rem)] leading-[1.05] text-[var(--color-forest)] md:mt-6"
        >
          {block.venue}
        </motion.h3>
        
        <div className="mt-5 grid gap-3 md:mt-8 md:gap-4">
          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.85, delay: shouldReduceMotion ? 0 : 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="font-editorial text-2xl leading-[1.25] text-[var(--color-terracotta)]"
          >
            {block.time}
          </motion.p>
          {block.location && (
            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.85, delay: shouldReduceMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-editorial text-xl leading-[1.35] text-[var(--color-forest)]/80"
            >
              {block.location}
            </motion.p>
          )}
        </div>

        {showLocationLink && (
          <motion.a
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.75, delay: shouldReduceMotion ? 0 : 0.26, ease: [0.16, 1, 0.3, 1] }}
            href={block.locationCtaHref}
            target="_blank"
            rel="noreferrer"
            className="group mt-7 inline-flex w-fit items-center gap-3 rounded-full border border-[var(--color-olive)]/40 px-5 py-2.5 transition-all hover:bg-[var(--color-olive)]/5 md:mt-10 md:px-6 md:py-3"
          >
            <PinIcon />
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-forest)]">
              {block.locationCtaLabel}
            </span>
          </motion.a>
        )}
      </motion.div>
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
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 32, scale: shouldReduceMotion ? 1 : 0.97 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.34 }}
      transition={{ duration: shouldReduceMotion ? 0 : 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto mt-16 max-w-3xl px-2 text-center md:mt-28 md:px-4"
      aria-labelledby="dress-code-title"
    >
      <p id="dress-code-title" className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[var(--color-olive)]">
        {config.title}
      </p>
      <p className="font-editorial mt-5 text-[clamp(1.8rem,3vw,2.5rem)] leading-[1.18] text-[var(--color-forest)]">
        {config.subtitle}
      </p>

      <div className="mt-8 grid gap-5 md:mt-10 md:gap-6">
        {config.guidance.map((item, index) => (
          <motion.p
            key={item}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: shouldReduceMotion ? 0 : index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-editorial text-[1.15rem] leading-[1.42] text-[var(--color-forest)]/85"
          >
            {item}
          </motion.p>
        ))}
        
        <div className="mt-6 flex justify-center gap-3 md:mt-8 md:gap-4" aria-label="Paleta sugerida para el código de vestimenta">
          {config.palette.map((color, index) => (
            <motion.span 
              key={color} 
              className="h-10 w-10 rounded-full shadow-md md:h-12 md:w-12" 
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.82 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.55, delay: shouldReduceMotion ? 0 : 0.16 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              style={{ backgroundColor: color, border: '1px solid rgba(0,0,0,0.06)' }} 
            />
          ))}
        </div>
        <p className="mt-6 text-sm italic tracking-wide text-[var(--color-terracotta)] md:mt-8">{config.note}</p>
      </div>
    </motion.aside>
  );
}

export default function WeddingDetailsSection({ event, rsvp }: WeddingDetailsSectionProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const rsvpRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start 82%", "end 24%"],
  });
  const { scrollYProgress: rsvpProgress } = useScroll({
    target: rsvpRef,
    offset: ["start 90%", "end 24%"],
  });
  const smoothSectionProgress = useSpring(sectionProgress, { stiffness: 76, damping: 28, mass: 0.6 });
  const smoothRsvpProgress = useSpring(rsvpProgress, { stiffness: 82, damping: 30, mass: 0.58 });
  const headerY = useTransform(smoothSectionProgress, [0, 0.26], shouldReduceMotion ? [0, 0] : [34, 0]);
  const headerOpacity = useTransform(smoothSectionProgress, [0, 0.16], [0.2, 1]);
  const rsvpY = useTransform(smoothRsvpProgress, [0, 0.5], shouldReduceMotion ? [0, 0] : [42, 0]);
  const rsvpScale = useTransform(smoothRsvpProgress, [0, 0.58], shouldReduceMotion ? [1, 1] : [0.97, 1]);
  const dateParts = event.date.match(/^(.+?) de (\d{4})$/i);
  const dateText = dateParts?.[1] ?? "5 de septiembre";
  const yearText = dateParts?.[2] ?? "2026";

  return (
    <SectionWrapper
      id="el-gran-dia-rsvp"
      className="bg-[var(--color-ivory)] pb-0 pt-20 md:pt-32"
      contentClassName="relative max-w-none px-0"
      hideDivider
    >
      <div ref={sectionRef} className="mx-auto max-w-[1120px] px-4 md:px-8">
        
        <motion.header
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
          style={{ y: headerY, opacity: headerOpacity }}
        >
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[var(--color-olive)]">
            El Gran Día
          </p>
          <h2 className="font-heading mt-6 text-[clamp(2.85rem,8vw,5.5rem)] leading-[0.9] text-[var(--color-forest)] md:mt-8">
            {dateText}
          </h2>
          <p className="font-editorial mt-4 text-[clamp(2rem,5vw,3.25rem)] leading-[1.15] italic text-[var(--color-terracotta)]">
            {yearText}
          </p>
          <div className="mx-auto mt-8 max-w-2xl md:mt-12">
            {event.paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.85, delay: shouldReduceMotion ? 0 : 0.14 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="mb-4 font-editorial text-[1.12rem] leading-[1.38] text-[var(--color-forest)]/80 md:mb-6 md:text-xl"
              >
                {p}
              </motion.p>
            ))}
          </div>
        </motion.header>

        <section className="mt-16 grid gap-16 md:mt-28 md:gap-28" aria-label="Itinerario de la boda">
          <EventTimelineItem block={event.ceremony} index={0} shouldReduceMotion={shouldReduceMotion} />
          <EventTimelineItem block={event.reception} index={1} shouldReduceMotion={shouldReduceMotion} />
        </section>

        <DressCodeNote config={event.dressCode} shouldReduceMotion={shouldReduceMotion} />
      </div>

      <div ref={rsvpRef} className="relative mt-20 bg-[var(--color-surface)] py-20 md:mt-28 md:py-28">
        <div className="absolute inset-0 pointer-events-none border-t border-[var(--color-olive)]/10 bg-[linear-gradient(180deg,rgba(246,245,241,0.58),rgba(252,251,248,0))]" aria-hidden />
        <div className="relative mx-auto max-w-[820px] px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: shouldReduceMotion ? 0 : 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ y: rsvpY, scale: rsvpScale }}
          >
            <RSVPForm config={rsvp} />
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
