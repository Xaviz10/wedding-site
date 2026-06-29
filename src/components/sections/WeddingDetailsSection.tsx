import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import RSVPForm from "../RSVPForm";
import type { DressCodeConfig, EventBlock, RSVPConfig, WeddingContent } from "../../types/wedding";

interface WeddingDetailsSectionProps {
  event: WeddingContent["event"];
  rsvp: RSVPConfig;
}

type MomentAlignment = "left" | "right";

interface WeddingMoment {
  number: string;
  title: string;
  subtitle: string;
  body: string;
  details: Array<{
    label: string;
    value: string;
  }>;
  supportText?: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  imagePosition: string;
  align: MomentAlignment;
}

interface WeddingBackgroundLayerProps {
  moment: WeddingMoment;
  index: number;
  progress: MotionValue<number>;
  shouldReduceMotion: boolean;
}

function WeddingBackgroundLayer({ moment, index, progress, shouldReduceMotion }: WeddingBackgroundLayerProps) {
  const opacity = useTransform(
    progress,
    [0, 0.45, 0.6, 1],
    index === 0 ? [1, 1, 0, 0] : [0, 0, 1, 1],
  );
  const scale = useTransform(
    progress,
    [0, 1],
    shouldReduceMotion ? [1, 1] : index === 0 ? [1.05, 1.12] : [1.1, 1.04],
  );
  const y = useTransform(
    progress,
    [0, 1],
    shouldReduceMotion ? ["0%", "0%"] : index === 0 ? ["-1.5%", "1.5%"] : ["1.25%", "-1.25%"],
  );
  const sideGradient =
    moment.align === "right"
      ? "linear-gradient(90deg, rgba(18, 14, 11, 0.04) 0%, rgba(18, 14, 11, 0.18) 42%, rgba(18, 14, 11, 0.8) 82%, rgba(18, 14, 11, 0.94) 100%)"
      : "linear-gradient(90deg, rgba(18, 14, 11, 0.94) 0%, rgba(18, 14, 11, 0.78) 24%, rgba(18, 14, 11, 0.2) 62%, rgba(18, 14, 11, 0.04) 100%)";

  return (
    <motion.div className="absolute inset-0 z-0 overflow-hidden" style={{ opacity }} aria-hidden>
      <motion.img
        src={moment.image}
        alt=""
        className="h-full w-full object-cover"
        loading={index === 0 ? "eager" : "lazy"}
        decoding="async"
        style={{
          objectPosition: moment.imagePosition,
          scale,
          y,
        }}
      />
      <div className="absolute inset-0 bg-[rgba(22,16,12,0.28)]" />
      <div className="absolute inset-0 hidden md:block" style={{ background: sideGradient }} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,12,9,0.44)_0%,rgba(16,12,9,0.08)_38%,rgba(16,12,9,0.72)_100%)] md:bg-[radial-gradient(circle_at_50%_45%,rgba(255,247,230,0.08)_0%,rgba(16,12,9,0.28)_48%,rgba(16,12,9,0.68)_100%)]" />
    </motion.div>
  );
}

interface WeddingMomentPanelProps {
  moment: WeddingMoment;
  index: number;
  progress: MotionValue<number>;
  isActive: boolean;
  shouldReduceMotion: boolean;
}

