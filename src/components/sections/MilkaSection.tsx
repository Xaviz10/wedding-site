import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Fragment, useCallback, useEffect, useRef } from "react";
import SectionWrapper from "../SectionWrapper";
import type { MilkaPhoto, WeddingContent } from "../../types/wedding";

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

interface MilkaPhotoFrameProps {
  photo: MilkaPhoto;
  className?: string;
  imageClassName?: string;
  captionAlign?: "left" | "right";
  shouldReduceMotion: boolean;
}

function MilkaPhotoFrame({
  photo,
  className,
  imageClassName = "aspect-[4/5]",
  captionAlign = "left",
  shouldReduceMotion,
}: MilkaPhotoFrameProps) {
  const frameRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start 86%", "end 20%"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 86, damping: 28, mass: 0.55 });
  const y = useTransform(smoothProgress, [0, 1], shouldReduceMotion ? [0, 0] : [34, -26]);
  const scale = useTransform(smoothProgress, [0, 0.52, 1], shouldReduceMotion ? [1, 1, 1] : [1.08, 1.01, 1.04]);
  const opacity = useTransform(smoothProgress, [0, 0.18, 0.88, 1], [0.28, 1, 1, 0.78]);

  return (
    <motion.figure ref={frameRef} className={className} style={{ y, opacity }}>
      <motion.div
        className={`relative w-full overflow-hidden rounded-[4px] shadow-[0_28px_70px_rgba(36,41,31,0.14)] ${imageClassName}`}
        initial={shouldReduceMotion ? false : { clipPath: "inset(14% 10% 14% 10%)" }}
        whileInView={shouldReduceMotion ? undefined : { clipPath: "inset(0% 0% 0% 0%)" }}
        viewport={{ once: true, amount: 0.42 }}
        transition={{ duration: 1.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img
          src={photo.src}
          alt={photo.alt}
          className="h-full w-full object-cover"
          loading="lazy"
          style={{ scale }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(36,41,31,0.02),rgba(36,41,31,0.16))]" />
      </motion.div>
      <figcaption
        className={`mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-olive)] ${
          captionAlign === "right" ? "text-right" : ""
        }`}
      >
        {photo.caption}
      </figcaption>
    </motion.figure>
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
  const smoothSectionProgress = useSpring(scrollYProgress, { stiffness: 76, damping: 28, mass: 0.6 });
  const headerY = useTransform(smoothSectionProgress, [0, 0.32], shouldReduceMotion ? [0, 0] : [34, 0]);
  const headerOpacity = useTransform(smoothSectionProgress, [0, 0.18], [0.2, 1]);
  const pawTrackOpacity = useTransform(smoothSectionProgress, [0, 0.12, 0.88, 1], [0, 1, 1, 0.18]);
  
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

  useMotionValueEvent(smoothSectionProgress, "change", (latest) => {
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
        
        <motion.div
          className="pointer-events-none absolute bottom-0 right-0 top-0 z-0 w-[120px] text-[var(--color-olive)]/20 md:w-[220px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.5 }}
          style={{ opacity: shouldReduceMotion ? 1 : pawTrackOpacity }}
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

        <div className="relative z-10">
          <div className="grid items-end gap-14 lg:grid-cols-12 lg:gap-12">
            <motion.header
              className="lg:col-span-6 lg:pb-10"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.32 }}
              transition={{ duration: shouldReduceMotion ? 0 : 1.15, ease: [0.16, 1, 0.3, 1] }}
              style={{ y: headerY, opacity: headerOpacity }}
            >
              <h2 className="font-heading text-[clamp(3rem,7vw,5.35rem)] leading-[0.9] text-[var(--color-forest)]">
                Y entonces llegó Milka
              </h2>
              <p className="font-editorial mt-7 max-w-2xl text-[clamp(1.8rem,4vw,2.75rem)] leading-[1.12] italic text-[var(--color-terracotta)]">
                {content.intro}
              </p>
            </motion.header>

            <MilkaPhotoFrame
              photo={portraitPhoto}
              shouldReduceMotion={shouldReduceMotion === true}
              captionAlign="right"
              className="lg:col-span-5 lg:col-start-8"
              imageClassName="aspect-[4/5] md:aspect-[3/4]"
            />
          </div>

          <div className="mt-20 grid items-start gap-14 md:mt-32 lg:grid-cols-12 lg:gap-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.28 }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: shouldReduceMotion ? 0 : 0.1,
                  },
                },
              }}
              className="grid gap-7 lg:col-span-5 lg:col-start-2"
            >
              {content.paragraphs.map((paragraph, index) => (
                <motion.p
                  key={`milka-line-${index}`}
                  variants={{
                    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 22 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className={`font-editorial text-[var(--color-forest)]/85 ${
                    index === 1
                      ? "text-[1.65rem] leading-[1.1] italic text-[var(--color-terracotta)] md:text-[2.15rem]"
                      : "text-[1.15rem] leading-[1.42] md:text-2xl"
                  }`}
                >
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>

            <MilkaPhotoFrame
              photo={squarePhoto}
              shouldReduceMotion={shouldReduceMotion === true}
              className="lg:col-span-4 lg:col-start-8 lg:mt-20"
              imageClassName="aspect-square"
            />
          </div>

          <div className="mt-20 grid items-end gap-16 md:mt-32 lg:grid-cols-12">
            <MilkaPhotoFrame
              photo={landscapePhoto}
              shouldReduceMotion={shouldReduceMotion === true}
              className="lg:col-span-7 lg:col-start-1"
              imageClassName="aspect-[16/10]"
            />

              <motion.aside
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 26, rotate: shouldReduceMotion ? 0 : -1.5 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.48 }}
                transition={{ duration: shouldReduceMotion ? 0 : 1.15, ease: [0.16, 1, 0.3, 1] }}
                className="relative mx-auto max-w-lg rounded-[4px] bg-[var(--color-ivory)] px-6 py-8 text-center shadow-[0_24px_58px_rgba(36,41,31,0.12)] lg:col-span-4 lg:col-start-9 lg:mb-12"
              >
                <span className="absolute left-1/2 top-0 h-8 w-28 -translate-x-1/2 -translate-y-1/2 rotate-[-2deg] bg-[rgba(203,194,173,0.55)] shadow-[0_8px_18px_rgba(36,41,31,0.08)]" aria-hidden />
                {content.note.map((line, index) => (
                  <motion.p
                    key={`milka-note-${index}`}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.65 }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.72,
                      delay: shouldReduceMotion ? 0 : index * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`mt-4 ${
                      index === 0
                        ? "font-heading text-[2rem] text-[var(--color-forest)] md:text-[2.25rem]"
                        : index === content.note.length - 1
                          ? "font-editorial mt-8 text-3xl leading-[1.22] italic text-[var(--color-terracotta)]"
                        : "font-editorial text-xl leading-[1.38] text-[var(--color-forest)]/80"
                    }`}
                  >
                    {line}
                  </motion.p>
                ))}
              </motion.aside>
          </div>

        </div>
      </div>
    </SectionWrapper>
  );
}
