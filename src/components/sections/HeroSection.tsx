import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import heroImage from "../../assets/hero.jpg";
import heroImage0892 from "../../assets/hero-img-0892.jpg";
import heroImage20190828 from "../../assets/hero-img-20190828.jpg";
import heroImageJkm0396 from "../../assets/hero-img-jkm-0396.jpg";
import type { HeroContent } from "../../types/wedding";

interface HeroSectionProps {
  content: HeroContent;
}

const ambientParticles = [
  { size: 4, left: "15%", top: "20%", delay: 0, duration: 12 },
  { size: 6, left: "85%", top: "15%", delay: 2, duration: 15 },
  { size: 3, left: "55%", top: "40%", delay: 1, duration: 10 },
  { size: 5, left: "25%", top: "60%", delay: 3, duration: 18 },
  { size: 7, left: "75%", top: "70%", delay: 0.5, duration: 14 },
  { size: 4, left: "45%", top: "85%", delay: 4, duration: 16 },
];

const SECOND_IN_MS = 1000;
const MINUTE_IN_MS = 60 * SECOND_IN_MS;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;
const DAY_IN_MS = 24 * HOUR_IN_MS;
const HERO_IMAGE_INTERVAL_MS = 30 * SECOND_IN_MS;

const heroSlides = [
  {
    src: heroImage,
    alt: "Cata y Javier",
    mobilePosition: "50% 44%",
    desktopPosition: "50% 42%",
  },
  {
    src: heroImage0892,
    alt: "Cata y Javier en una montaña nevada",
    mobilePosition: "55% 54%",
    desktopPosition: "55% 55%",
  },
  {
    src: heroImage20190828,
    alt: "Cata y Javier en una estructura de piedra",
    mobilePosition: "60% 100%",
    desktopPosition: "51% 57%",
  },
  {
    src: heroImageJkm0396,
    alt: "Cata y Javier en una celebración",
    mobilePosition: "54% 50%",
    desktopPosition: "54% 50%",
  },
] as const;

interface CountdownFieldProps {
  label: string;
  value: number;
}

function CountdownField({ label, value }: CountdownFieldProps) {
  return (
    <span className="flex min-w-0 flex-col items-center px-1 sm:px-2">
      <span className="font-heading tabular-nums text-[clamp(1.15rem,4.8vw,1.8rem)] font-semibold leading-none text-white">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1.5 text-[0.42rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)]/88 sm:text-[0.48rem] md:text-[0.52rem]">
        {label}
      </span>
    </span>
  );
}

function WeddingCountdown({ target }: { target: string }) {
  const targetTime = useMemo(() => new Date(target).getTime(), [target]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const updateNow = () => setNow(Date.now());
    updateNow();

    const intervalId = window.setInterval(updateNow, SECOND_IN_MS);
    return () => window.clearInterval(intervalId);
  }, [targetTime]);

  const remaining = Number.isFinite(targetTime) ? Math.max(0, targetTime - now) : 0;

  if (remaining === 0) {
    return (
      <p className="font-editorial mt-2 text-[clamp(1.15rem,4vw,1.7rem)] italic leading-tight text-white">
        Gracias por tu compañía
      </p>
    );
  }

  const days = Math.floor(remaining / DAY_IN_MS);
  const hours = Math.floor((remaining % DAY_IN_MS) / HOUR_IN_MS);
  const minutes = Math.floor((remaining % HOUR_IN_MS) / MINUTE_IN_MS);
  const seconds = Math.floor((remaining % MINUTE_IN_MS) / SECOND_IN_MS);
  const showDays = remaining >= DAY_IN_MS;

  return (
    <div
      className={`mt-2.5 grid divide-x divide-[color-mix(in_oklab,var(--color-gold)_24%,transparent)] ${
        showDays ? "grid-cols-4" : "grid-cols-3"
      }`}
      role="timer"
      aria-label={`${showDays ? `${days} días, ` : ""}${hours} horas, ${minutes} minutos y ${seconds} segundos`}
    >
      {showDays && <CountdownField label="Días" value={days} />}
      <CountdownField label="Horas" value={hours} />
      <CountdownField label="Min" value={minutes} />
      <CountdownField label="Seg" value={seconds} />
    </div>
  );
}

