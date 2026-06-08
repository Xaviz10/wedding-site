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
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4">
      <path
        d="M12 21C14.2 18.2 18.2 13.9 18.2 10.1C18.2 6.73 15.46 4 12 4C8.54 4 5.8 6.73 5.8 10.1C5.8 13.9 9.8 18.2 12 21Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="10.1" r="2.2" stroke="currentColor" strokeWidth="1.6" />
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

  return (
    <motion.article
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: shouldReduceMotion ? 0 : 0.08 + index * 0.08 }}
      className="wedding-itinerary-item"
    >
      <figure className="wedding-itinerary-image">
        <img src={block.image} alt={block.imageAlt} loading="lazy" />
      </figure>

      <div>
        <p className="wedding-itinerary-label">{block.title}</p>
        <h3 className="font-heading mt-2 text-3xl leading-[1.02] text-[#283618] md:text-[2.25rem]">{block.venue}</h3>
      </div>

      <div className="wedding-itinerary-meta">
        <p>{block.time}</p>
        {block.location && <p>{block.location}</p>}
        {showLocationLink && (
          <a
            href={block.locationCtaHref}
            target="_blank"
            rel="noreferrer"
            className="wedding-location-link"
          >
            <PinIcon />
            <span>{block.locationCtaLabel}</span>
          </a>
        )}
      </div>
    </motion.article>
  );
}

interface DressCodeNoteProps {
  config: DressCodeConfig;
}

function DressCodeNote({ config }: DressCodeNoteProps) {
  return (
    <aside className="wedding-dress-note" aria-labelledby="dress-code-title">
      <div>
        <p id="dress-code-title" className="wedding-itinerary-label">
          {config.title}
        </p>
        <p className="font-editorial mt-1 text-2xl leading-tight text-[#283618]">{config.subtitle}</p>
      </div>

      <div className="grid gap-3">
        {config.guidance.slice(1).map((item) => (
          <p key={item}>{item}</p>
        ))}
        <p>{config.note}</p>
        <div className="flex items-center gap-2" aria-label="Paleta sugerida para el código de vestimenta">
          {config.palette.map((color) => (
            <span key={color} className="wedding-dress-swatch" style={{ backgroundColor: color }} />
          ))}
        </div>
      </div>
    </aside>
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
      eyebrow="Capítulo 06"
      title={event.title}
      intro={event.subtitle}
      className="overflow-hidden wedding-details-section"
      contentClassName="relative"
      hideDivider
    >
      <div className="wedding-details-shell relative overflow-hidden">
        <div className="relative z-10 grid gap-12 xl:grid-cols-[minmax(0,1.05fr)_minmax(390px,0.76fr)] xl:items-start">
          <div className="grid gap-10">
            <motion.article
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.9 }}
              className="wedding-date-editorial"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#bc6c25]">Nos casamos</p>
              <h3 className="font-heading mt-4 text-[clamp(4.3rem,12vw,8.6rem)] font-medium leading-[0.82] text-[#283618]">
                {dateText}
              </h3>
              <p className="font-editorial mt-4 text-[clamp(3.2rem,8vw,6.4rem)] leading-none text-[#606c38]">{yearText}</p>
              <p className="section-caption mt-7 max-w-[34rem] text-[#283618]/82">{event.paragraphs[0]}</p>
            </motion.article>

            <motion.figure
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.9, delay: shouldReduceMotion ? 0 : 0.08 }}
              className="wedding-mood-image"
            >
              <img src={event.reception.image} alt={event.reception.imageAlt} loading="lazy" />
            </motion.figure>

            <section className="wedding-itinerary" aria-label="Itinerario de la boda">
              <EventTimelineItem block={event.ceremony} index={0} shouldReduceMotion={shouldReduceMotion} />
              <EventTimelineItem block={event.reception} index={1} shouldReduceMotion={shouldReduceMotion} />
            </section>

            <DressCodeNote config={event.dressCode} />
          </div>

          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20, y: shouldReduceMotion ? 0 : 18 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.22 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.9, delay: shouldReduceMotion ? 0 : 0.12 }}
            className="details-rsvp-column"
          >
            <div className="sticky top-8">
              <RSVPForm config={rsvp} />
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
