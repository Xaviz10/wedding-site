import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroImage from "../../assets/hero.jpg";
import type { HeroContent } from "../../types/wedding";

interface HeroSectionProps {
  content: HeroContent;
}

const HERO_IMAGE = heroImage;

// Cinematic light dust particles to make the scene feel alive
const ambientParticles = [
  { size: 4, left: "15%", top: "20%", delay: 0, duration: 12 },
  { size: 6, left: "85%", top: "15%", delay: 2, duration: 15 },
  { size: 3, left: "55%", top: "40%", delay: 1, duration: 10 },
  { size: 5, left: "25%", top: "60%", delay: 3, duration: 18 },
  { size: 7, left: "75%", top: "70%", delay: 0.5, duration: 14 },
  { size: 4, left: "45%", top: "85%", delay: 4, duration: 16 },
];

export default function HeroSection({ content }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="portada"
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-[var(--color-forest)] md:bg-[var(--color-ivory)]"
    >
      {/* Split image on desktop, full-bleed image on mobile */}
      <motion.div 
        className="absolute inset-0 z-0 origin-top md:bottom-auto md:right-auto md:h-full md:w-1/2"
        style={{ y: shouldReduceMotion ? 0 : backgroundY }}
      >
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
          src={HERO_IMAGE}
          alt="Ale y Dani"
          className="h-full w-full object-cover object-center md:object-[52%_center]"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70 md:bg-black/10" />
      </motion.div>

      <div className="absolute inset-0 z-0 hidden bg-[var(--color-ivory)] md:left-1/2 md:block" aria-hidden />

      {/* Ambient Light Particles */}
      {!shouldReduceMotion && (
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden mix-blend-screen md:right-1/2" aria-hidden>
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
                opacity: [0.2, 0.6, 0.2],
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

      {/* Main Cinematic Typography - Parallax Enabled */}
      <motion.div 
        className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-4 text-center md:ml-auto md:w-1/2 md:items-start md:px-12 md:text-left lg:px-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-white/80 md:text-[var(--color-olive)] md:text-[0.85rem]">
            Bienvenidos a la boda de
          </p>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          className="font-heading mt-6 text-[clamp(4.5rem,18vw,12rem)] leading-[0.85] text-white drop-shadow-2xl md:text-[clamp(4.25rem,8vw,8.5rem)] md:text-[var(--color-forest)] md:drop-shadow-none"
        >
          {content.title}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
          className="font-editorial mt-6 text-[clamp(2rem,6vw,4.5rem)] italic text-white/90 drop-shadow-md md:text-[clamp(2rem,4vw,3.5rem)] md:text-[var(--color-terracotta)] md:drop-shadow-none"
        >
          {content.subtitle}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.75 }}
          className="font-editorial mt-7 hidden max-w-[34rem] text-[1.35rem] leading-[1.32] text-[var(--color-forest)]/75 md:block"
        >
          {content.text}
        </motion.p>
      </motion.div>

      {/* Bottom Information & Dynamic Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
        style={{ opacity: textOpacity }}
        className="relative z-10 mb-8 flex w-full flex-col items-center justify-between gap-10 px-8 md:mb-12 md:ml-auto md:w-1/2 md:flex-row md:px-12 lg:px-20"
      >
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-white/70 md:text-[var(--color-olive)]">
            La Fecha
          </span>
          <span className="font-editorial mt-2 text-2xl text-white md:text-3xl md:text-[var(--color-forest)]">
            {content.date}
          </span>
        </div>

        <a
          href="#nuestra-historia"
          className="group flex flex-col items-center gap-4 text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-white transition-opacity hover:opacity-80 md:items-end md:text-[var(--color-forest)]"
        >
          Descubrir más
          <motion.span 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/5 backdrop-blur-sm transition-colors group-hover:bg-white/10 md:border-[var(--color-olive)]/30 md:bg-[var(--color-olive)]/10 md:group-hover:bg-[var(--color-olive)]/15"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white md:text-[var(--color-forest)]">
              <path d="M12 4V20M12 20L6 14M12 20L18 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.span>
        </a>
      </motion.div>
    </section>
  );
}
