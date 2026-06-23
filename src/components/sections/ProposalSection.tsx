import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import type { WeddingContent } from "../../types/wedding";

interface ProposalSectionProps {
  content: WeddingContent["proposal"];
}

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0 },
};

const atmosphereParticles = [
  { left: "8%", top: "18%", size: 2, delay: 0.2, duration: 9.4, drift: 18 },
  { left: "18%", top: "62%", size: 3, delay: 1.4, duration: 11.2, drift: -14 },
  { left: "31%", top: "34%", size: 2, delay: 2.2, duration: 10.6, drift: 12 },
  { left: "48%", top: "16%", size: 2, delay: 0.8, duration: 12.5, drift: -16 },
  { left: "63%", top: "52%", size: 3, delay: 1.8, duration: 10.8, drift: 14 },
  { left: "78%", top: "24%", size: 2, delay: 2.8, duration: 12.2, drift: -12 },
  { left: "90%", top: "70%", size: 3, delay: 0.4, duration: 11.6, drift: 16 },
];

const snowflakes = [
  { left: "7%", top: "28%", size: 12, delay: 0.2, duration: 8.4, drift: 14 },
  { left: "17%", top: "74%", size: 9, delay: 1.1, duration: 10.2, drift: -10 },
  { left: "35%", top: "18%", size: 15, delay: 2.1, duration: 11.4, drift: 12 },
  { left: "53%", top: "66%", size: 10, delay: 0.7, duration: 9.6, drift: -14 },
  { left: "69%", top: "32%", size: 13, delay: 1.7, duration: 10.8, drift: 10 },
  { left: "84%", top: "16%", size: 9, delay: 2.6, duration: 8.9, drift: -8 },
  { left: "93%", top: "58%", size: 16, delay: 0.4, duration: 12.1, drift: 13 },
];

function SnowflakeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <path
        d="M16 2V30M4 9L28 23M28 9L4 23M16 2L12.5 6M16 2L19.5 6M16 30L12.5 26M16 30L19.5 26M4 9L9.2 10M4 9L5.8 14M28 23L22.8 22M28 23L26.2 18M28 9L22.8 10M28 9L26.2 14M4 23L9.2 22M4 23L5.8 18"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProposalSection({ content }: ProposalSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const firstSectionRef = useRef<HTMLElement | null>(null);
  const proposalCarouselRef = useRef<HTMLDivElement | null>(null);
  const backgroundPhoto = content.photos.find((photo) => photo.format === "landscape") ?? content.photos[0];
  const ringPhoto = content.photos.find((photo) => photo.format === "square") ?? content.photos[2] ?? content.photos[0];
  const proposalSlides = [ringPhoto, ...content.photos.filter((photo) => photo.src !== ringPhoto.src)];
  const [activeProposalSlide, setActiveProposalSlide] = useState(0);
  const proposalParagraphs = content.beats.filter((beat) => !beat.emphasis).slice(0, 2);
  const plainBeats = content.beats.filter((beat) => !beat.emphasis);
  const yesBeat = content.beats.find((beat) => beat.emphasis === "highlight");
  const videoBeat = content.beats.find((beat) => beat.emphasis === "humor");
  const quoteBeat = plainBeats[plainBeats.length - 1];

  const { scrollYProgress } = useScroll({
    target: firstSectionRef,
    offset: ["start start", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 70, damping: 30, mass: 0.7 });
  const backgroundY = useTransform(smoothProgress, [0, 1], shouldReduceMotion ? ["0%", "0%"] : ["-2%", "7%"]);
  const backgroundScale = useTransform(smoothProgress, [0, 1], shouldReduceMotion ? [1, 1] : [1.04, 1.12]);

  const motionTransition = {
    duration: shouldReduceMotion ? 0 : 1.15,
    ease: [0.16, 1, 0.3, 1] as const,
  };

  const syncProposalSlide = useCallback(
    (target: HTMLDivElement) => {
      const width = Math.max(target.clientWidth, 1);
      const nextIndex = Math.min(
        Math.max(Math.round(target.scrollLeft / width), 0),
        proposalSlides.length - 1,
      );
      setActiveProposalSlide((previous) => (previous === nextIndex ? previous : nextIndex));
    },
    [proposalSlides.length],
  );

  const scrollToProposalSlide = useCallback(
    (slideIndex: number) => {
      if (!proposalCarouselRef.current) return;

      proposalCarouselRef.current.scrollTo({
        left: proposalCarouselRef.current.clientWidth * slideIndex,
        behavior: shouldReduceMotion ? "auto" : "smooth",
      });
      setActiveProposalSlide(slideIndex);
    },
    [shouldReduceMotion],
  );

  const handleProposalCarouselKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollToProposalSlide(Math.min(activeProposalSlide + 1, proposalSlides.length - 1));
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollToProposalSlide(Math.max(activeProposalSlide - 1, 0));
      }
    },
    [activeProposalSlide, proposalSlides.length, scrollToProposalSlide],
  );

  return (
    <section id="propuesta" className="relative isolate overflow-hidden bg-[var(--color-forest)]">
      <section
        ref={firstSectionRef}
        className="relative isolate min-h-[100svh] overflow-hidden bg-[var(--color-forest)] text-[#f8f0df]"
        aria-labelledby="proposal-title"
      >
        <motion.div className="absolute inset-x-0 -inset-y-[8%] z-0" style={{ y: backgroundY, scale: backgroundScale }}>
          <img
            src={backgroundPhoto.src}
            alt={backgroundPhoto.alt}
            className="h-full w-full object-cover object-[54%_50%]"
            loading="lazy"
            decoding="async"
          />
        </motion.div>
        <div
          className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(7,11,13,0.56)_0%,rgba(7,11,13,0.28)_42%,rgba(7,11,13,0.64)_100%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_84%_78%,rgba(5,7,6,0.84)_0%,rgba(5,7,6,0.62)_27%,rgba(5,7,6,0.08)_58%,transparent_72%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 z-[3] bg-[linear-gradient(90deg,rgba(5,8,7,0.5)_0%,transparent_35%,rgba(5,8,7,0.16)_100%)]"
          aria-hidden
        />
        {!shouldReduceMotion && (
          <div className="pointer-events-none absolute inset-0 z-[4] overflow-hidden" aria-hidden>
            {atmosphereParticles.map((particle, index) => (
              <motion.span
                key={`proposal-atmosphere-${index}`}
                className="absolute rounded-full bg-[#fff8e8]/55 blur-[1px]"
                style={{
                  left: particle.left,
                  top: particle.top,
                  width: particle.size,
                  height: particle.size,
                }}
                animate={{
                  x: [0, particle.drift, 0],
                  y: [0, -18, 0],
                  opacity: [0.12, 0.5, 0.12],
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

        <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" aria-hidden>
          {snowflakes.map((snowflake, index) => (
            <motion.span
              key={`proposal-snowflake-${index}`}
              className="absolute block text-[#fff8e8]/48 drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)]"
              style={{
                left: snowflake.left,
                top: snowflake.top,
                width: snowflake.size,
                height: snowflake.size,
              }}
              animate={
                shouldReduceMotion
                  ? undefined
                  : { x: [0, snowflake.drift, 0], y: [-8, 24, -8], rotate: [0, 180, 360], opacity: [0.25, 0.62, 0.25] }
              }
              transition={{
                duration: snowflake.duration,
                delay: snowflake.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <SnowflakeIcon className="h-full w-full" />
            </motion.span>
          ))}
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[94rem] flex-col px-5 py-8 sm:px-8 md:px-14 md:py-12 lg:px-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.42 }}
            variants={fadeUp}
            transition={motionTransition}
            className="max-w-xl"
          >
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.38em] text-[#f8f0df]/78 md:text-[0.7rem]">
              {backgroundPhoto.caption}
            </p>
            <motion.span
              className="mt-4 block h-px w-16 origin-left bg-[#d8c8a8]/78"
              initial={shouldReduceMotion ? false : { scaleX: 0, opacity: 0 }}
              whileInView={shouldReduceMotion ? undefined : { scaleX: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 1.25, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden
            />

            <div className="mt-[clamp(3rem,10svh,7.5rem)]">
              <div className="relative inline-block">
                <h2
                  id="proposal-title"
                  className="font-heading text-[clamp(3.2rem,7vw,6.2rem)] font-medium italic leading-[0.88] tracking-normal text-[#fff8e8] drop-shadow-[0_16px_38px_rgba(0,0,0,0.36)]"
                >
                  La propuesta
                </h2>
                <motion.span
                  className="absolute -left-8 -top-7 block h-5 w-5 text-[#fff8e8]/72 md:-left-12 md:-top-9 md:h-7 md:w-7"
                  animate={shouldReduceMotion ? undefined : { y: [0, -5, 0], rotate: [0, 18, 0] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden
                >
                  <SnowflakeIcon className="h-full w-full" />
                </motion.span>
                <motion.span
                  className="absolute -right-8 bottom-0 block h-4 w-4 text-[var(--color-gold)]/78 md:-right-12 md:h-6 md:w-6"
                  animate={shouldReduceMotion ? undefined : { y: [0, -6, 0], rotate: [12, -12, 12] }}
                  transition={{ duration: 3.7, delay: 0.45, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden
                >
                  <SnowflakeIcon className="h-full w-full" />
                </motion.span>
                <motion.span
                  className="absolute right-5 -top-9 block h-3 w-3 text-[#fff8e8]/52 md:right-8 md:-top-12 md:h-4 md:w-4"
                  animate={shouldReduceMotion ? undefined : { y: [0, -4, 0], rotate: [-8, 14, -8] }}
                  transition={{ duration: 3.2, delay: 0.8, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden
                >
                  <SnowflakeIcon className="h-full w-full" />
                </motion.span>
              </div>
              <p className="font-editorial mt-4 text-[clamp(1.16rem,2vw,1.75rem)] italic leading-[1.05] text-[#f0dcc0]/92">
                {content.intro}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.32 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: shouldReduceMotion ? 0 : 0.16,
                },
              },
            }}
            className="ml-auto mt-auto grid max-w-[47rem] gap-5 pb-[clamp(1rem,4svh,3.5rem)] pt-14 text-right"
          >
            {proposalParagraphs.map((beat) => (
              <motion.p
                key={beat.text}
                variants={fadeUp}
                transition={motionTransition}
                className="font-editorial text-[clamp(1.02rem,1.45vw,1.38rem)] leading-[1.42] text-[#fff7e8] drop-shadow-[0_8px_24px_rgba(0,0,0,0.62)]"
              >
                {beat.text}
              </motion.p>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        className="relative isolate min-h-[100svh] overflow-hidden bg-white text-[var(--color-forest)] lg:h-[100svh]"
        aria-labelledby="proposal-yes-title"
      >
        <div
          className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(36,41,31,0.22),transparent)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
          {snowflakes.slice(0, 6).map((snowflake, index) => (
            <motion.span
              key={`proposal-light-snowflake-${index}`}
              className="absolute block text-[var(--color-olive)]/18"
              style={{
                left: snowflake.left,
                top: snowflake.top,
                width: snowflake.size + 3,
                height: snowflake.size + 3,
              }}
              animate={
                shouldReduceMotion
                  ? undefined
                  : { x: [0, snowflake.drift * 0.7, 0], y: [-5, 18, -5], rotate: [0, 160, 320], opacity: [0.12, 0.32, 0.12] }
              }
              transition={{
                duration: snowflake.duration + 1.5,
                delay: snowflake.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <SnowflakeIcon className="h-full w-full" />
            </motion.span>
          ))}
        </div>

        <div className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-[94rem] gap-8 px-5 py-14 sm:px-8 md:px-14 lg:h-[100svh] lg:grid-cols-12 lg:items-center lg:gap-x-10 lg:px-20 lg:py-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.45 }}
            variants={fadeUp}
            transition={motionTransition}
            className="self-center lg:col-span-5"
          >
            <p className="mb-4 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-olive)] md:text-[0.68rem]">
              {ringPhoto.caption}
            </p>
            <div className="relative w-fit">
              <h2
                id="proposal-yes-title"
                className="font-heading relative z-10 max-w-[9ch] text-[clamp(3.15rem,6.5vw,5.85rem)] font-medium italic leading-[0.88] tracking-normal text-[var(--color-forest)]"
              >
                {yesBeat?.text ?? "Cata dijo que sí."}
              </h2>
              <motion.span
                className="absolute -left-7 -top-7 block h-5 w-5 text-[var(--color-olive)]/52 md:-left-10 md:-top-9 md:h-7 md:w-7"
                animate={shouldReduceMotion ? undefined : { y: [0, -5, 0], rotate: [0, 20, 0] }}
                transition={{ duration: 4.1, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              >
                <SnowflakeIcon className="h-full w-full" />
              </motion.span>
              <motion.span
                className="absolute -right-7 bottom-1 block h-4 w-4 text-[var(--color-gold)] md:-right-10 md:h-6 md:w-6"
                animate={shouldReduceMotion ? undefined : { y: [0, -6, 0], rotate: [10, -14, 10] }}
                transition={{ duration: 3.6, delay: 0.45, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              >
                <SnowflakeIcon className="h-full w-full" />
              </motion.span>
              <motion.span
                className="absolute right-4 -top-9 block h-3 w-3 text-[var(--color-terracotta)]/45 md:right-8 md:-top-12 md:h-4 md:w-4"
                animate={shouldReduceMotion ? undefined : { y: [0, -4, 0], rotate: [-8, 16, -8] }}
                transition={{ duration: 3.1, delay: 0.8, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              >
                <SnowflakeIcon className="h-full w-full" />
              </motion.span>
            </div>
          </motion.div>

          <div className="grid gap-6 lg:col-span-7 lg:grid-cols-7 lg:items-end lg:gap-5 xl:gap-6">
            <motion.figure
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              variants={fadeUp}
              transition={motionTransition}
              className="lg:col-span-7"
            >
              <motion.div
                className="relative aspect-[16/10] w-full overflow-hidden rounded-[6px] shadow-[0_30px_70px_rgba(36,41,31,0.18)] lg:h-[44svh] lg:aspect-auto"
                initial={shouldReduceMotion ? false : { clipPath: "inset(9% 7% 9% 7%)", opacity: 0.72 }}
                whileInView={shouldReduceMotion ? undefined : { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
                viewport={{ once: true, amount: 0.36 }}
                transition={{ duration: 1.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  ref={proposalCarouselRef}
                  className="flex h-full w-full cursor-grab snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth active:cursor-grabbing scrollbar-hide"
                  onScroll={(event) => syncProposalSlide(event.currentTarget)}
                  onKeyDown={handleProposalCarouselKeyDown}
                  tabIndex={0}
                  role="region"
                  aria-roledescription="carrusel"
                  aria-label="Fotos de la propuesta"
                  initial={shouldReduceMotion ? false : { scale: 1.08 }}
                  whileInView={shouldReduceMotion ? undefined : { scale: 1.01 }}
                  viewport={{ once: true, amount: 0.36 }}
                  transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {proposalSlides.map((photo, slideIndex) => (
                    <div
                      key={photo.src}
                      className="h-full w-full shrink-0 snap-center"
                      role="group"
                      aria-label={`${slideIndex + 1} de ${proposalSlides.length}`}
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </motion.div>
                <div
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(36,41,31,0.02),rgba(36,41,31,0.2))]"
                  aria-hidden
                />
                <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-white/55 px-3 py-2 shadow-sm backdrop-blur-md">
                  {proposalSlides.map((photo, slideIndex) => (
                    <button
                      key={`proposal-dot-${photo.src}`}
                      type="button"
                      className={`h-1.5 rounded-full transition-all ${
                        activeProposalSlide === slideIndex
                          ? "w-5 bg-[var(--color-forest)]"
                          : "w-1.5 bg-[var(--color-forest)]/45 hover:bg-[var(--color-forest)]/70"
                      }`}
                      onClick={() => scrollToProposalSlide(slideIndex)}
                      aria-label={`Ver foto ${slideIndex + 1}`}
                      aria-current={activeProposalSlide === slideIndex ? "true" : undefined}
                    />
                  ))}
                </div>
              </motion.div>
              {quoteBeat && (
                <blockquote className="font-editorial ml-auto mt-4 max-w-[30rem] text-right text-[clamp(1.12rem,1.5vw,1.58rem)] italic leading-[1.14] text-[var(--color-forest)]/86">
                  “{quoteBeat.text}”
                </blockquote>
              )}
            </motion.figure>

            <motion.a
              id="video-propuesta"
              href={content.videoUrl}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeUp}
              transition={{ ...motionTransition, delay: shouldReduceMotion ? 0 : 0.08 }}
              className="group relative block overflow-hidden rounded-[6px] shadow-[0_24px_52px_rgba(36,41,31,0.14)] outline-none lg:col-span-3"
              aria-label={content.videoLabel}
            >
              <div className="aspect-video w-full bg-[var(--color-forest)]">
                <img
                  src={content.videoPoster}
                  alt="Video de la propuesta"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 bg-[linear-gradient(180deg,rgba(36,41,31,0.1),rgba(36,41,31,0.48))] transition duration-700 group-hover:bg-[rgba(36,41,31,0.18)]"
                  aria-hidden
                />
                <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center md:h-16 md:w-16">
                  <motion.span
                    className="relative flex h-full w-full items-center justify-center rounded-full bg-[#fff8e8]/94 text-[var(--color-forest)] shadow-[0_14px_32px_rgba(0,0,0,0.24)] transition-colors duration-500 group-hover:bg-white"
                    animate={shouldReduceMotion ? undefined : { scale: [1, 1.06, 1] }}
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.12 }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {!shouldReduceMotion && (
                      <motion.span
                        className="absolute inset-[-9px] rounded-full border border-[#fff8e8]/42"
                        animate={{ scale: [0.88, 1.18], opacity: [0.42, 0] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                        aria-hidden
                      />
                    )}
                    <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-7 w-7" aria-hidden>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </motion.span>
                </span>
                <p className="absolute bottom-4 left-4 right-4 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#fff8e8] drop-shadow-[0_4px_16px_rgba(0,0,0,0.45)]">
                  Video de la propuesta
                </p>
              </div>
            </motion.a>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.48 }}
              variants={fadeUp}
              transition={{ ...motionTransition, delay: shouldReduceMotion ? 0 : 0.16 }}
              className="grid content-end gap-5 lg:col-span-4"
            >
              {videoBeat && (
                <p className="font-editorial text-[clamp(1.04rem,1.28vw,1.24rem)] italic leading-[1.28] text-[var(--color-forest)]/82">
                  “{videoBeat.text}”
                </p>
              )}
              <a
                href={content.videoUrl}
                className="inline-flex w-fit items-center gap-3 border-b border-[var(--color-forest)]/40 pb-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-forest)] transition duration-300 hover:border-[var(--color-forest)] hover:text-[var(--color-forest)]/72 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-olive)]"
              >
                {content.videoLabel}
                <span aria-hidden>→</span>
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </section>
  );
}