function TopOrnament() {
  return (
    <svg
      viewBox="0 0 250 128"
      fill="none"
      aria-hidden
      className="h-auto w-[6.25rem] text-[var(--color-gold)] opacity-78 md:w-[8rem]"
    >
      <path d="M125 37V112" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
      <path d="M125 63C103 44 82 31 61 25" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" />
      <path d="M125 63C147 44 168 31 189 25" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" />
      <path d="M125 74C97 66 72 62 49 63" stroke="currentColor" strokeWidth="0.95" strokeLinecap="round" />
      <path d="M125 74C153 66 178 62 201 63" stroke="currentColor" strokeWidth="0.95" strokeLinecap="round" />
      <path d="M125 83C103 83 84 86 68 93" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M125 83C147 83 166 86 182 93" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
      {[125, 61, 189, 49, 201].map((cx, index) => {
        const cy = [20, 25, 25, 63, 63][index];
        const scale = index === 0 ? 1.15 : 0.85;

        return (
          <path
            key={`${cx}-${cy}`}
            d={`M ${cx} ${cy - 14 * scale} L ${cx + 3.2 * scale} ${cy - 3.5 * scale} L ${
              cx + 14 * scale
            } ${cy - 2.8 * scale} L ${cx + 5.2 * scale} ${cy + 3.4 * scale} L ${
              cx + 8.6 * scale
            } ${cy + 13.5 * scale} L ${cx} ${cy + 7.2 * scale} L ${cx - 8.6 * scale} ${
              cy + 13.5 * scale
            } L ${cx - 5.2 * scale} ${cy + 3.4 * scale} L ${cx - 14 * scale} ${
              cy - 2.8 * scale
            } L ${cx - 3.2 * scale} ${cy - 3.5 * scale} Z`}
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        );
      })}
    </svg>
  );
}

function DividerOrnament() {
  return (
    <div className="flex w-[min(11rem,48vw)] items-center justify-center gap-3 text-[var(--color-gold)] opacity-75 md:w-[16rem] md:gap-5" aria-hidden>
      <span className="h-px flex-1 bg-current" />
      <span className="h-2 w-2 rotate-45 border border-current" />
      <span className="h-px flex-1 bg-current" />
    </div>
  );
}

function BottomOrnament() {
  return (
    <svg
      viewBox="0 0 240 96"
      fill="none"
      aria-hidden
      className="h-auto w-[6.25rem] text-[var(--color-gold)] opacity-45 md:w-[8.5rem]"
    >
      <path d="M120 14V82" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M120 47C95 38 74 36 55 42" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M120 47C145 38 166 36 185 42" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M120 64C91 56 64 57 39 68" stroke="currentColor" strokeWidth="0.95" strokeLinecap="round" />
      <path d="M120 64C149 56 176 57 201 68" stroke="currentColor" strokeWidth="0.95" strokeLinecap="round" />
      <circle cx="120" cy="14" r="3.5" fill="currentColor" />
      <circle cx="55" cy="42" r="3.3" fill="currentColor" />
      <circle cx="185" cy="42" r="3.3" fill="currentColor" />
      <circle cx="39" cy="68" r="3.1" fill="currentColor" />
      <circle cx="201" cy="68" r="3.1" fill="currentColor" />
    </svg>
  );
}

