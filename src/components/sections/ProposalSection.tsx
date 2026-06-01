import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SectionWrapper from "../SectionWrapper";
import type { ProposalPhoto, WeddingContent } from "../../types/wedding";

interface ProposalSectionProps {
  content: WeddingContent["proposal"];
}

const photoFrameClasses: Record<ProposalPhoto["format"], string> = {
  portrait: "aspect-[4/5] w-[44%] min-w-[150px] max-w-[220px]",
  landscape: "aspect-[16/10] w-[58%] min-w-[190px] max-w-[290px]",
  square: "aspect-square w-[40%] min-w-[140px] max-w-[210px]",
};

const photoAngles = [-2.5, 1.8, -1.4];

const snowParticles = [
  { left: "9%", size: 4, opacity: 0.56, duration: 13.4, delay: 0.1, drift: -8 },
  { left: "18%", size: 5, opacity: 0.64, duration: 15.5, delay: 1.8, drift: 10 },
  { left: "28%", size: 3, opacity: 0.48, duration: 11.6, delay: 0.9, drift: 6 },
  { left: "39%", size: 4, opacity: 0.52, duration: 12.8, delay: 2.6, drift: -6 },
  { left: "51%", size: 5, opacity: 0.58, duration: 14.6, delay: 0.6, drift: 7 },
  { left: "66%", size: 3, opacity: 0.46, duration: 12.2, delay: 3.1, drift: -5 },
  { left: "78%", size: 4, opacity: 0.58, duration: 15.9, delay: 1.2, drift: 8 },
  { left: "89%", size: 5, opacity: 0.61, duration: 13.8, delay: 2.4, drift: -9 },
];

