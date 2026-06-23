import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import SectionWrapper from "../SectionWrapper";
import type { StoryBeat, WeddingContent } from "../../types/wedding";

interface StorySectionProps {
  content: WeddingContent["story"];
}

interface StoryChapterRowProps {
  beat: StoryBeat;
  index: number;
  shouldReduceMotion: boolean;
}

function buildConnectorPath(totalChapters: number) {
  const lane = 1000;
  const startX = lane * 0.5;
  const leftX = lane * 0.20;
  const rightX = lane * 0.80;
  const step = 550; 
  const startY = 40; 
  const total = Math.max(totalChapters, 2);
  const maxY = startY + step * (total - 1);
  const tailEndY = maxY + step * 0.82;

  let currentX = startX;
  let currentY = startY;
  let d = `M ${currentX} ${currentY}`;

  for (let i = 0; i < total - 1; i += 1) {
    const isEven = i % 2 === 0;
    const nextX = isEven ? leftX : rightX;
    const nextY = startY + step * (i + 1);
    const cp1X = currentX;
    const cp1Y = currentY + step * 0.36;
    const cp2X = nextX;
    const cp2Y = nextY - step * 0.36;

    d += ` C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${nextX} ${nextY}`;
    currentX = nextX;
    currentY = nextY;
  }

  const tailCp1X = currentX;
  const tailCp1Y = currentY + step * 0.38;
  const tailCp2X = startX;
  const tailCp2Y = tailEndY - step * 0.24;
  const tailEndX = startX;

  d += ` C ${tailCp1X} ${tailCp1Y}, ${tailCp2X} ${tailCp2Y}, ${tailEndX} ${tailEndY}`;

  return { d, height: tailEndY + 100 };
}

function BirdIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 24" fill="none" className={className} aria-hidden>
      <path
        d="M2 18C8 8 16 7 24 16C32 7 40 8 46 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StoryTitleBirds({ shouldReduceMotion }: { shouldReduceMotion: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20" aria-hidden>
      <motion.span
        className="absolute -left-7 -top-7 block h-5 w-10 text-[var(--color-olive)]/72 md:-left-14 md:-top-9 md:h-7 md:w-14"
        animate={shouldReduceMotion ? undefined : { x: [0, 5, 0], y: [0, -4, 0], rotate: [-4, 1, -4] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <BirdIcon className="h-full w-full" />
      </motion.span>
      <motion.span
        className="absolute -right-5 -top-11 block h-4 w-8 text-[var(--color-terracotta)]/65 md:-right-12 md:-top-16 md:h-5 md:w-10"
        animate={shouldReduceMotion ? undefined : { x: [0, -6, 0], y: [0, -5, 0], rotate: [5, -1, 5] }}
        transition={{ duration: 5.1, delay: 0.45, repeat: Infinity, ease: "easeInOut" }}
      >
        <BirdIcon className="h-full w-full" />
      </motion.span>
      <motion.span
        className="absolute -right-9 top-5 block h-3 w-6 text-[var(--color-gold)] md:-right-20 md:top-8 md:h-4 md:w-8"
        animate={shouldReduceMotion ? undefined : { x: [0, 4, 0], y: [0, -3, 0], rotate: [-2, 4, -2] }}
        transition={{ duration: 3.8, delay: 0.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <BirdIcon className="h-full w-full" />
      </motion.span>
      <motion.span
        className="absolute -left-10 top-7 block h-3 w-6 text-[var(--color-terracotta)]/55 md:-left-24 md:top-10 md:h-4 md:w-8"
        animate={shouldReduceMotion ? undefined : { x: [0, 4, 0], y: [0, -3, 0], rotate: [3, -2, 3] }}
        transition={{ duration: 4.7, delay: 1.05, repeat: Infinity, ease: "easeInOut" }}
      >
        <BirdIcon className="h-full w-full" />
      </motion.span>
      <motion.span
        className="absolute right-5 -top-5 block h-2.5 w-5 text-[var(--color-olive)]/48 md:right-8 md:-top-8 md:h-3 md:w-6"
        animate={shouldReduceMotion ? undefined : { x: [0, -3, 0], y: [0, -2, 0], rotate: [-3, 2, -3] }}
        transition={{ duration: 3.9, delay: 1.3, repeat: Infinity, ease: "easeInOut" }}
      >
        <BirdIcon className="h-full w-full" />
      </motion.span>
    </div>
  );
}

function StoryChapterRow({ beat, index, shouldReduceMotion }: StoryChapterRowProps) {
  const articleRef = useRef<HTMLElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const slides = beat.images && beat.images.length > 0 ? beat.images : [{ src: beat.image, alt: beat.alt }];
  const hasMultipleSlides = slides.length > 1;
  const [activeSlide, setActiveSlide] = useState(0);
  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ["start 88%", "end 18%"],
  });
  const easedProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.55 });
  const imageY = useTransform(easedProgress, [0, 1], shouldReduceMotion ? [0, 0] : [36, -36]);
  const imageScale = useTransform(easedProgress, [0, 0.55, 1], shouldReduceMotion ? [1, 1, 1] : [1.08, 1.01, 1.04]);
  const imageOpacity = useTransform(easedProgress, [0, 0.16, 0.9, 1], [0.35, 1, 1, 0.72]);
  const copyY = useTransform(easedProgress, [0, 0.45], shouldReduceMotion ? [0, 0] : [28, 0]);
  const copyOpacity = useTransform(easedProgress, [0, 0.32], [0.18, 1]);

  const syncActiveSlide = useCallback(
    (target: HTMLDivElement) => {
      if (!hasMultipleSlides) return;
      const width = Math.max(target.clientWidth, 1);
      const rawIndex = target.scrollLeft / width;
      const nextIndex = Math.min(Math.max(Math.round(rawIndex), 0), slides.length - 1);
      setActiveSlide((previous) => (previous === nextIndex ? previous : nextIndex));
    },
    [hasMultipleSlides, slides.length],
  );

  const handleCarouselScroll = useCallback(() => {
    if (carouselRef.current) syncActiveSlide(carouselRef.current);
  }, [syncActiveSlide]);

  const scrollToSlide = useCallback(
    (slideIndex: number) => {
      if (!carouselRef.current) return;
      const width = carouselRef.current.clientWidth;
      carouselRef.current.scrollTo({
        left: width * slideIndex,
        behavior: shouldReduceMotion ? "auto" : "smooth",
      });
      setActiveSlide(slideIndex);
    },
    [shouldReduceMotion],
  );

  const handleCarouselKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!hasMultipleSlides) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollToSlide(Math.min(activeSlide + 1, slides.length - 1));
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollToSlide(Math.max(activeSlide - 1, 0));
      }
    },
    [activeSlide, hasMultipleSlides, scrollToSlide, slides.length],
  );

  const isEven = index % 2 === 1;
  const entryX = shouldReduceMotion ? 0 : isEven ? 50 : -50;

  return (
    <motion.article
      ref={articleRef}
      initial={{ opacity: 0, x: entryX, y: shouldReduceMotion ? 0 : 48 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.28, margin: "0px 0px -8% 0px" }}
      transition={{ duration: shouldReduceMotion ? 0 : 1.35, ease: [0.16, 1, 0.3, 1] }}
      className={`relative z-10 grid items-center gap-10 md:gap-20 lg:grid-cols-2 ${
        index === 0 ? "pt-8 md:pt-16" : "pt-28 md:pt-44"
      } ${isEven ? "lg:[&>*:first-child]:order-2" : ""}`}
    >
      <motion.figure
        className={`relative w-full ${isEven ? "lg:pl-12" : "lg:pr-12"}`}
        style={{ y: imageY, opacity: imageOpacity }}
      >
        <motion.div
          className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] shadow-[0_28px_70px_rgba(36,41,31,0.16)] md:aspect-[3/4]"
          initial={shouldReduceMotion ? false : { clipPath: "inset(18% 10% 18% 10%)" }}
          whileInView={shouldReduceMotion ? undefined : { clipPath: "inset(0% 0% 0% 0%)" }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            ref={carouselRef}
            className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-hide"
            onScroll={handleCarouselScroll}
            onKeyDown={handleCarouselKeyDown}
            tabIndex={hasMultipleSlides ? 0 : -1}
            style={{ scale: imageScale }}
          >
            {slides.map((slide, slideIndex) => (
              <div key={`${beat.title}-slide-${slideIndex}`} className="h-full w-full shrink-0 snap-center">
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </motion.div>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(36,41,31,0.02),rgba(36,41,31,0.18))]" />
        </motion.div>
        
        {hasMultipleSlides && (
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3 rounded-full bg-white/40 px-4 py-2 backdrop-blur-md">
            {slides.map((_, slideIndex) => (
              <button
                key={`${beat.title}-dot-${slideIndex}`}
                type="button"
                className={`h-1.5 rounded-full transition-all ${slideIndex === activeSlide ? "bg-white w-5" : "bg-white/70 w-1.5"}`}
                onClick={() => scrollToSlide(slideIndex)}
                aria-label={`Ir a la foto ${slideIndex + 1}`}
              />
            ))}
          </div>
        )}
      </motion.figure>

      <motion.div
        className={`flex flex-col justify-center px-4 md:px-0 ${isEven ? "lg:pr-16" : "lg:pl-16"}`}
        style={{ y: copyY, opacity: copyOpacity }}
      >
        <motion.h3
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1, delay: shouldReduceMotion ? 0 : 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] text-[var(--color-forest)]"
        >
          {beat.title}
        </motion.h3>
        
        <motion.p
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.9, delay: shouldReduceMotion ? 0 : 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="font-editorial mt-3 text-[1.25rem] leading-[1.25] italic text-[var(--color-terracotta)] md:text-[1.6rem]"
        >
          {beat.moment}
        </motion.p>

        <div className="mt-6 grid gap-3 md:mt-7 md:gap-4">
          {beat.text.split("\n").map((line, lineIndex) => (
            <motion.p
              key={`${beat.title}-${lineIndex}`}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.8,
                delay: shouldReduceMotion ? 0 : 0.22 + lineIndex * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-editorial text-[1.1rem] leading-[1.42] text-[var(--color-forest)]/80 md:text-[1.25rem]"
            >
              {line}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </motion.article>
  );
}

export default function StorySection({ content }: StorySectionProps) {
  const shouldReduceMotion = useReducedMotion() === true;
  const connector = buildConnectorPath(content.beats.length);
  const PLANE_PROGRESS_START = 0.0; 
  const PLANE_PROGRESS_END = 0.98;
  const PLANE_FIXED_ROTATION = 180;
  const PLANE_PATH_WIDTH = 1000;
  
  const chaptersRef = useRef<HTMLDivElement | null>(null);
  const connectorPathRef = useRef<SVGPathElement | null>(null);
  const planeRef = useRef<HTMLSpanElement | null>(null);
  const topResetRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLElement | null>(null);
  
  const topInView = useInView(topResetRef, { amount: 0.92 });
  const introInView = useInView(introRef, { once: true, amount: 0.35 });
  const { scrollY } = useScroll();
  
  // Starting the plane movement slightly earlier so it is active right away
  const { scrollYProgress: sectionProgress } = useScroll({
    target: chaptersRef,
    offset: ["start 78%", "end 86%"],
  });
  const smoothSectionProgress = useSpring(sectionProgress, { stiffness: 80, damping: 26, mass: 0.5 });
  const connectorPathLength = useTransform(smoothSectionProgress, [0, 1], [0.02, 1]);
  const connectorOpacity = useTransform(smoothSectionProgress, [0, 0.08, 0.92, 1], [0.18, 1, 1, 0.38]);
  
  const scrollDirectionRef = useRef<"up" | "down">("down");
  const hasResetAtCurrentTopRef = useRef(false);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const [resetNonce, setResetNonce] = useState(0);

  const positionPlaneOnPath = useCallback(
    (rawProgress: number) => {
      const path = connectorPathRef.current;
      const plane = planeRef.current;

      if (!path || !plane) return;

      const progress = Math.min(Math.max(rawProgress, 0), 1);
      const normalizedProgress =
        progress <= PLANE_PROGRESS_START
          ? 0
          : progress >= PLANE_PROGRESS_END
            ? 1
            : (progress - PLANE_PROGRESS_START) / (PLANE_PROGRESS_END - PLANE_PROGRESS_START);
      
      const totalLength = path.getTotalLength();
      const distance = totalLength * normalizedProgress;
      const point = path.getPointAtLength(distance);
      const xPercent = (point.x / PLANE_PATH_WIDTH) * 100;
      const yPercent = (point.y / connector.height) * 100;

      plane.style.left = `${xPercent}%`;
      plane.style.top = `${yPercent}%`;
      plane.style.transform = `translate(-50%, -50%) rotate(${PLANE_FIXED_ROTATION}deg)`;
      plane.style.opacity = shouldReduceMotion ? "0.92" : "1";
    },
    [connector.height, shouldReduceMotion],
  );

  useMotionValueEvent(smoothSectionProgress, "change", (latest) => {
    if (shouldReduceMotion) return;
    positionPlaneOnPath(latest);
  });

  useEffect(() => {
    positionPlaneOnPath(shouldReduceMotion ? 0.02 : 0);
  }, [positionPlaneOnPath, shouldReduceMotion, connector.d]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > 4 && !hasUserScrolled) {
      setHasUserScrolled(true);
    }
    if (previous === undefined || latest === previous) return;
    const nextDirection = latest < previous ? "up" : "down";
    if (nextDirection !== scrollDirectionRef.current) {
      scrollDirectionRef.current = nextDirection;
    }
  });

  useEffect(() => {
    if (!topInView) {
      hasResetAtCurrentTopRef.current = false;
      return;
    }
    // Incrementing resetNonce resets the animations when scrolling back to the very top!
    if (scrollDirectionRef.current === "up" && !hasResetAtCurrentTopRef.current) {
      setResetNonce((value) => value + 1);
      hasResetAtCurrentTopRef.current = true;
    }
  }, [topInView]);

  return (
    <SectionWrapper
    
      id="nuestra-historia"
      className="bg-[var(--color-ivory)] pb-32 pt-24 md:pb-48 md:pt-32"
      contentClassName="relative max-w-none px-0"
      hideDivider
      animateContent={false}
    >
      <div ref={topResetRef} className="absolute top-0 h-10 w-full" aria-hidden />

      <div className="mx-auto max-w-[1100px] px-4 md:px-8">
        
        <motion.header
          ref={introRef}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={hasUserScrolled && introInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          className="relative z-10 text-center"
        >
          <div className="relative mx-auto w-fit px-5 py-4 md:px-12 md:py-5">
            <StoryTitleBirds shouldReduceMotion={shouldReduceMotion} />
            <h2 className="font-heading relative z-10 text-[clamp(3.2rem,7vw,6.2rem)] font-medium italic leading-[0.88] tracking-normal text-[var(--color-forest)] drop-shadow-[0_16px_38px_rgba(36,41,31,0.16)]">
              Nuestra historia
            </h2>
          </div>
          <p className="font-editorial mx-auto mt-4 max-w-3xl text-[clamp(1.08rem,2vw,1.45rem)] leading-[1.34] italic text-[var(--color-terracotta)]">
            {content.intro}
          </p>
        </motion.header>

        <div ref={chaptersRef} className="relative mt-12 md:mt-16">
          <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
            <svg
              viewBox={`0 0 1000 ${connector.height}`}
              preserveAspectRatio="none"
              className="absolute left-1/2 top-0 h-full w-full min-w-[700px] -translate-x-1/2 text-[var(--color-olive)]/35"
            >
              <motion.path
                ref={connectorPathRef}
                d={connector.d}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="6 8"
                style={{
                  pathLength: shouldReduceMotion ? 1 : connectorPathLength,
                  opacity: shouldReduceMotion ? 1 : connectorOpacity,
                }}
              />
            </svg>
            <div className="absolute inset-0 left-1/2 w-full min-w-[700px] -translate-x-1/2">
              <span
                ref={planeRef}
                className="story-connector-plane-symbol absolute text-[1.8rem] text-[var(--color-terracotta)] drop-shadow-md"
                style={{ willChange: "transform, top, left" }}
              >
                flight
              </span>
            </div>
          </div>

          {content.beats.map((beat, index) => (
            <StoryChapterRow
              key={`${beat.title}-${resetNonce}`}
              beat={beat}
              index={index}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