function WeddingMomentPanel({ moment, index, progress, isActive, shouldReduceMotion }: WeddingMomentPanelProps) {
  const opacity = useTransform(
    progress,
    index === 0 ? [0, 0.42, 0.58] : [0.48, 0.63, 1],
    index === 0 ? [1, 1, 0] : [0, 1, 1],
  );
  const y = useTransform(
    progress,
    index === 0 ? [0, 0.42, 0.58] : [0.48, 0.63, 1],
    shouldReduceMotion ? [0, 0, 0] : index === 0 ? [0, 0, -28] : [28, 0, 0],
  );
  const isRight = moment.align === "right";

  return (
    <motion.article
      className={`absolute inset-0 z-20 flex h-full w-full px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-12 sm:px-8 md:items-center md:px-0 md:py-0 ${
        isRight
          ? "items-end md:justify-end md:pr-[clamp(3.5rem,8vw,8rem)]"
          : "items-end md:justify-start md:pl-[clamp(3rem,7vw,7rem)]"
      } ${isActive ? "pointer-events-auto" : "pointer-events-none"}`}
      style={{ opacity, y }}
      aria-hidden={!isActive}
      aria-label={`${moment.number}. ${moment.title}. ${moment.subtitle}`}
    >
      <div
        className={`w-full max-w-[34rem] text-[var(--color-ivory)] drop-shadow-[0_9px_32px_rgba(0,0,0,0.52)] ${
          isRight ? "md:text-right" : "md:text-left"
        }`}
      >
        <div className={`flex flex-col gap-3 md:gap-4 ${isRight ? "md:items-end" : "md:items-start"}`}>
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.36em] text-[var(--color-gold)] md:text-[0.74rem] md:tracking-[0.38em]">
            {moment.number}
          </p>
          <span className="h-px w-20 bg-[color-mix(in_oklab,var(--color-gold)_70%,transparent)]" aria-hidden />
        </div>

        <h3 className="font-heading mt-4 text-[clamp(2.45rem,11vw,5.8rem)] font-medium italic leading-[0.94] tracking-normal text-[var(--color-ivory)] md:mt-7 md:text-[clamp(4rem,6vw,6.25rem)] md:leading-[0.92]">
          {moment.title}
        </h3>

        <p className="mt-3 text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-[var(--color-gold)] md:mt-5 md:text-[0.78rem] md:tracking-[0.34em]">
          {moment.subtitle}
        </p>

        <p className="mt-4 max-w-[31rem] font-editorial text-[clamp(1rem,4.4vw,1.25rem)] leading-[1.42] text-[color-mix(in_oklab,var(--color-ivory)_82%,var(--color-gold)_18%)] md:mt-8 md:text-[clamp(1.25rem,1.6vw,1.55rem)] md:leading-[1.55]">
          {moment.body}
        </p>

        <div
          className={`mt-4 grid gap-3 border-y border-[color-mix(in_oklab,var(--color-gold)_42%,transparent)] py-3 sm:grid-cols-2 md:mt-8 md:gap-8 md:py-6 ${
            isRight ? "md:ml-auto" : ""
          }`}
        >
          {moment.details.map((detail) => (
            <div key={detail.label}>
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)] md:text-[0.68rem] md:tracking-[0.28em]">
                {detail.label}
              </p>
              <p className="font-heading mt-1.5 text-[clamp(1.16rem,4.5vw,1.65rem)] font-semibold leading-[1.12] tracking-normal text-[var(--color-ivory)] md:mt-2 md:text-[clamp(1.45rem,2vw,2rem)]">
                {detail.value}
              </p>
            </div>
          ))}
        </div>

        {moment.supportText && (
          <p className="mt-3 text-[0.82rem] leading-[1.45] text-[color-mix(in_oklab,var(--color-gold)_74%,var(--color-ivory)_26%)] md:mt-4 md:text-[0.95rem] md:leading-[1.55]">
            {moment.supportText}
          </p>
        )}

        {moment.ctaHref && (
          <a
            href={moment.ctaHref}
            target="_blank"
            rel="noreferrer"
            className={`mt-4 inline-flex min-h-11 items-center justify-center gap-3 border border-[color-mix(in_oklab,var(--color-gold)_48%,transparent)] px-5 py-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)] transition duration-300 hover:border-[var(--color-gold)] hover:bg-[rgba(246,245,241,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)] md:mt-8 md:min-h-14 md:gap-4 md:px-8 md:py-3 md:text-[0.68rem] md:tracking-[0.28em] ${
              isRight ? "md:ml-auto" : ""
            }`}
          >
            <span>{moment.ctaLabel}</span>
            <span aria-hidden>{isRight ? "←" : "→"}</span>
          </a>
        )}
      </div>
    </motion.article>
  );
}

