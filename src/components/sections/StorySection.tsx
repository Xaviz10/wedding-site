import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
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

function getChapter(index: number) {
  return `Capítulo ${String(index + 1).padStart(2, "0")}`;
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

function StoryChapterRow({ beat, index, shouldReduceMotion }: StoryChapterRowProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const slides = beat.images && beat.images.length > 0 ? beat.images : [{ src: beat.image, alt: beat.alt }];
  const hasMultipleSlides = slides.length > 1;
  const [activeSlide, setActiveSlide] = useState(0);

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
      initial={{ opacity: 0, x: entryX, y: shouldReduceMotion ? 0 : 30 }}
      // "amount: some" with a large bottom margin triggers the animation long before the user scrolls to it!
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: "some", margin: "0px 0px 400px 0px" }} 
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className={`relative z-10 grid items-center gap-10 md:gap-20 lg:grid-cols-2 ${
        index === 0 ? "pt-4 md:pt-10" : "pt-24 md:pt-36"
      } ${isEven ? "lg:[&>*:first-child]:order-2" : ""}`}
    >
      <figure className={`relative w-full ${isEven ? "lg:pl-12" : "lg:pr-12"}`}>
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] shadow-[0_20px_50px_rgba(36,41,31,0.12)] md:aspect-[3/4]">
          <div
            ref={carouselRef}
            className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-hide"
            onScroll={handleCarouselScroll}
            onKeyDown={handleCarouselKeyDown}
            tabIndex={hasMultipleSlides ? 0 : -1}
          >
            {slides.map((slide, slideIndex) => (
              <div key={`${beat.title}-slide-${slideIndex}`} className="h-full w-full shrink-0 snap-center">
                <img src={slide.src} alt={slide.alt} className="h-full w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
        
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
      </figure>

      <div className={`flex flex-col justify-center px-4 md:px-0 ${isEven ? "lg:pr-16" : "lg:pl-16"}`}>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[var(--color-olive)]">
          {getChapter(index)}
        </p>
        
        <h3 className="font-heading mt-6 text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] text-[var(--color-forest)]">
          {beat.title}
        </h3>
        
        <p className="font-editorial mt-3 text-[1.5rem] italic text-[var(--color-terracotta)] md:text-[2rem]">
          {beat.moment}
        </p>

        <div className="mt-8 grid gap-5">
          {beat.text.split("\n").map((line, lineIndex) => (
            <p key={`${beat.title}-${lineIndex}`} className="font-editorial text-[1.3rem] leading-relaxed text-[var(--color-forest)]/80 md:text-[1.5rem]">
              {line}
            </p>
          ))}
        </div>
      </div>
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
    offset: ["start 70%", "end 90%"],
  });
  
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

  useMotionValueEvent(sectionProgress, "change", (latest) => {
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
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[var(--color-olive)]">
            Capítulo 01
          </p>
          <h2 className="font-heading mt-6 text-[clamp(4rem,9vw,6.5rem)] leading-[0.9] text-[var(--color-forest)]">
            Nuestra historia
          </h2>
          <p className="font-editorial mt-5 text-[clamp(2.5rem,5vw,3.5rem)] italic text-[var(--color-terracotta)]">
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
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                // Looks 500px down below the screen to start the dashed line early!
                viewport={{ once: true, amount: "some", margin: "0px 0px 500px 0px" }} 
                transition={{ duration: shouldReduceMotion ? 0 : 2, ease: [0.22, 1, 0.36, 1] }}
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
