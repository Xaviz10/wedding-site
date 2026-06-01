import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
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
  resetNonce: number;
  scrollDirection: "up" | "down";
}

const cardAngles = [-3.2, 2.6, -2.1, 1.8];

const frameClasses: Record<StoryBeat["frame"], { shell: string; media: string }> = {
  instant: {
    shell: "p-3 pb-7",
    media: "aspect-[4/5]",
  },
  polaroid: {
    shell: "p-3 pb-9",
    media: "aspect-[4/5]",
  },
  postcard: {
    shell: "p-2.5",
    media: "aspect-[16/10]",
  },
};

function getChapter(index: number) {
  return `Capítulo ${String(index + 1).padStart(2, "0")}`;
}

function buildConnectorPath(totalChapters: number) {
  const lane = 1000;
  const startX = lane * 0.5;
  const leftX = lane * 0.22;
  const rightX = lane * 0.78;
  const step = 320;
  const startY = 60;
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

  return { d, height: tailEndY + 80 };
}

function StoryChapterRow({ beat, index, shouldReduceMotion, resetNonce, scrollDirection }: StoryChapterRowProps) {
  const rowRef = useRef<HTMLElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const isEnoughInView = useInView(rowRef, {
    amount: "all",
    margin: "0px",
  });
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start 94%", "start 42%"],
  });
  const [isRevealed, setIsRevealed] = useState(false);
  const slides = beat.images && beat.images.length > 0 ? beat.images : [{ src: beat.image, alt: beat.alt }];
  const hasMultipleSlides = slides.length > 1;
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (isEnoughInView && scrollDirection === "down") {
      setIsRevealed(true);
    }
  }, [isEnoughInView, scrollDirection]);

  useEffect(() => {
    setIsRevealed(false);
  }, [resetNonce]);

  const syncActiveSlide = useCallback(
    (target: HTMLDivElement) => {
      if (!hasMultipleSlides) {
        return;
      }

      const width = Math.max(target.clientWidth, 1);
      const rawIndex = target.scrollLeft / width;
      const nextIndex = Math.min(Math.max(Math.round(rawIndex), 0), slides.length - 1);

      setActiveSlide((previous) => (previous === nextIndex ? previous : nextIndex));
    },
    [hasMultipleSlides, slides.length],
  );

  const handleCarouselScroll = useCallback(() => {
    if (!carouselRef.current) {
      return;
    }

    syncActiveSlide(carouselRef.current);
  }, [syncActiveSlide]);

  const scrollToSlide = useCallback(
    (slideIndex: number) => {
      if (!carouselRef.current) {
        return;
      }

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
      if (!hasMultipleSlides) {
        return;
      }

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

  const angle = shouldReduceMotion ? 0 : cardAngles[index % cardAngles.length];
  const frame = frameClasses[beat.frame];
  const isEven = index % 2 === 1;
  const entryX = shouldReduceMotion ? 0 : isEven ? 84 : -84;
  const opacityIn = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [1, 1] : [0, 1]);
  const xIn = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [entryX, 0]);

  return (
    <motion.article
      ref={rowRef}
      style={isRevealed ? { opacity: 1, x: 0 } : { opacity: opacityIn, x: xIn }}
      className={`story-chapter-row lg:max-w-[860px] ${isEven ? "lg:ml-auto" : "lg:mr-auto"}`}
    >
      <figure className={`story-photo ${frame.shell} ${isEven ? "lg:order-2" : ""}`} style={{ rotate: `${angle}deg` }}>
        <div className={`story-photo-frame ${frame.media}`}>
          <div
            ref={carouselRef}
            className="story-photo-carousel"
            onScroll={handleCarouselScroll}
            onKeyDown={handleCarouselKeyDown}
            tabIndex={hasMultipleSlides ? 0 : -1}
            aria-label={`Galería ${beat.title}`}
          >
            {slides.map((slide, slideIndex) => (
              <div key={`${beat.title}-slide-${slideIndex}`} className="story-photo-slide">
                <img src={slide.src} alt={slide.alt} className="h-full w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
        {hasMultipleSlides ? (
          <div className="story-photo-dots">
            {slides.map((_, slideIndex) => (
              <button
                key={`${beat.title}-dot-${slideIndex}`}
                type="button"
                className={`story-photo-dot ${slideIndex === activeSlide ? "is-active" : ""}`}
                onClick={() => scrollToSlide(slideIndex)}
                aria-label={`Ir a la foto ${slideIndex + 1}`}
                aria-pressed={slideIndex === activeSlide}
              />
            ))}
          </div>
        ) : null}
        <figcaption className="story-photo-caption">{beat.moment}</figcaption>
      </figure>

      <div className={`story-copy-block ${isEven ? "lg:order-1" : ""}`}>
        <p className="story-chapter-tag">{getChapter(index)}</p>
        <h3 className="font-heading text-[clamp(2rem,3.5vw,3rem)] leading-[0.95] text-[var(--color-forest)]">
          {beat.title}
        </h3>
        <div className="story-copy-text">
          {beat.text.split("\n").map((line, lineIndex) => (
            <p key={`${beat.title}-${lineIndex}`}>{line}</p>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function StorySection({ content }: StorySectionProps) {
  const shouldReduceMotion = useReducedMotion() === true;
  const connector = buildConnectorPath(content.beats.length);
  const PLANE_PROGRESS_START = 0.1;
  const PLANE_PROGRESS_END = 1;
  const PLANE_FIXED_ROTATION = 180;
  const PLANE_PATH_WIDTH = 1000;
  const chaptersRef = useRef<HTMLDivElement | null>(null);
  const connectorPathRef = useRef<SVGPathElement | null>(null);
  const planeRef = useRef<HTMLSpanElement | null>(null);
  const topResetRef = useRef<HTMLDivElement | null>(null);
  const topInView = useInView(topResetRef, { amount: 0.92 });
  const { scrollY } = useScroll();
  const { scrollYProgress: sectionProgress } = useScroll({
    target: chaptersRef,
    offset: ["start end", "end end"],
  });
  const scrollDirectionRef = useRef<"up" | "down">("down");
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const hasResetAtCurrentTopRef = useRef(false);
  const [resetNonce, setResetNonce] = useState(0);

  const positionPlaneOnPath = useCallback(
    (rawProgress: number) => {
      const path = connectorPathRef.current;
      const plane = planeRef.current;

      if (!path || !plane) {
        return;
      }

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
    if (shouldReduceMotion) {
      return;
    }

    positionPlaneOnPath(latest);
  });

  useEffect(() => {
    positionPlaneOnPath(shouldReduceMotion ? 0.02 : 0);
  }, [positionPlaneOnPath, shouldReduceMotion, connector.d]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();

    if (previous === undefined || latest === previous) {
      return;
    }

    const nextDirection = latest < previous ? "up" : "down";

    if (nextDirection !== scrollDirectionRef.current) {
      scrollDirectionRef.current = nextDirection;
      setScrollDirection(nextDirection);
    }
  });

  useEffect(() => {
    if (!topInView) {
      hasResetAtCurrentTopRef.current = false;
      return;
    }

    if (scrollDirectionRef.current === "up" && !hasResetAtCurrentTopRef.current) {
      setResetNonce((value) => value + 1);
      hasResetAtCurrentTopRef.current = true;
    }
  }, [topInView]);

  return (
    <SectionWrapper
      id="nuestra-historia"
      eyebrow="Capítulo 01"
      title="Nuestra historia"
      intro={content.intro}
      className="bg-[var(--color-ivory)]"
      contentClassName="max-w-[1240px]"
    >
      <div ref={topResetRef} className="story-reset-sentinel" aria-hidden />

      <div ref={chaptersRef} className="story-chapters">
        <div className="story-connector-backdrop" aria-hidden>
          <svg
            viewBox={`0 0 1000 ${connector.height}`}
            preserveAspectRatio="none"
            className="story-connector-svg"
          >
            <motion.path
              ref={connectorPathRef}
              d={connector.d}
              className="story-connector-path"
              initial={{ pathLength: 0, opacity: 0.25 }}
              whileInView={{ pathLength: 1, opacity: 0.45 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: shouldReduceMotion ? 0 : 1.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
        </div>
        <div className="story-plane-overlay" aria-hidden>
          <span
            ref={planeRef}
            className="story-connector-plane story-connector-plane-symbol"
          >
            flight
          </span>
        </div>

        {content.beats.map((beat, index) => (
          <StoryChapterRow
            key={`${beat.title}-${resetNonce}`}
            beat={beat}
            index={index}
            shouldReduceMotion={shouldReduceMotion}
            resetNonce={resetNonce}
            scrollDirection={scrollDirection}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