function buildWeddingMoments(ceremony: EventBlock, reception: EventBlock): WeddingMoment[] {
  return [
    {
      number: "01",
      title: ceremony.title,
      subtitle: ceremony.venue,
      body: "Comenzaremos el día con la ceremonia religiosa, el momento en que recibiremos el sacramento del matrimonio y celebraremos nuestra unión ante Dios.",
      details: [
        { label: "Hora", value: ceremony.time },
        { label: "Dónde", value: ceremony.location ?? "Ubicación por confirmar" },
      ],
      ctaLabel: ceremony.locationCtaLabel,
      ctaHref: ceremony.locationCtaHref,
      image: ceremony.image,
      imagePosition: "45% 50%",
      align: "right",
    },
    {
      number: "02",
      title: reception.title,
      subtitle: reception.venue,
      body: "Después de la ceremonia seguimos con la recepción: comida, brindis, música y ese rato largo para abrazarnos, conversar y celebrar sin afán.",
      details: [
        { label: "Hora", value: reception.time },
        { label: "Dónde", value: reception.location ?? "Ubicación por confirmar" },
      ],
      ctaLabel: reception.locationCtaLabel,
      ctaHref: reception.locationCtaHref,
      image: reception.image,
      imagePosition: "58% 50%",
      align: "left",
    },
  ];
}

interface WeddingDetailsStoryProps {
  ceremony: EventBlock;
  reception: EventBlock;
  shouldReduceMotion: boolean;
}

