import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { Fragment, useCallback, useEffect, useRef } from "react";
import SectionWrapper from "../SectionWrapper";
import PawPrintDivider from "../PawPrintDivider";
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

function BotanicalSprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 130 220" className={className} aria-hidden>
      <path
        d="M66 208C67 188 69 150 70 114C71 78 70 40 76 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M70 128C53 123 38 111 30 93C45 95 60 103 70 118"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M70 98C49 90 35 77 24 58C44 60 59 72 70 89"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M70 150C86 145 97 133 106 116C91 119 80 127 70 140"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M72 121C92 114 108 101 118 84C99 86 84 96 72 112"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function MilkaSection({ content }: MilkaSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const shellRef = useRef<HTMLDivElement | null>(null);
  const pawPathRef = useRef<SVGPathElement | null>(null);
  const pawMarkerRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const { scrollYProgress } = useScroll({
    target: shellRef,
    offset: ["start 80%", "end 34%"],
  });
  const photoAngles = ["lg:-rotate-[2.6deg]", "lg:rotate-[2.2deg]", "lg:-rotate-[1.6deg]"];
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

  return (
    <SectionWrapper
      id="milka"
      eyebrow="Capítulo 03"
      title="Y entonces llegó Milka"
      intro={content.intro}
      className="bg-[var(--color-ivory)]"
      contentClassName="relative"
    >
      <div
        ref={shellRef}
        className="milka-section-shell paper-surface--soft relative overflow-hidden rounded-[10px] px-5 py-8 pr-12 sm:pr-14 md:px-8 md:py-10 md:pr-16 lg:pr-20"
      >
        <BotanicalSprig className="milka-sprig milka-sprig--left" />
        <BotanicalSprig className="milka-sprig milka-sprig--right" />

        <PawPrintDivider />

        <motion.div
          className="milka-paw-walk pointer-events-none absolute inset-y-8 right-1 z-[1] block md:inset-y-10 md:right-2 lg:right-4"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.75 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.85 }}
          aria-hidden
        >
          <svg viewBox={`0 0 ${PAW_TRACK_WIDTH} ${PAW_TRACK_HEIGHT}`} className="milka-paw-walk-line" aria-hidden>
            <path
              ref={pawPathRef}
              d="M112 24C62 118 160 196 102 312C46 428 166 512 98 630C48 720 122 812 114 916"
              className="milka-paw-walk-path"
            />
          </svg>

          {Array.from({ length: PAW_PAIR_COUNT }).map((_, pairIndex) => (
            <Fragment key={`paw-pair-${pairIndex}`}>
              <span
                ref={(node) => {
                  pawMarkerRefs.current[pairIndex * 2] = node;
                }}
                className="milka-paw-marker milka-paw-marker--left"
              >
                <PawIcon className="h-full w-full" />
              </span>
              <span
                ref={(node) => {
                  pawMarkerRefs.current[pairIndex * 2 + 1] = node;
                }}
                className="milka-paw-marker milka-paw-marker--right milka-paw-marker--small"
              >
                <PawIcon className="h-full w-full" />
              </span>
            </Fragment>
          ))}
        </motion.div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-8">
          <div className="milka-copy-stack">
            {content.paragraphs.map((paragraph, index) => (
              <motion.p
                key={`milka-line-${index}`}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.9, delay: shouldReduceMotion ? 0 : index * 0.09 }}
                className={`section-caption text-[var(--color-forest)]/88 ${
                  index === 1 ? "font-heading text-[2.1rem] leading-[0.9] md:text-[2.7rem]" : ""
                }`}
              >
                {paragraph}
              </motion.p>
            ))}

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.65 }}
              transition={{ duration: shouldReduceMotion ? 0 : 1.15, delay: shouldReduceMotion ? 0 : 0.28 }}
              className="milka-quote mt-2"
            >
              {content.quote}
            </motion.p>
          </div>

          <div className="milka-visual-stack">
            <div className="milka-photo-grid">
              {content.photos.map((photo, index) => (
                <motion.figure
                  key={photo.caption}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.45 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.95, delay: shouldReduceMotion ? 0 : index * 0.12 }}
                  className={`paper-surface milka-polaroid ${index === 2 ? "milka-polaroid--wide" : ""} ${
                    photoAngles[index] ?? ""
                  }`}
                >
                  <div className={`overflow-hidden rounded-[6px] ${index === 2 ? "aspect-[16/11]" : "aspect-[4/5]"}`}>
                    <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <figcaption className="milka-photo-caption">{photo.caption}</figcaption>
                </motion.figure>
              ))}
            </div>

            <motion.aside
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: shouldReduceMotion ? 0 : 1, delay: shouldReduceMotion ? 0 : 0.2 }}
              className="paper-surface milka-note-card"
            >
              {content.note.map((line, index) => (
                <p
                  key={`milka-note-${index}`}
                  className={`${
                    index === 0
                      ? "font-heading text-2xl"
                      : index === content.note.length - 1
                        ? "font-script text-3xl"
                        : "section-caption text-[var(--color-forest)]/84"
                  }`}
                >
                  {line}
                </p>
              ))}
            </motion.aside>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
