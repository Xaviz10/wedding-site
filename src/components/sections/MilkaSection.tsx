import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { Fragment, useCallback, useEffect, useRef } from "react";
import SectionWrapper from "../SectionWrapper";
import type { WeddingContent } from "../../types/wedding";

interface MilkaSectionProps {
  content: WeddingContent["milka"];
}

const PAW_TRACK_WIDTH = 220;
const PAW_TRACK_HEIGHT = 940;
const PAW_PAIR_COUNT = 6;
const PAW_PAIR_SPACING = 0.145;
const PAW_SIDE_OFFSET = 11;
const PAW_STRIDE_OFFSET = 8;

function PawIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 44" className={className} aria-hidden>
      <ellipse cx="22" cy="28" rx="9.5" ry="8.5" fill="currentColor" />
      <circle cx="12" cy="17" r="4.1" fill="currentColor" />
      <circle cx="20" cy="12" r="3.8" fill="currentColor" />
      <circle cx="29" cy="12.8" r="3.8" fill="currentColor" />
      <circle cx="35" cy="19.3" r="4.2" fill="currentColor" />
    </svg>
  );
}

export default function MilkaSection({ content }: MilkaSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const pawPathRef = useRef<SVGPathElement | null>(null);
  const pawMarkerRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 34%"],
  });
  
  const PAW_ROTATION_OFFSET = 86;

  const positionPawsOnPath = useCallback((rawProgress: number) => {
    const path = pawPathRef.current;

    if (!path) {
      return;
    }

    const totalLength = path.getTotalLength();
    for (let pairIndex = 0; pairIndex < PAW_PAIR_COUNT; pairIndex += 1) {
      const pairProgress = Math.min(Math.max(rawProgress - pairIndex * PAW_PAIR_SPACING, 0), 1);
      const leftMarker = pawMarkerRefs.current[pairIndex * 2];
      const rightMarker = pawMarkerRefs.current[pairIndex * 2 + 1];

      if (!leftMarker || !rightMarker) {
        continue;
      }

      if (pairProgress <= 0.001) {
        leftMarker.style.opacity = "0";
        rightMarker.style.opacity = "0";
        continue;
      }

      const pairDistance = totalLength * pairProgress;
      const tangentStart = path.getPointAtLength(Math.max(pairDistance - 4, 0));
      const tangentEnd = path.getPointAtLength(Math.min(pairDistance + 4, totalLength));
      const dx = tangentEnd.x - tangentStart.x;
      const dy = tangentEnd.y - tangentStart.y;
      const tangentLength = Math.hypot(dx, dy) || 1;
      const tx = dx / tangentLength;
      const ty = dy / tangentLength;
      const nx = -ty;
      const ny = tx;

      const fadeIn = Math.min(pairProgress / 0.14, 1);
      const fadeOut = Math.min((1 - pairProgress) / 0.2, 1);
      const pairOpacity = Math.max(0, Math.min(fadeIn, fadeOut));

      [leftMarker, rightMarker].forEach((marker, sideIndex) => {
        const sideSign = sideIndex === 0 ? 1 : -1;
        const strideSign = sideIndex === 0 ? 1 : -1;
        const x = tangentEnd.x + nx * sideSign * PAW_SIDE_OFFSET + tx * strideSign * PAW_STRIDE_OFFSET;
        const y = tangentEnd.y + ny * sideSign * PAW_SIDE_OFFSET + ty * strideSign * PAW_STRIDE_OFFSET;
        const xPercent = (x / PAW_TRACK_WIDTH) * 100;
        const yPercent = (y / PAW_TRACK_HEIGHT) * 100;
        const angle = (Math.atan2(ty, tx) * 180) / Math.PI;
        const opacityMultiplier = sideIndex === 0 ? 1 : 0.88;

        marker.style.left = `${xPercent}%`;
        marker.style.top = `${yPercent}%`;
        marker.style.transform = `translate(-50%, -50%) rotate(${angle + PAW_ROTATION_OFFSET}deg)`;
        marker.style.opacity = `${pairOpacity * opacityMultiplier}`;
      });
    }
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    positionPawsOnPath(shouldReduceMotion ? 0.8 : latest);
  });

  useEffect(() => {
    positionPawsOnPath(shouldReduceMotion ? 0.78 : 0.02);
  }, [positionPawsOnPath, shouldReduceMotion]);

  // Extract photos for the editorial layout
  const portraitPhoto = content.photos[0];
  const squarePhoto = content.photos[1];
  const landscapePhoto = content.photos[2] || content.photos[0];

  return (
    <SectionWrapper
      id="milka"
      className="bg-[var(--color-surface)] pb-24 pt-24 md:pb-40 md:pt-40"
      contentClassName="relative max-w-none px-0"
      hideDivider
    >
      <div ref={sectionRef} className="relative mx-auto max-w-[1200px] px-4 md:px-8">
        
        {/* Animated Background Paw Track - Stretches down the right side */}
        <motion.div
          className="pointer-events-none absolute bottom-0 right-0 top-0 z-0 w-[120px] text-[var(--color-olive)]/20 md:w-[220px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.5 }}
          aria-hidden
        >
          <svg viewBox={`0 0 ${PAW_TRACK_WIDTH} ${PAW_TRACK_HEIGHT}`} preserveAspectRatio="none" className="h-full w-full" aria-hidden>
            <path
              ref={pawPathRef}
              d="M112 24C62 118 160 196 102 312C46 428 166 512 98 630C48 720 122 812 114 916"
              fill="none"
            />
          </svg>

          {Array.from({ length: PAW_PAIR_COUNT }).map((_, pairIndex) => (
            <Fragment key={`paw-pair-${pairIndex}`}>
              <span
                ref={(node) => {
                  pawMarkerRefs.current[pairIndex * 2] = node;
                }}
                className="absolute w-[18%] text-current transition-opacity duration-300 will-change-transform"
              >
                <PawIcon className="h-full w-full" />
              </span>
              <span
                ref={(node) => {
                  pawMarkerRefs.current[pairIndex * 2 + 1] = node;
                }}
                className="absolute w-[14%] text-current transition-opacity duration-300 will-change-transform"
              >
                <PawIcon className="h-full w-full" />
              </span>
            </Fragment>
          ))}
        </motion.div>

        {/* Editorial Content - Sits on top of paw tracks */}
        <div className="relative z-10">
          
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: shouldReduceMotion ? 0 : 1.2 }}
          >
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[var(--color-olive)]">
              Capítulo 03
            </p>
            <h2 className="font-heading mt-6 text-[clamp(3rem,7vw,4.75rem)] leading-[0.95] text-[var(--color-forest)]">
              Y entonces llegó Milka
            </h2>
            <p className="font-editorial mt-6 text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.18] italic text-[var(--color-terracotta)]">
              {content.intro}
            </p>
          </motion.header>

          {/* Grid 1: Text & Portrait Photo */}
          <div className="mt-20 grid items-center gap-16 md:mt-32 lg:grid-cols-12">
            <motion.div 
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: shouldReduceMotion ? 0 : 1.2 }}
              className="grid gap-10 lg:col-span-5 lg:col-start-1"
            >
              {content.paragraphs.map((paragraph, index) => (
                <p 
                  key={`milka-line-${index}`} 
                  className={`font-editorial text-[var(--color-forest)]/85 ${index === 1 ? "text-2xl leading-[1.28] italic text-[var(--color-terracotta)] md:text-[1.7rem]" : "text-[1.15rem] leading-[1.42] md:text-2xl"}`}
                >
                  {paragraph}
                </p>
              ))}
            </motion.div>

            <motion.figure 
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: shouldReduceMotion ? 0 : 1.2 }}
              className="lg:col-span-6 lg:col-start-7"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[8px] shadow-[0_24px_54px_rgba(36,41,31,0.08)]">
                <img src={portraitPhoto.src} alt={portraitPhoto.alt} className="h-full w-full object-cover transition-transform duration-[2s] hover:scale-105" loading="lazy" />
              </div>
              <figcaption className="mt-5 text-right text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-olive)]">
                {portraitPhoto.caption}
              </figcaption>
            </motion.figure>
          </div>

          {/* Massive Quote Highlight */}
          <motion.div 
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: shouldReduceMotion ? 0 : 1.5 }}
            className="mx-auto mt-32 max-w-4xl text-center md:mt-48"
          >
            <h3 className="font-heading text-[clamp(2.5rem,6vw,4.25rem)] leading-[0.98] text-[var(--color-forest)]">
              "{content.quote}"
            </h3>
          </motion.div>

          {/* Grid 2: Square Photo, Landscape Photo & Note */}
          <div className="mt-32 grid items-end gap-16 md:mt-48 lg:grid-cols-12">
            <motion.figure 
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: shouldReduceMotion ? 0 : 1.2 }}
              className="lg:col-span-4 lg:col-start-1"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-[8px] shadow-[0_24px_40px_rgba(36,41,31,0.08)]">
                <img src={squarePhoto.src} alt={squarePhoto.alt} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <figcaption className="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-olive)]">
                {squarePhoto.caption}
              </figcaption>
            </motion.figure>

            <div className="grid gap-20 lg:col-span-7 lg:col-start-6">
              <motion.figure 
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: shouldReduceMotion ? 0 : 1.2 }}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[8px] shadow-[0_32px_64px_rgba(36,41,31,0.12)]">
                  <img src={landscapePhoto.src} alt={landscapePhoto.alt} className="h-full w-full object-cover transition-transform duration-[3s] hover:scale-105" loading="lazy" />
                </div>
                <figcaption className="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-olive)]">
                  {landscapePhoto.caption}
                </figcaption>
              </motion.figure>

              <motion.aside
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: shouldReduceMotion ? 0 : 1.2 }}
                className="mx-auto max-w-lg text-center"
              >
                {content.note.map((line, index) => (
                  <p
                    key={`milka-note-${index}`}
                    className={`mt-4 ${
                      index === 0
                        ? "font-heading text-[2rem] text-[var(--color-forest)] md:text-[2.25rem]"
                        : index === content.note.length - 1
                          ? "font-editorial mt-8 text-3xl leading-[1.22] italic text-[var(--color-terracotta)]"
                          : "font-editorial text-xl leading-[1.38] text-[var(--color-forest)]/80"
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </motion.aside>
            </div>
          </div>

        </div>
      </div>
    </SectionWrapper>
  );
}