function WeddingDetailsStory({ ceremony, reception, shouldReduceMotion }: WeddingDetailsStoryProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeMomentIndex, setActiveMomentIndex] = useState(0);
  const moments = buildWeddingMoments(ceremony, reception);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 76, damping: 30, mass: 0.62 });

  useEffect(() => {
    return progress.on("change", (latest) => {
      setActiveMomentIndex(latest >= 0.55 ? 1 : 0);
    });
  }, [progress]);

  return (
    <div ref={containerRef} className="relative h-[240dvh] min-h-[240svh] bg-[#15100d]" aria-labelledby="gran-dia-title">
      <div className="sticky top-0 h-[100dvh] min-h-[100svh] overflow-hidden bg-[#15100d] text-[var(--color-ivory)]">
        <h2 id="gran-dia-title" className="sr-only">
          El Gran Día
        </h2>

        {moments.map((moment, index) => (
          <WeddingBackgroundLayer
            key={`${moment.number}-background`}
            moment={moment}
            index={index}
            progress={progress}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}

        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(12,9,7,0.22)_0%,transparent_30%,rgba(12,9,7,0.48)_100%)] md:hidden" />
        <p className="pointer-events-none absolute left-5 top-5 z-30 text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-[color-mix(in_oklab,var(--color-gold)_76%,var(--color-ivory)_24%)] sm:left-8 md:left-12 md:top-10">
          El Gran Día
        </p>

        {moments.map((moment, index) => (
          <WeddingMomentPanel
            key={`${moment.number}-copy`}
            moment={moment}
            index={index}
            progress={progress}
            isActive={activeMomentIndex === index}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </div>
    </div>
  );
}

interface DressCodeNoteProps {
  config: DressCodeConfig;
  step: number;
  shouldReduceMotion: boolean;
}

function formatDressLead(items: string[]) {
  return items
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => (/[.!?]$/.test(item) ? item : `${item}.`))
    .join(" ");
}

function splitDressExamples(items: string[]) {
  return {
    lead: formatDressLead(items.slice(0, 1)),
    bullets: items.slice(1),
  };
}

function FormalSuitIllustration() {
  return (
    <svg viewBox="0 0 190 270" className="h-full w-full" role="img" aria-label="Traje formal">
      <circle cx="95" cy="31" r="18" fill="color-mix(in oklab, white 76%, var(--color-gold) 24%)" stroke="var(--color-terracotta)" strokeWidth="2" />
      <path d="M67 82 52 99v74h29v70h28v-70h5v70h28v-70h29V99l-15-17-37-9-24 31-24-31Z" fill="color-mix(in oklab, white 72%, var(--color-gold) 28%)" stroke="var(--color-terracotta)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M73 79v94h44V79l-22 27Z" fill="color-mix(in oklab, white 68%, var(--color-ivory) 32%)" stroke="var(--color-terracotta)" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M67 82c20 3 29 11 28 24M123 82c-20 3-29 11-28 24" fill="none" stroke="var(--color-terracotta)" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M88 77h14l-7 29Z" fill="var(--color-terracotta)" opacity="0.74" />
      <path d="M81 77 95 106 69 91M109 77 95 106l26-15" fill="color-mix(in oklab, var(--color-gold) 70%, white 30%)" stroke="var(--color-terracotta)" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M52 99c9-4 17-5 25-3M138 96c8-2 16-1 25 3M95 121v39M95 181v57" fill="none" stroke="var(--color-terracotta)" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="95" cy="130" r="2.5" fill="var(--color-terracotta)" opacity="0.62" />
      <circle cx="95" cy="149" r="2.5" fill="var(--color-terracotta)" opacity="0.62" />
    </svg>
  );
}

function LongDressIllustration() {
  return (
    <svg viewBox="0 0 190 270" className="h-full w-full" role="img" aria-label="Vestido largo">
      <circle cx="95" cy="31" r="18" fill="color-mix(in oklab, white 78%, var(--color-gold) 22%)" stroke="var(--color-terracotta)" strokeWidth="2" />
      <path d="M67 75h56l17 18-2 58h-23l30 93H45l30-93H52l-2-58Z" fill="color-mix(in oklab, white 78%, var(--color-gold) 22%)" stroke="var(--color-terracotta)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M70 75c6 14 14 21 25 21s19-7 25-21M67 75l28 21 28-21" fill="none" stroke="var(--color-terracotta)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M69 92v55M121 92v55M95 104v122M78 159l-16 67M112 159l16 67" fill="none" stroke="color-mix(in oklab, var(--color-terracotta) 52%, white 48%)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M54 95c8 3 15 3 21 0M115 95c6 3 13 3 21 0" fill="none" stroke="var(--color-terracotta)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ChampagneToastIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 76 72" fill="none" className={className} aria-hidden>
      <g transform="rotate(-13 24 34)">
        <path
          d="M13 7H35L32.5 27C31.7 34 16.3 34 15.5 27L13 7ZM24 33V59M15 63H33"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M15 19H33L32 27C31.2 32 16.8 32 16 27L15 19Z" fill="var(--color-gold)" opacity="0.55" />
      </g>
      <g transform="rotate(13 52 34)">
        <path
          d="M41 7H63L60.5 27C59.7 34 44.3 34 43.5 27L41 7ZM52 33V59M43 63H61"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M43 19H61L60 27C59.2 32 44.8 32 44 27L43 19Z" fill="var(--color-gold)" opacity="0.55" />
      </g>
      <path d="M38 4V0M33 6L30 2M43 6L46 2" stroke="var(--color-gold)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

interface DressSuggestionProps {
  label: string;
  lead: string;
  bullets: string[];
  type: "men" | "women";
  restrictedTones: Array<{
    label: string;
    background: string;
    border?: string;
  }>;
  delay: number;
  shouldReduceMotion: boolean;
}

function DressSuggestion({ label, lead, bullets, type, restrictedTones, delay, shouldReduceMotion }: DressSuggestionProps) {
  const restrictionCaption = restrictedTones.length === 1 ? "Evitar este tono" : "Evitar estos tonos";
  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.34 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: shouldReduceMotion ? 0 : delay,
            staggerChildren: shouldReduceMotion ? 0 : 0.08,
          },
        },
      }}
      className="flex h-full min-w-0 flex-col items-center text-center"
    >
      <motion.p
        variants={itemVariants}
        transition={{ duration: shouldReduceMotion ? 0 : 0.72, ease: [0.16, 1, 0.3, 1] }}
        className="text-[0.58rem] font-semibold uppercase tracking-[0.3em] text-[color-mix(in_oklab,var(--color-terracotta)_82%,var(--color-forest)_18%)] md:text-[0.62rem] md:tracking-[0.34em]"
      >
        {label}
      </motion.p>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 22, scale: shouldReduceMotion ? 1 : 0.92 },
          visible: { opacity: 1, y: 0, scale: 1 },
        }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          animate={shouldReduceMotion ? undefined : { y: [0, -5, 0] }}
          transition={shouldReduceMotion ? undefined : { duration: 5.4, ease: "easeInOut", repeat: Infinity, delay: type === "men" ? 0.2 : 0.7 }}
          className="mt-3 flex h-[7.6rem] w-[6.6rem] items-center justify-center rounded-full bg-[color-mix(in_oklab,white_88%,var(--color-gold)_12%)] px-4 py-3 md:mt-4 md:h-[11.25rem] md:w-[9.75rem] md:px-6 md:py-5 lg:h-[12.5rem] lg:w-[10.75rem]"
        >
          {type === "men" ? <FormalSuitIllustration /> : <LongDressIllustration />}
        </motion.div>
      </motion.div>
      <motion.p
        variants={itemVariants}
        transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="font-editorial mt-3 flex min-h-[3.25rem] max-w-[12rem] items-start justify-center text-[clamp(1.08rem,3.2vw,1.82rem)] italic leading-[1.08] text-[var(--color-forest)] md:mt-5 md:min-h-[2rem] md:max-w-[18rem] md:text-[clamp(1.1rem,1.7vw,1.5rem)]"
      >
        {lead}
      </motion.p>
      {bullets.length > 0 && (
        <motion.ul
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.06,
              },
            },
          }}
          className="mt-3 grid gap-1.5 text-left text-[0.78rem] leading-[1.35] text-[color-mix(in_oklab,var(--color-forest)_72%,var(--color-terracotta)_28%)] md:mt-4 md:text-[0.85rem] md:leading-[1.4]"
        >
          {bullets.map((bullet) => (
            <motion.li
              key={bullet}
              variants={itemVariants}
              transition={{ duration: shouldReduceMotion ? 0 : 0.62, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-start gap-3"
            >
              <span className="mt-[0.62em] h-1.5 w-1.5 flex-none rounded-full bg-[color-mix(in_oklab,var(--color-terracotta)_66%,var(--color-gold)_34%)]" aria-hidden />
              <span>{bullet}</span>
            </motion.li>
          ))}
        </motion.ul>
      )}
      <motion.div
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: shouldReduceMotion ? 0 : 0.05,
            },
          },
        }}
        className="mt-4 grid justify-items-center gap-2.5 md:mt-5"
        aria-label={`Tonos no permitidos para ${label.toLowerCase()}`}
      >
        <motion.p
          variants={itemVariants}
          transition={{ duration: shouldReduceMotion ? 0 : 0.62, ease: [0.16, 1, 0.3, 1] }}
          className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[color-mix(in_oklab,var(--color-terracotta)_88%,var(--color-forest)_12%)] md:text-[0.64rem] md:tracking-[0.22em]"
        >
          {restrictionCaption}
        </motion.p>
        <div className="flex flex-wrap justify-center gap-2 md:gap-2.5">
          {restrictedTones.map((tone) => (
            <motion.span
              key={tone.label}
              variants={{
                hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.86, y: shouldReduceMotion ? 0 : 8 },
                visible: { opacity: 1, scale: 1, y: 0 },
              }}
              whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.03 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--color-terracotta)_42%,var(--color-gold)_58%)] bg-[color-mix(in_oklab,white_66%,var(--color-ivory)_34%)] px-2.5 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.08em] text-[color-mix(in_oklab,var(--color-terracotta)_78%,var(--color-forest)_22%)] shadow-[0_8px_18px_rgba(36,41,31,0.06)] md:px-3 md:text-[0.64rem]"
            >
              <span
                className="relative h-5 w-5 overflow-hidden rounded-full shadow-[inset_0_0_0_1px_rgba(36,41,31,0.16)]"
                style={{ background: tone.background, border: `1px solid ${tone.border ?? "rgba(36,41,31,0.12)"}` }}
                aria-hidden
              >
                <span className="absolute left-1/2 top-1/2 h-[2px] w-8 -translate-x-1/2 -translate-y-1/2 rotate-[-38deg] bg-[color-mix(in_oklab,#8f4813_82%,var(--color-forest)_18%)] shadow-[0_0_0_1px_rgba(246,245,241,0.62)]" />
              </span>
              No usar {tone.label.toLowerCase()}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function DressCodeNote({ config, step, shouldReduceMotion }: DressCodeNoteProps) {
  const examples = config.examples ?? [];
  const womenExamples = config.womenExamples ?? [];
  const menSuggestion = splitDressExamples(examples);
  const womenSuggestion = splitDressExamples(womenExamples);
  const introVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.aside
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: shouldReduceMotion ? 0 : 0.1,
          },
        },
      }}
      className="relative flex flex-col text-center md:h-full md:justify-center"
      aria-labelledby="dress-code-title"
    >
      <span className="sr-only">Paso {String(step).padStart(2, "0")}</span>

      <div className="mx-auto max-w-4xl">
        <div className="relative mx-auto w-fit px-8 md:px-14">
          <motion.h2
            id="dress-code-title"
            variants={{
              hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24, scale: shouldReduceMotion ? 1 : 0.97 },
              visible: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.95, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-[clamp(2.55rem,8vw,5.45rem)] font-medium italic leading-[0.86] text-[var(--color-forest)] md:text-[clamp(3rem,5vw,4.5rem)]"
          >
            {config.title}
          </motion.h2>
          <motion.span
            className="absolute -left-6 -top-7 block h-12 w-12 text-[var(--color-terracotta)]/68 md:-left-10 md:-top-9 md:h-16 md:w-16"
            animate={shouldReduceMotion ? undefined : { y: [0, -5, 0], rotate: [-5, 2, -5] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          >
            <ChampagneToastIcon className="h-full w-full" />
          </motion.span>
          <motion.span
            className="absolute -right-5 bottom-0 block h-10 w-10 text-[var(--color-olive)]/55 md:-right-9 md:h-14 md:w-14"
            animate={shouldReduceMotion ? undefined : { y: [0, -6, 0], rotate: [6, -2, 6] }}
            transition={{ duration: 4.8, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          >
            <ChampagneToastIcon className="h-full w-full" />
          </motion.span>
          <motion.span
            className="absolute right-5 -top-5 h-2 w-2 rotate-45 bg-[var(--color-gold)]/75 md:right-8 md:-top-7 md:h-2.5 md:w-2.5"
            animate={shouldReduceMotion ? undefined : { scale: [0.75, 1.25, 0.75], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
          <motion.span
            className="absolute -left-1 top-1 h-1.5 w-1.5 rotate-45 bg-[var(--color-terracotta)]/55 md:-left-2 md:h-2 md:w-2"
            animate={shouldReduceMotion ? undefined : { scale: [1, 1.4, 1], opacity: [0.35, 0.75, 0.35] }}
            transition={{ duration: 3.2, delay: 0.7, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
        </div>
        <motion.p
          variants={introVariants}
          transition={{ duration: shouldReduceMotion ? 0 : 0.78, ease: [0.16, 1, 0.3, 1] }}
          className="mt-2 text-[0.64rem] font-semibold uppercase tracking-[0.34em] text-[color-mix(in_oklab,var(--color-terracotta)_82%,var(--color-forest)_18%)] md:text-[0.68rem] md:tracking-[0.44em]"
        >
          {config.subtitle}
        </motion.p>

        {config.guidance.length > 0 && (
          <motion.p
            variants={introVariants}
            transition={{ duration: shouldReduceMotion ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-editorial mx-auto mt-5 max-w-3xl text-[clamp(1rem,2.25vw,1.5rem)] leading-[1.45] text-[color-mix(in_oklab,var(--color-forest)_78%,var(--color-terracotta)_22%)] md:mt-8 md:text-[clamp(1rem,1.6vw,1.25rem)]"
          >
            {config.guidance[0]}{" "}
            {config.guidance.slice(1).map((item) => (
              <span key={item} className="italic font-semibold">
                {item}
              </span>
            ))}
          </motion.p>
        )}
      </div>

      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mt-5 flex w-full max-w-5xl items-center gap-5 text-[var(--color-gold)] md:mt-8 md:gap-8"
        aria-hidden
      >
        <motion.span
          variants={{
            hidden: { scaleX: 0 },
            visible: { scaleX: 1 },
          }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="h-px flex-1 origin-right bg-current opacity-45"
        />
        <motion.span
          variants={{
            hidden: { scale: shouldReduceMotion ? 1 : 0.4, rotate: shouldReduceMotion ? 45 : 0 },
            visible: { scale: 1, rotate: 45 },
          }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.72, ease: [0.16, 1, 0.3, 1] }}
          className="h-2.5 w-2.5 border border-current opacity-70"
        />
        <motion.span
          variants={{
            hidden: { scaleX: 0 },
            visible: { scaleX: 1 },
          }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="h-px flex-1 origin-left bg-current opacity-45"
        />
      </motion.div>

      <div className="mx-auto mt-5 grid w-full max-w-5xl grid-cols-2 gap-3 md:mt-8 md:gap-12 lg:gap-20">
        {menSuggestion.lead && (
          <DressSuggestion
            label="Hombres"
            lead={menSuggestion.lead}
            bullets={menSuggestion.bullets}
            type="men"
            restrictedTones={[{ label: "Este azul", background: "#17264d" }]}
            delay={0.05}
            shouldReduceMotion={shouldReduceMotion}
          />
        )}
        {womenSuggestion.lead && (
          <DressSuggestion
            label="Mujeres"
            lead={womenSuggestion.lead}
            bullets={womenSuggestion.bullets}
            type="women"
            restrictedTones={[
              { label: "Amarillo", background: "#f2d766" },
              { label: "Blanco", background: "#ffffff", border: "rgba(36,41,31,0.24)" },
              { label: "Vivos", background: "linear-gradient(135deg, #ef476f, #ffb703, #06d6a0)" },
            ]}
            delay={0.15}
            shouldReduceMotion={shouldReduceMotion}
          />
        )}
      </div>

      {config.note && <p className="mt-14 text-sm italic tracking-wide text-[var(--color-terracotta)]">{config.note}</p>}
    </motion.aside>
  );
}

export default function WeddingDetailsSection({ event, rsvp }: WeddingDetailsSectionProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const rsvpRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: rsvpProgress } = useScroll({
    target: rsvpRef,
    offset: ["start 90%", "end 24%"],
  });
  const smoothRsvpProgress = useSpring(rsvpProgress, { stiffness: 82, damping: 30, mass: 0.58 });
  const rsvpY = useTransform(smoothRsvpProgress, [0, 0.5], shouldReduceMotion ? [0, 0] : [42, 0]);
  const rsvpScale = useTransform(smoothRsvpProgress, [0, 0.58], shouldReduceMotion ? [1, 1] : [0.97, 1]);

  return (
    <section id="el-gran-dia-rsvp" className="relative bg-[var(--color-ivory)]">
      <WeddingDetailsStory
        ceremony={event.ceremony}
        reception={event.reception}
        shouldReduceMotion={shouldReduceMotion}
      />

      <div className="relative overflow-hidden bg-white md:h-[100svh]">
        <div className="mx-auto max-w-[1180px] px-4 py-24 md:flex md:h-full md:items-center md:px-8 md:py-8 lg:py-10">
          <section className="relative w-full md:h-full" aria-label="Código de vestimenta">
            <DressCodeNote config={event.dressCode} step={3} shouldReduceMotion={shouldReduceMotion} />
          </section>
        </div>
      </div>

      <div ref={rsvpRef} className="relative isolate overflow-hidden bg-[var(--color-surface)] py-20 md:py-28">
        <img
          src={event.reception.image}
          alt=""
          className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 -z-10 border-t border-[var(--color-olive)]/10 bg-[linear-gradient(180deg,rgba(252,251,248,0.9),rgba(246,245,241,0.84))]"
          aria-hidden
        />
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
    </section>
  );
}
