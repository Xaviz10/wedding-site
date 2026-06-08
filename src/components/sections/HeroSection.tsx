import { motion, useReducedMotion } from "framer-motion";
import type { HeroContent } from "../../types/wedding";
import AnimatedOrchid from "../AnimatedOrchid";

interface HeroSectionProps {
  content: HeroContent;
}

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80";

export default function HeroSection({ content }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="portada"
      className="relative min-h-[100svh] overflow-hidden px-4 pb-14 pt-10 md:px-8 md:pt-12 lg:pb-24"
    >
      <div className="hero-backdrop-image" aria-hidden />
      <div className="hero-backdrop" aria-hidden />
      <div className="hero-clouds" aria-hidden />

      <div className="relative z-10 mx-auto grid max-w-[1220px] gap-8 md:gap-12 lg:mt-4 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-center">
        <motion.header
          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -22 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1.1 }}
          className="relative order-1 px-1 pb-2 pt-1 lg:order-1"
        >
          <p className="text-sm font-medium tracking-[0.02em] text-[var(--color-muted)] sm:text-base md:text-2xl">
            Bienvenidos a
          </p>
          <h1 className="font-script mt-3 text-[clamp(3.2rem,18vw,8rem)] leading-[0.9] text-[var(--color-forest)]">
            {content.title}
          </h1>
          <p className="font-editorial mt-2 text-[2.15rem] leading-tight text-[var(--color-olive)] sm:text-4xl md:text-5xl">
            {content.subtitle}
          </p>
          <p className="section-caption mt-5 max-w-[42ch] text-[var(--color-muted)] md:mt-7">{content.text}</p>

          <p className="mt-6 inline-flex rounded-full bg-[var(--color-surface)]/84 px-4 py-2 text-xs font-medium tracking-[0.05em] text-[var(--color-muted)] sm:mt-8 sm:px-5 sm:text-sm sm:tracking-[0.06em]">
            {content.date}
          </p>
        </motion.header>

        <div className="relative order-2 mx-auto w-full max-w-[580px] pb-14 pt-3 sm:pb-16 lg:order-2 lg:pb-20">
          <motion.figure
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20, y: shouldReduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 1.15 }}
            className="hero-photo-mask relative aspect-[4/5] overflow-hidden border border-[var(--color-olive)]/20 bg-[var(--color-surface)] shadow-[0_20px_46px_rgba(54,59,48,0.18)]"
          >
            <img
              src={HERO_IMAGE}
              alt="Pareja de novios abrazados frente a un paisaje natural"
              className="h-full w-full object-cover object-center"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-white/20" />
          </motion.figure>

          <AnimatedOrchid className="absolute -left-7 top-14 h-[150px] w-[98px] text-[var(--color-olive)]/56 sm:-left-10 sm:top-20 sm:h-[220px] sm:w-[145px] sm:text-[var(--color-olive)]/66 md:-left-16 md:h-[250px] md:w-[166px]" />
          <AnimatedOrchid
            mirrored
            className="absolute -right-6 top-4 h-[126px] w-[84px] text-[var(--color-olive)]/54 sm:-right-8 sm:top-5 sm:h-[170px] sm:w-[116px] sm:text-[var(--color-olive)]/64 md:-right-12 md:h-[195px] md:w-[132px]"
          />

          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 1.05, delay: shouldReduceMotion ? 0 : 0.32 }}
            className="paper-surface absolute left-1 top-[60%] z-20 rounded-[16px] px-3 py-2 sm:-left-2 sm:top-[58%] sm:rounded-[20px] sm:px-4 sm:py-3 md:-left-7 md:px-5"
          >
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Nos casamos
            </p>
            <p className="mt-1 text-base font-semibold text-[var(--color-forest)] sm:text-lg">{content.date}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 1.05, delay: shouldReduceMotion ? 0 : 0.42 }}
            className="paper-surface absolute right-1 bottom-5 z-20 rounded-full px-4 py-2 sm:-right-2 sm:bottom-3 sm:px-5 sm:py-3 md:-right-6 md:px-7"
          >
            <p className="font-heading text-base leading-none text-[var(--color-olive)] sm:text-lg md:text-2xl">{content.subtitle}</p>
          </motion.div>

        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 1.3, delay: shouldReduceMotion ? 0 : 0.35 }}
        className="relative z-10 mx-auto mt-1 flex max-w-[1220px] justify-start"
      >
        <a
          href="#nuestra-historia"
          className="inline-flex items-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-[var(--color-olive)] sm:text-xs sm:tracking-[0.18em] md:text-sm"
        >
          <span className="h-px w-9 bg-[var(--color-olive)]/70 sm:w-14" aria-hidden />
          Abrir la historia
        </a>
      </motion.div>

      <div className="absolute inset-x-0 bottom-8 pointer-events-none hidden justify-center lg:flex" aria-hidden>
        <svg viewBox="0 0 420 72" className="h-14 w-[320px] text-[var(--color-moss-soft)]/70">
          <path
            d="M16 38C54 14 80 14 118 38C156 62 182 62 220 38C258 14 284 14 322 38C352 56 377 56 404 40"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeDasharray="6 10"
            strokeLinecap="round"
          />
          <circle cx="16" cy="38" r="4" fill="currentColor" />
          <circle cx="404" cy="40" r="4" fill="currentColor" />
        </svg>
      </div>

      <div className="section-divider" aria-hidden />
    </section>
  );
}