const sectionSnowParticles = [
  { left: "4%", size: 3, opacity: 0.2, duration: 14.2, delay: 0.2, drift: -6 },
  { left: "11%", size: 4, opacity: 0.26, duration: 16.1, delay: 1.5, drift: 8 },
  { left: "17%", size: 2, opacity: 0.18, duration: 12.7, delay: 2.3, drift: -4 },
  { left: "23%", size: 5, opacity: 0.3, duration: 15.8, delay: 0.7, drift: 6 },
  { left: "31%", size: 3, opacity: 0.22, duration: 13.9, delay: 1.9, drift: -7 },
  { left: "38%", size: 4, opacity: 0.24, duration: 16.8, delay: 2.9, drift: 5 },
  { left: "45%", size: 2, opacity: 0.18, duration: 12.1, delay: 1.1, drift: -5 },
  { left: "53%", size: 4, opacity: 0.25, duration: 15.4, delay: 0.4, drift: 7 },
  { left: "60%", size: 3, opacity: 0.2, duration: 14.7, delay: 2.1, drift: -6 },
  { left: "67%", size: 5, opacity: 0.3, duration: 17.2, delay: 1.3, drift: 9 },
  { left: "74%", size: 2, opacity: 0.17, duration: 12.9, delay: 2.6, drift: -4 },
  { left: "81%", size: 4, opacity: 0.24, duration: 16.4, delay: 0.9, drift: 6 },
  { left: "88%", size: 3, opacity: 0.21, duration: 14.9, delay: 2.8, drift: -8 },
  { left: "94%", size: 4, opacity: 0.26, duration: 15.6, delay: 1.7, drift: 5 },
];

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function ProposalSection({ content }: ProposalSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const sceneRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start end", "end start"],
  });

  const mountainBackY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [18, -22]);
  const mountainMiddleY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [12, -15]);
  const mountainFrontY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [6, -8]);
  const ringLineScale = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [1, 1] : [0.25, 1]);

  return (
    <SectionWrapper
      id="propuesta"
      eyebrow="Capítulo 05"
      title="La propuesta"
      intro={content.intro}
      className="bg-[var(--color-ivory)]"
      contentClassName="relative"
    >
      <div className="proposal-section-snow-layer" aria-hidden>
        {sectionSnowParticles.map((particle, index) => (
          <motion.span
            key={`section-snow-${index}`}
            className="proposal-section-snowflake"
            style={{
              left: particle.left,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
            }}
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    y: ["-10%", "112%"],
                    x: [0, particle.drift, 0],
                  }
            }
            transition={
              shouldReduceMotion
                ? undefined
                : {
                    duration: particle.duration,
                    delay: particle.delay,
                    ease: "linear",
                    repeat: Infinity,
                  }
            }
          />
        ))}
      </div>

      <div className="relative z-[1] grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
        <motion.figure
          ref={sceneRef}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1.05 }}
          className="proposal-scene paper-surface relative overflow-hidden rounded-[10px] p-3 md:p-4"
        >
          <div className="proposal-scene-shell relative overflow-hidden rounded-[8px]">
            <div className="proposal-sky" aria-hidden />

            <motion.div aria-hidden style={{ y: mountainBackY }} className="proposal-mountain proposal-mountain--back" />
            <motion.div
              aria-hidden
              style={{ y: mountainMiddleY }}
              className="proposal-mountain proposal-mountain--middle"
            />
            <motion.div aria-hidden style={{ y: mountainFrontY }} className="proposal-mountain proposal-mountain--front" />

            {snowParticles.map((particle, index) => (
              <motion.span
                key={`snow-${index}`}
                aria-hidden
                className="proposal-snowflake"
                style={{
                  left: particle.left,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  opacity: particle.opacity,
                }}
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: ["-6%", "112%"],
                        x: [0, particle.drift, 0],
                      }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : {
                        duration: particle.duration,
                        delay: particle.delay,
                        ease: "linear",
                        repeat: Infinity,
                      }
                }
              />
            ))}

            <motion.div aria-hidden style={{ scaleX: ringLineScale }} className="proposal-ring-line" />

            <motion.div
              aria-hidden
              className="proposal-ring"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12, scale: shouldReduceMotion ? 1 : 0.88 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: shouldReduceMotion ? 0 : 0.2 }}
            />

            <div className="proposal-photo-stack">
              {content.photos.slice(0, 3).map((photo, index) => (
                <motion.figure
                  key={photo.src}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20, rotate: shouldReduceMotion ? 0 : photoAngles[index] }}
                  whileInView={{ opacity: 1, y: 0, rotate: shouldReduceMotion ? 0 : photoAngles[index] }}
                  viewport={{ once: true, amount: 0.45 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.85,
                    delay: shouldReduceMotion ? 0 : index * 0.12,
                  }}
                  className={cx(
                    "proposal-photo-item paper-surface absolute overflow-hidden rounded-[8px] p-2",
                    photoFrameClasses[photo.format],
                    index === 0 && "left-[6%] top-[50%] z-[3]",
                    index === 1 && "right-[9%] top-[31%] z-[4]",
                    index === 2 && "right-[22%] top-[62%] z-[2]",
                  )}
                >
                  <div className="h-full w-full overflow-hidden rounded-[5px]">
                    <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <figcaption className="proposal-photo-caption">{photo.caption}</figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
          <figcaption className="section-caption mt-4 text-[var(--color-forest)]/84">
            Eigergletscher, frío en las manos y un sí imposible de olvidar.
          </figcaption>
        </motion.figure>

        <div className="proposal-copy-stack grid gap-4 md:gap-5">
          {content.beats.map((beat, index) => {
            const isHighlight = beat.emphasis === "highlight";
            const isHumor = beat.emphasis === "humor";

            return (
              <motion.p
                key={`${beat.text}-${index}`}
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.82, delay: shouldReduceMotion ? 0 : index * 0.06 }}
                className={cx(
                  "proposal-line section-caption text-[var(--color-forest)]/88",
                  isHighlight && "proposal-line--highlight",
                  isHumor && "proposal-line--humor",
                )}
              >
                {isHumor ? (
                  <motion.span
                    className="proposal-dayana"
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : {
                            x: [0, -0.8, 0.8, -0.8, 0],
                          }
                    }
                    transition={
                      shouldReduceMotion
                        ? undefined
                        : {
                            duration: 0.42,
                            delay: 1.05,
                          }
                    }
                  >
                    {beat.text}
                  </motion.span>
                ) : (
                  beat.text
                )}
              </motion.p>
            );
          })}

          <motion.a
            href={content.videoUrl}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.86 }}
            className="proposal-video-card paper-surface relative mt-2 overflow-hidden rounded-[8px]"
          >
            <img src={content.videoPoster} alt="Vista previa del video de la propuesta" className="h-44 w-full object-cover md:h-48" />
            <div className="proposal-video-overlay" />
            <div className="proposal-video-content">
              <span className="proposal-video-badge">Video</span>
              <p className="font-heading text-[1.8rem] leading-[0.9] text-[var(--color-surface)]">{content.videoLabel}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[var(--color-surface)]/82">
                Grabado con mucho amor
              </p>
            </div>
          </motion.a>
        </div>
      </div>
    </SectionWrapper>
  );
}
