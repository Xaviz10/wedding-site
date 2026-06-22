import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";
import heroImage from "../../assets/hero.jpg";
import type { HeroContent } from "../../types/wedding";

interface HeroSectionProps {
  content: HeroContent;
}

const HERO_IMAGE = heroImage;

const ambientParticles = [
  { size: 4, left: "15%", top: "20%", delay: 0, duration: 12 },
  { size: 6, left: "85%", top: "15%", delay: 2, duration: 15 },
  { size: 3, left: "55%", top: "40%", delay: 1, duration: 10 },
  { size: 5, left: "25%", top: "60%", delay: 3, duration: 18 },
  { size: 7, left: "75%", top: "70%", delay: 0.5, duration: 14 },
  { size: 4, left: "45%", top: "85%", delay: 4, duration: 16 },
];

function TopOrnament() {
  return (
    <svg
      viewBox="0 0 250 128"
      fill="none"
      aria-hidden
      className="h-auto w-[8.75rem] text-[var(--color-gold)] opacity-78 md:w-[11.75rem]"
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
    <div className="flex w-[min(15rem,58vw)] items-center justify-center gap-4 text-[var(--color-gold)] opacity-75 md:w-[24rem] md:gap-7" aria-hidden>
      <span className="h-px flex-1 bg-current" />
      <span className="h-2.5 w-2.5 rotate-45 border border-current" />
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
      className="h-auto w-[9.5rem] text-[var(--color-gold)] opacity-45 md:w-[13rem]"
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
  const titleParts = useMemo(() => content.title.split("&").map((part) => part.trim()), [content.title]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.76], [1, 0]);

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
        <motion.img
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
          src={HERO_IMAGE}
          alt="Cata y Javier"
          className="h-full w-full object-cover object-[50%_44%] md:object-[50%_42%]"
          loading="eager"
          decoding="async"
        />
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
        className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[92rem] flex-col items-center justify-center px-5 py-12 text-center sm:px-8 md:px-12 md:py-8"
      >
        <div className="flex w-full max-w-[68rem] flex-col items-center">
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
            className="mt-6 origin-center md:mt-[clamp(1rem,2vh,1.5rem)]"
          >
            <DividerOrnament />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.42 }}
            className="mt-8 text-[0.62rem] font-semibold uppercase tracking-[0.4em] text-[var(--color-gold)] drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] md:mt-[clamp(1.5rem,3vh,2rem)] md:text-[0.78rem]"
          >
            Bienvenidos a la boda de
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.45, ease: [0.22, 1, 0.36, 1], delay: 0.58 }}
            className="font-heading mt-5 whitespace-nowrap text-[clamp(3rem,11vw,5.1rem)] font-medium italic leading-[0.88] tracking-normal text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.42)] md:mt-[clamp(1.5rem,3vh,2.5rem)] md:text-[clamp(4.8rem,6.4vw,7.6rem)]"
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
            className="font-editorial mt-4 text-[clamp(1.45rem,4.4vw,2.1rem)] italic leading-none text-white/88 drop-shadow-[0_4px_16px_rgba(0,0,0,0.42)] md:mt-[clamp(1.1rem,2.2vh,1.7rem)] md:text-[clamp(1.85rem,2.5vw,2.55rem)]"
          >
            {content.subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.88 }}
            className="mt-12 max-w-[31rem] text-[clamp(0.95rem,2.25vw,1.18rem)] font-light leading-[1.65] text-white/76 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] md:mt-[clamp(2.25rem,4.5vh,3.5rem)] md:max-w-[48rem] md:text-[clamp(1rem,1.18vw,1.16rem)] md:leading-[1.5]"
          >
            {content.text}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 1.02 }}
            className="mt-[clamp(2.5rem,5vh,4.25rem)] w-full max-w-[22rem] rounded-[7px] border border-[color-mix(in_oklab,var(--color-gold)_42%,transparent)] bg-[rgba(19,20,16,0.52)] px-4 py-4 shadow-[0_12px_38px_rgba(0,0,0,0.26)] backdrop-blur-md sm:max-w-[24rem] sm:px-6 md:mt-[clamp(2rem,4vh,3rem)] md:max-w-[32rem] md:py-5"
          >
            <span className="block text-[0.54rem] font-semibold uppercase tracking-[0.34em] text-[var(--color-gold)] md:text-[0.64rem]">
              La Fecha
            </span>
            <span className="font-heading mt-2.5 block text-[clamp(1.55rem,6vw,2.45rem)] font-semibold leading-none tracking-normal text-white md:mt-3 md:text-[clamp(1.95rem,2vw,2.35rem)]">
              {content.date}
            </span>
          </motion.div>

          <motion.a
            href="#nuestra-historia"
            aria-label={content.cta}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 1.18 }}
            className="mt-9 inline-flex rounded-full p-2 transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)] md:mt-[clamp(1.5rem,3vh,2.5rem)]"
          >
            <motion.span
              animate={shouldReduceMotion ? undefined : { y: [0, 7, 0], opacity: [0.5, 0.82, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <BottomOrnament />
            </motion.span>
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