export default function HeroSection({ content }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const titleParts = useMemo(() => content.title.split("&").map((part) => part.trim()), [content.title]);
  const activeHeroSlide = heroSlides[activeHeroIndex];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.76], [1, 0]);

  useEffect(() => {
    if (heroSlides.length <= 1) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveHeroIndex((index) => (index + 1) % heroSlides.length);
    }, HERO_IMAGE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const nextSlide = heroSlides[(activeHeroIndex + 1) % heroSlides.length];
    const image = new window.Image();
    image.src = nextSlide.src;
  }, [activeHeroIndex]);

  return (
    <section
      ref={sectionRef}
      id="portada"
      className="relative isolate flex min-h-[100svh] w-full overflow-hidden bg-[var(--color-forest)] text-white"
    >
      <motion.div
        className="absolute inset-x-0 -inset-y-[12%] z-0 origin-top"
        style={{ y: shouldReduceMotion ? 0 : backgroundY }}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={activeHeroSlide.src}
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.03 }}
            transition={{
              opacity: { duration: shouldReduceMotion ? 0 : 1.4, ease: "easeInOut" },
              scale: { duration: shouldReduceMotion ? 0 : 3, ease: "easeOut" },
            }}
            src={activeHeroSlide.src}
            alt={activeHeroSlide.alt}
            className="absolute inset-0 h-full w-full object-cover [object-position:var(--hero-mobile-position)] md:[object-position:var(--hero-desktop-position)]"
            style={
              {
                "--hero-mobile-position": activeHeroSlide.mobilePosition,
                "--hero-desktop-position": activeHeroSlide.desktopPosition,
              } as CSSProperties
            }
            loading={activeHeroIndex === 0 ? "eager" : "lazy"}
            fetchPriority={activeHeroIndex === 0 ? "high" : "auto"}
            decoding="async"
          />
        </AnimatePresence>
      </motion.div>

      <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(0,0,0,0.74)_0%,rgba(0,0,0,0.46)_42%,rgba(0,0,0,0.82)_100%)]" aria-hidden />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.12),transparent_30%),radial-gradient(circle_at_50%_50%,transparent_0,rgba(0,0,0,0.48)_76%)]" aria-hidden />

      {!shouldReduceMotion && (
        <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden mix-blend-screen" aria-hidden>
          {ambientParticles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/30 blur-[2px]"
              style={{
                width: particle.size,
                height: particle.size,
                left: particle.left,
                top: particle.top,
              }}
              animate={{
                y: ["-20px", "20px", "-20px"],
                x: ["-10px", "10px", "-10px"],
                opacity: [0.15, 0.5, 0.15],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        style={{ opacity: textOpacity }}
        className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[92rem] flex-col items-center px-5 py-5 text-center sm:px-8 md:px-12 md:py-6"
      >
        <div className="flex min-h-[calc(100svh-2.5rem)] w-full max-w-[68rem] flex-col items-center justify-between md:min-h-[calc(100svh-3rem)]">
          <div className="flex w-full flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <TopOrnament />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scaleX: 0.72 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.28 }}
            className="mt-2 origin-center md:mt-3"
          >
            <DividerOrnament />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.42 }}
            className="mt-3 text-[0.58rem] font-semibold uppercase tracking-[0.38em] text-[var(--color-gold)] drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] md:mt-4 md:text-[0.7rem]"
          >
            Bienvenidos a la boda de
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.45, ease: [0.22, 1, 0.36, 1], delay: 0.58 }}
            className="font-heading mt-3 whitespace-nowrap text-[clamp(2.8rem,10vw,4.8rem)] font-medium italic leading-[0.88] tracking-normal text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.42)] md:mt-4 md:text-[clamp(4.4rem,6vw,6.8rem)]"
          >
            {titleParts.length >= 2 ? (
              <>
                <span>{titleParts[0]}</span>{" "}
                <span className="font-semibold text-[var(--color-gold)]">&amp;</span>{" "}
                <span>{titleParts.slice(1).join(" & ")}</span>
              </>
            ) : (
              content.title
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.74 }}
            className="font-editorial mt-2 text-[clamp(1.3rem,4vw,1.8rem)] italic leading-none text-white/88 drop-shadow-[0_4px_16px_rgba(0,0,0,0.42)] md:mt-3 md:text-[clamp(1.7rem,2.25vw,2.25rem)]"
          >
            {content.subtitle}
          </motion.p>
          </div>

          <div className="flex w-full flex-col items-center">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.88 }}
            className="max-w-[29rem] text-[clamp(0.86rem,2vw,1rem)] font-light leading-[1.5] text-white/76 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] md:max-w-[44rem] md:text-[clamp(0.92rem,1vw,1.02rem)] md:leading-[1.45]"
          >
            {content.text}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 1.02 }}
            className="mt-4 w-full max-w-[18rem] rounded-[7px] border border-[color-mix(in_oklab,var(--color-gold)_42%,transparent)] bg-[rgba(19,20,16,0.52)] px-3 py-3 shadow-[0_12px_38px_rgba(0,0,0,0.26)] backdrop-blur-md sm:max-w-[20rem] sm:px-4 md:mt-5 md:max-w-[26rem] md:py-3.5"
          >
            <span className="block text-[0.48rem] font-semibold uppercase tracking-[0.3em] text-[var(--color-gold)] md:text-[0.56rem]">
              Cuenta regresiva
            </span>
            <WeddingCountdown target={content.countdownTarget} />
          </motion.div>

          <motion.a
            href="#nuestra-historia"
            aria-label={content.cta}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 1.18 }}
            className="mt-2 inline-flex rounded-full p-1.5 transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)] md:mt-3"
          >
            <motion.span
              animate={shouldReduceMotion ? undefined : { y: [0, 7, 0], opacity: [0.5, 0.82, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <BottomOrnament />
            </motion.span>
          </motion.a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
