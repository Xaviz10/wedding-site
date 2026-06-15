import { motion, useReducedMotion } from "framer-motion";
import SectionWrapper from "../SectionWrapper";
import type { WeddingContent } from "../../types/wedding";

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

export default function ProposalSection({ content }: ProposalSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  // Categorize photos by format to place them strategically in the editorial layout
  const landscapePhoto = content.photos.find(p => p.format === "landscape") || content.photos[0];
  const portraitPhoto = content.photos.find(p => p.format === "portrait") || content.photos[1];
  const squarePhoto = content.photos.find(p => p.format === "square") || content.photos[2];

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
      {/* Ambient snow falling across the entire section */}
      <div className="proposal-section-snow-layer" aria-hidden>
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
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 md:px-8">
        
        {/* Editorial Header */}
        <motion.header
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1.2 }}
        >
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[var(--color-olive)]">
            Capítulo 05
          </p>
          <h2 className="font-heading mt-6 text-[clamp(3rem,7vw,4.75rem)] leading-[0.95] text-[var(--color-forest)]">
            La propuesta
          </h2>
          <p className="font-editorial mt-6 text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.18] italic text-[var(--color-terracotta)]">
            {content.intro}
          </p>
        </motion.header>

        {/* Grid 1: Narrative & Portrait Photo */}
        <div className="mt-20 grid items-center gap-16 md:mt-32 lg:grid-cols-12">
          <motion.div 
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: shouldReduceMotion ? 0 : 1.2 }}
            className="lg:col-span-5 lg:col-start-1"
          >
            <div className="grid gap-10">
              {narrativeBeats.slice(0, 2).map((beat, i) => (
                <p key={i} className="font-editorial text-[1.15rem] leading-[1.42] text-[var(--color-forest)]/85 md:text-2xl">
                  {beat.text}
                </p>
              ))}
            </div>
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

        {/* The Highlight Moment */}
        {highlightBeat && (
          <motion.div 
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: shouldReduceMotion ? 0 : 1.5 }}
            className="mt-32 text-center md:mt-48"
          >
            <h3 className="font-heading text-[clamp(3rem,8vw,6rem)] leading-[0.9] text-[var(--color-forest)]">
              {highlightBeat.text}
            </h3>
          </motion.div>
        )}

        {/* Grid 2: Landscape Photo, Final Text, and Square Photo */}
        <div className="mt-32 grid items-end gap-16 md:mt-48 lg:grid-cols-12">
          <motion.figure 
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: shouldReduceMotion ? 0 : 1.2 }}
            className="lg:col-span-8"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[8px] shadow-[0_24px_54px_rgba(36,41,31,0.08)] md:aspect-[16/10]">
              <img src={landscapePhoto.src} alt={landscapePhoto.alt} className="h-full w-full object-cover transition-transform duration-[2s] hover:scale-105" loading="lazy" />
            </div>
            <figcaption className="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-olive)]">
              {landscapePhoto.caption}
            </figcaption>
          </motion.figure>

          <motion.div 
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: shouldReduceMotion ? 0 : 1.2, delay: 0.2 }}
            className="grid gap-12 lg:col-span-4"
          >
            {narrativeBeats[2] && (
              <p className="font-editorial text-right text-2xl italic leading-[1.32] text-[var(--color-terracotta)] md:text-3xl">
                "{narrativeBeats[2].text}"
              </p>
            )}
            
            <figure className="relative ml-auto aspect-square w-3/4 overflow-hidden rounded-[8px] shadow-[0_20px_40px_rgba(36,41,31,0.08)] md:w-2/3">
              <img src={squarePhoto.src} alt={squarePhoto.alt} className="h-full w-full object-cover" loading="lazy" />
            </figure>
          </motion.div>
        </div>

        {/* Editorial Vertical Video Block */}
        <div className="mt-32 grid items-center gap-12 md:mt-48 lg:grid-cols-12 lg:gap-16">
          
          {/* Humor Text dynamically placed beside the vertical video */}
          {humorBeat && (
            <motion.div 
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: shouldReduceMotion ? 0 : 1.5, delay: 0.3 }}
              className="order-2 text-center lg:order-1 lg:col-span-5 lg:col-start-2 lg:text-left"
            >
              <p className="font-editorial text-xl italic leading-[1.32] text-[var(--color-forest)]/80 md:text-3xl">
                "{humorBeat.text}"
              </p>
            </motion.div>
          )}

          <motion.a
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: shouldReduceMotion ? 0 : 1.2 }}
            href={content.videoUrl}
            target="_blank"
            rel="noreferrer"
            className={`group relative block overflow-hidden rounded-[8px] shadow-[0_32px_64px_rgba(36,41,31,0.12)] order-1 mx-auto w-full max-w-sm lg:order-2 lg:col-span-4 lg:max-w-none ${!humorBeat ? 'lg:col-start-5' : ''}`}
          >
            {/* Vertical Aspect Ratio 9:16 */}
            <div className="aspect-[9/16] w-full bg-[var(--color-olive)]/10">
              <img src={content.videoPoster} alt="Video Poster" className="h-full w-full object-cover transition-transform duration-[3s] group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-[var(--color-forest)]/20 transition-colors duration-700 group-hover:bg-[var(--color-forest)]/10" />
              
              {/* Play Button Overlay */}
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

      </div>
    </SectionWrapper>
  );
}
