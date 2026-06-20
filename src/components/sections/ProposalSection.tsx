import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import SectionWrapper from "../SectionWrapper";
import type { ProposalPhoto, WeddingContent } from "../../types/wedding";

interface ProposalSectionProps {
  content: WeddingContent["proposal"];
}

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

interface ProposalPhotoFrameProps {
  photo: ProposalPhoto;
  className?: string;
  imageClassName?: string;
  imageFit?: "cover" | "contain";
  captionAlign?: "left" | "right";
  shouldReduceMotion: boolean;
}

function ProposalPhotoFrame({
  photo,
  className,
  imageClassName = "aspect-[4/5]",
  imageFit = "cover",
  captionAlign = "left",
  shouldReduceMotion,
}: ProposalPhotoFrameProps) {
  const frameRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start 86%", "end 18%"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 84, damping: 28, mass: 0.55 });
  const y = useTransform(smoothProgress, [0, 1], shouldReduceMotion ? [0, 0] : [38, -30]);
  const scale = useTransform(smoothProgress, [0, 0.55, 1], shouldReduceMotion ? [1, 1, 1] : [1.08, 1.01, 1.045]);
  const opacity = useTransform(smoothProgress, [0, 0.18, 0.9, 1], [0.28, 1, 1, 0.76]);

  return (
    <motion.figure ref={frameRef} className={className} style={{ y, opacity }}>
      <motion.div
        className={`relative w-full overflow-hidden rounded-[4px] shadow-[0_30px_72px_rgba(36,41,31,0.14)] ${imageClassName}`}
        initial={shouldReduceMotion ? false : { clipPath: "inset(15% 9% 15% 9%)" }}
        whileInView={shouldReduceMotion ? undefined : { clipPath: "inset(0% 0% 0% 0%)" }}
        viewport={{ once: true, amount: 0.42 }}
        transition={{ duration: 1.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img
          src={photo.src}
          alt={photo.alt}
          className={`h-full w-full ${imageFit === "contain" ? "object-contain" : "object-cover"}`}
          loading="lazy"
          style={{ scale }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(36,41,31,0.01),rgba(36,41,31,0.18))]" />
      </motion.div>
      {photo.caption && (
        <figcaption
          className={`mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-olive)] ${
            captionAlign === "right" ? "text-right" : ""
          }`}
        >
          {photo.caption}
        </figcaption>
      )}
    </motion.figure>
  );
}

export default function ProposalSection({ content }: ProposalSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLAnchorElement | null>(null);
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start 82%", "end 24%"],
  });
  const { scrollYProgress: videoProgress } = useScroll({
    target: videoRef,
    offset: ["start 90%", "end 20%"],
  });
  const smoothSectionProgress = useSpring(sectionProgress, { stiffness: 76, damping: 28, mass: 0.6 });
  const smoothVideoProgress = useSpring(videoProgress, { stiffness: 86, damping: 30, mass: 0.55 });
  const headerY = useTransform(smoothSectionProgress, [0, 0.28], shouldReduceMotion ? [0, 0] : [34, 0]);
  const headerOpacity = useTransform(smoothSectionProgress, [0, 0.16], [0.2, 1]);
  const snowOpacity = useTransform(smoothSectionProgress, [0, 0.12, 0.86, 1], [0, 0.72, 0.72, 0.18]);
  const videoScale = useTransform(smoothVideoProgress, [0, 0.55, 1], shouldReduceMotion ? [1, 1, 1] : [0.94, 1, 1.025]);
  const videoImageScale = useTransform(smoothVideoProgress, [0, 1], shouldReduceMotion ? [1, 1] : [1.08, 1.01]);

  // Categorize photos by format to place them strategically in the editorial layout
  const portraitPhoto = content.photos.find(p => p.format === "portrait") || content.photos[1];
  const locationPhoto = content.photos.find(p => p.format === "landscape") || content.photos[0];

  // Categorize the text beats based on their emphasis
  const narrativeBeats = content.beats.filter(b => !b.emphasis);
  const highlightBeat = content.beats.find(b => b.emphasis === "highlight");
  const humorBeat = content.beats.find(b => b.emphasis === "humor");

  return (
    <SectionWrapper
      id="propuesta"
      className="bg-[var(--color-ivory)] pb-24 pt-24 md:pb-32 md:pt-32"
      contentClassName="relative max-w-none px-0"
      hideDivider
    >
      <motion.div className="proposal-section-snow-layer" style={{ opacity: shouldReduceMotion ? 0.7 : snowOpacity }} aria-hidden>
        {sectionSnowParticles.map((particle, index) => (
          <motion.span
            key={`section-snow-${index}`}
            className="proposal-section-snowflake absolute top-[-10%]"
            style={{
              left: particle.left,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              background: 'color-mix(in oklab, white 84%, #dbe8f3 16%)',
              borderRadius: '999px',
            }}
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    y: ["0vh", "120vh"],
                    x: [0, particle.drift * 2, 0],
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
      </motion.div>

      <div ref={sectionRef} className="relative z-10 mx-auto max-w-[1200px] px-4 md:px-8">
        
        <motion.header
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1.15, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: headerY, opacity: headerOpacity }}
        >
          <h2 className="font-heading text-[clamp(3rem,7vw,4.75rem)] leading-[0.95] text-[var(--color-forest)]">
            La propuesta
          </h2>
          <p className="font-editorial mt-6 text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.18] italic text-[var(--color-terracotta)]">
            {content.intro}
          </p>
        </motion.header>

        <div className="mt-10 grid items-start gap-12 md:mt-16 lg:grid-cols-12 lg:gap-16">
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
            className="lg:col-span-5 lg:col-start-1"
          >
            <div className="grid gap-10">
              {narrativeBeats.slice(0, 2).map((beat, i) => (
                <motion.p
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 22 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="font-editorial text-[1.15rem] leading-[1.42] text-[var(--color-forest)]/85 md:text-2xl"
                >
                  {beat.text}
                </motion.p>
              ))}
            </div>
          </motion.div>

          <ProposalPhotoFrame
            photo={portraitPhoto}
            shouldReduceMotion={shouldReduceMotion === true}
            captionAlign="right"
            className="lg:col-span-6 lg:col-start-7"
            imageClassName="aspect-[4/5] bg-[var(--color-surface)] md:aspect-[3/4]"
            imageFit="contain"
          />
        </div>

        {highlightBeat && (
          <motion.div 
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 34, scale: shouldReduceMotion ? 1 : 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.42 }}
            transition={{ duration: shouldReduceMotion ? 0 : 1.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-32 text-center md:mt-48"
          >
            <h3 className="font-heading text-[clamp(3.5rem,10vw,7.5rem)] leading-[0.88] text-[var(--color-forest)]">
              {highlightBeat.text}
            </h3>
            {narrativeBeats[2] && (
              <p className="font-editorial mx-auto mt-8 max-w-4xl text-[clamp(2rem,4.5vw,3.1rem)] italic leading-[1.05] text-[var(--color-olive)]/70">
                “{narrativeBeats[2].text}”
              </p>
            )}
          </motion.div>
        )}

        <div className="mt-14 grid items-center gap-12 bg-[var(--color-surface)] px-6 py-10 md:mt-16 md:px-8 md:py-14 lg:grid-cols-12 lg:gap-16">
          {humorBeat && (
            <motion.div 
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: shouldReduceMotion ? 0 : 1.15, delay: shouldReduceMotion ? 0 : 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="order-2 text-center lg:order-1 lg:col-span-5 lg:text-left"
            >
              <p className="font-editorial text-[clamp(1.75rem,3vw,2.45rem)] italic leading-[1.2] text-[var(--color-forest)]/80">
                “{humorBeat.text}”
              </p>
            </motion.div>
          )}

          <motion.a
            ref={videoRef}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: shouldReduceMotion ? 0 : 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ scale: videoScale }}
            href={content.videoUrl}
            target="_blank"
            rel="noreferrer"
            className={`group relative order-1 mx-auto block w-full max-w-sm overflow-hidden rounded-[8px] shadow-[0_32px_64px_rgba(36,41,31,0.12)] lg:order-2 lg:col-span-5 lg:col-start-8 lg:max-w-none ${!humorBeat ? 'lg:col-start-5' : ''}`}
          >
            <div className="aspect-[9/16] w-full bg-[var(--color-olive)]/10">
              <motion.img
                src={content.videoPoster}
                alt="Video de la propuesta"
                className="h-full w-full object-cover"
                loading="lazy"
                style={{ scale: videoImageScale }}
              />
              <div className="absolute inset-0 bg-[var(--color-forest)]/20 transition-colors duration-700 group-hover:bg-[var(--color-forest)]/10" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-2xl transition-transform duration-500 group-hover:scale-110 md:h-20 md:w-20">
                  <svg viewBox="0 0 24 24" fill="var(--color-forest)" className="ml-1.5 h-8 w-8 md:h-10 md:w-10">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <p className="font-heading mt-6 text-xl tracking-widest text-white drop-shadow-md md:text-2xl">
                  {content.videoLabel}
                </p>
              </div>
            </div>
          </motion.a>
        </div>
        <p className="mt-6 text-right text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-olive)]">
          {locationPhoto.caption}
        </p>

      </div>
    </SectionWrapper>
  );
}
