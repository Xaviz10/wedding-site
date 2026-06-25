import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type CSSProperties } from "react";
import SectionWrapper from "../SectionWrapper";
import type { MilkaPhoto, WeddingContent } from "../../types/wedding";

interface MilkaSectionProps {
  content: WeddingContent["milka"];
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const STORY_IMAGE_INDEX = 0;
const MESSAGE_IMAGE_INDEX = 0;
const MILKA_BACKGROUND_INTERVAL_MS = 30 * 1000;
function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

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

function fadeUp(shouldReduceMotion: boolean, delay = 0, distance = 24) {
  return {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : distance },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.34 },
    transition: {
      duration: shouldReduceMotion ? 0 : 0.95,
      delay: shouldReduceMotion ? 0 : delay,
      ease: EASE,
    },
  };
}

function uniquePhotos(photos: MilkaPhoto[]) {
  const seen = new Set<string>();

  return photos.filter((photo) => {
    if (seen.has(photo.src)) return false;
    seen.add(photo.src);
    return true;
  });
}

function getPhotoByCaption(photos: MilkaPhoto[], caption: string) {
  return photos.find((photo) => photo.caption === caption);
}

interface MilkaStoryBackgroundProps {
  photos: MilkaPhoto[];
  selectedIndex?: number;
  shouldReduceMotion: boolean;
}

function getMilkaBackgroundPosition(photo: MilkaPhoto, index: number) {
  if (photo.alt.includes("sacos navideños")) {
    return { mobile: "56% 50%", desktop: "50% 50%" };
  }

  if (photo.alt.includes("puerta azul")) {
    return { mobile: "50% 64%", desktop: "48% 57%" };
  }

  if (photo.alt.includes("río")) {
    return { mobile: "50% 22%", desktop: "50% 22%" };
  }

  if (photo.alt.includes("pañoleta")) {
    return { mobile: "18% 50%", desktop: "42% 50%" };
  }

  if (photo.alt.includes("corriendo")) {
    return { mobile: "88% 55%", desktop: "72% 55%" };
  }

  return index === 0 ? { mobile: "54% 50%", desktop: "54% 50%" } : { mobile: "50% 50%", desktop: "50% 50%" };
}

function MilkaStoryBackground({ photos, selectedIndex = 0, shouldReduceMotion }: MilkaStoryBackgroundProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(selectedIndex);
  const photo = photos[activePhotoIndex] ?? photos[0];
  const position = photo ? getMilkaBackgroundPosition(photo, activePhotoIndex) : undefined;

  useEffect(() => {
    setActivePhotoIndex(Math.min(selectedIndex, Math.max(photos.length - 1, 0)));
  }, [photos.length, selectedIndex]);

  useEffect(() => {
    if (photos.length <= 1) return undefined;

    const intervalId = window.setInterval(() => {
      setActivePhotoIndex((index) => (index + 1) % photos.length);
    }, MILKA_BACKGROUND_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [photos.length]);

  useEffect(() => {
    if (photos.length <= 1) return;

    const nextPhoto = photos[(activePhotoIndex + 1) % photos.length];
    const image = new window.Image();
    image.src = nextPhoto.src;
  }, [activePhotoIndex, photos]);

  if (!photo) {
    return null;
  }

  return (
    <motion.div
      className="absolute inset-x-0 -inset-y-[8%] z-0 overflow-hidden"
      initial={shouldReduceMotion ? false : { opacity: 0.82 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: shouldReduceMotion ? 0 : 1.2, ease: EASE }}
      aria-hidden
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={photo.src}
          src={photo.src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover [object-position:var(--milka-mobile-position)] lg:[object-position:var(--milka-desktop-position)]"
          style={
            {
              "--milka-mobile-position": position?.mobile ?? "50% 50%",
              "--milka-desktop-position": position?.desktop ?? "50% 50%",
            } as CSSProperties
          }
          loading={activePhotoIndex === 0 ? "eager" : "lazy"}
          decoding="async"
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.055 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.025 }}
          transition={{
            opacity: { duration: shouldReduceMotion ? 0 : 1.4, ease: "easeInOut" },
            scale: { duration: shouldReduceMotion ? 0 : 2.7, ease: EASE },
          }}
        />
      </AnimatePresence>
    </motion.div>
  );
}

interface MilkaPortraitProps {
  photos: MilkaPhoto[];
  selectedIndex?: number;
  shouldReduceMotion: boolean;
}

function MilkaPortrait({ photos, selectedIndex = 0, shouldReduceMotion }: MilkaPortraitProps) {
  const photo = photos[selectedIndex] ?? photos[0];

  if (!photo) {
    return null;
  }

  return (
    <motion.figure className="mt-6 md:mt-8" {...fadeUp(shouldReduceMotion, 0.16, 20)}>
      <motion.div
        className="relative mx-auto aspect-square w-[min(58vw,200px)] overflow-hidden rounded-full bg-[var(--color-ivory)] shadow-[0_16px_38px_rgba(36,41,31,0.11)] ring-2 ring-[color-mix(in_oklab,var(--color-gold)_78%,var(--color-ivory)_22%)] md:w-[250px]"
        initial={shouldReduceMotion ? false : { scale: 0.96, opacity: 0.6 }}
        whileInView={shouldReduceMotion ? undefined : { scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.42 }}
        transition={{ duration: shouldReduceMotion ? 0 : 1.05, ease: EASE }}
      >
        <motion.img
          src={photo.src}
          alt={photo.alt}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          style={{ objectPosition: "50% 24%" }}
          initial={shouldReduceMotion ? false : { scale: 1.05 }}
          whileInView={shouldReduceMotion ? undefined : { scale: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1.4, ease: EASE }}
        />
      </motion.div>
      <figcaption className="sr-only">{photo.caption}</figcaption>
    </motion.figure>
  );
}

interface StoryParagraphsProps {
  paragraphs: string[];
  className?: string;
  shouldReduceMotion: boolean;
}

function StoryParagraphs({ paragraphs, className, shouldReduceMotion }: StoryParagraphsProps) {
  return (
    <motion.div
      className={cx("grid gap-4 text-[var(--color-forest)]/82 md:gap-5", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: shouldReduceMotion ? 0 : 0.08,
          },
        },
      }}
    >
      {paragraphs.map((paragraph, index) => {
        const isMilkaLine = paragraph.trim().toLowerCase() === "era milka.";

        return (
          <motion.p
            key={`milka-story-${index}`}
            className={cx(
              "max-w-xl text-[clamp(1.02rem,1.45vw,1.38rem)] leading-[1.42]",
              isMilkaLine &&
                "font-editorial italic text-[var(--color-terracotta)]",
            )}
            variants={{
              hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: EASE }}
          >
            {paragraph}
          </motion.p>
        );
      })}
    </motion.div>
  );
}

function MilkaOrnament({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "mx-auto flex w-fit items-center gap-3 text-[color-mix(in_oklab,var(--color-olive)_62%,var(--color-gold)_38%)] md:gap-4",
        className,
      )}
      aria-hidden
    >
      <PawIcon className="h-4 w-4 opacity-55 md:h-5 md:w-5" />
      <span className="h-px w-8 bg-current opacity-25 md:w-11" />
      <span className="h-1.5 w-1.5 rounded-full border border-current opacity-45" />
      <span className="h-px w-8 bg-current opacity-25 md:w-11" />
      <PawIcon className="h-4 w-4 opacity-55 md:h-5 md:w-5" />
    </div>
  );
}

export default function MilkaSection({ content }: MilkaSectionProps) {
  const shouldReduceMotion = useReducedMotion() === true;
  const familyPhoto = getPhotoByCaption(content.photos, "Milka");
  const coverPhotos = content.photos.filter((photo) => photo.caption === "Milka portada");
  const portraitPhotos = content.photos.filter((photo) => photo.caption === "Milka retrato");
  const puppyPhotos = content.photos.filter((photo) => photo.caption === "Milka cachorra");
  const messagePhotos = content.photos.filter((photo) => photo.caption === "Milka carrusel");
  const storyImageOptions = coverPhotos.length > 0
    ? uniquePhotos(coverPhotos)
    : uniquePhotos([
        ...(familyPhoto ? [familyPhoto] : []),
        ...puppyPhotos,
        ...messagePhotos,
        ...content.photos,
      ]);
  const portraitOptions = portraitPhotos.length > 0
    ? uniquePhotos(portraitPhotos)
    : uniquePhotos([
        ...messagePhotos,
        ...(familyPhoto ? [familyPhoto] : []),
        ...puppyPhotos,
        ...content.photos,
      ]);
  const messageParagraphs = content.note.slice(0, -2);
  const closingLine = content.note[content.note.length - 2];
  const signatureLine = content.note[content.note.length - 1];

  return (
    <>
      <section
        id="milka"
        className="relative isolate min-h-[100svh] overflow-hidden bg-[var(--color-forest)] text-[#f8f0df] lg:h-[100vh] lg:min-h-0"
        aria-labelledby="milka-title"
      >
        <MilkaStoryBackground
          photos={storyImageOptions}
          selectedIndex={STORY_IMAGE_INDEX}
          shouldReduceMotion={shouldReduceMotion}
        />

        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(7,11,13,0.56)_0%,rgba(7,11,13,0.28)_42%,rgba(7,11,13,0.64)_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_84%_78%,rgba(5,7,6,0.84)_0%,rgba(5,7,6,0.62)_27%,rgba(5,7,6,0.08)_58%,transparent_72%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[3] bg-[linear-gradient(90deg,rgba(5,8,7,0.5)_0%,transparent_35%,rgba(5,8,7,0.16)_100%)]"
          aria-hidden
        />

        <div className="relative z-20 mx-auto flex min-h-[100svh] w-full max-w-[94rem] flex-col px-5 py-8 sm:px-8 md:px-14 md:py-12 lg:h-full lg:min-h-0 lg:px-20">
          <motion.div className="ml-auto max-w-xl text-right" {...fadeUp(shouldReduceMotion)}>
            <div className="mt-[clamp(3rem,10svh,7.5rem)]">
              <div className="relative inline-block">
                <h2
                  id="milka-title"
                  className="font-heading text-[clamp(3.2rem,7vw,6.2rem)] font-medium italic leading-[0.88] tracking-normal text-[#fff8e8] drop-shadow-[0_16px_38px_rgba(0,0,0,0.36)]"
                >
                  Milka
                </h2>
                <motion.span
                  className="absolute -left-7 top-0 block h-4 w-4 text-[var(--color-gold)]/55 md:-left-10 md:h-5 md:w-5"
                  animate={shouldReduceMotion ? undefined : { y: [0, -5, 0], rotate: [-12, -6, -12] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden
                >
                  <PawIcon className="h-full w-full" />
                </motion.span>
                <motion.span
                  className="absolute -right-8 bottom-2 block h-5 w-5 text-[var(--color-gold)]/75 md:-right-10 md:h-6 md:w-6"
                  animate={shouldReduceMotion ? undefined : { y: [0, -7, 0], rotate: [12, 18, 12] }}
                  transition={{ duration: 3.6, delay: 0.35, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden
                >
                  <PawIcon className="h-full w-full" />
                </motion.span>
                <motion.span
                  className="absolute -right-3 -top-7 block h-3.5 w-3.5 text-[var(--color-gold)]/50 md:-right-5 md:-top-9 md:h-4 md:w-4"
                  animate={shouldReduceMotion ? undefined : { y: [0, -4, 0], rotate: [28, 35, 28] }}
                  transition={{ duration: 2.9, delay: 0.7, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden
                >
                  <PawIcon className="h-full w-full" />
                </motion.span>
              </div>
              <p className="font-editorial mt-4 text-[clamp(1.16rem,2vw,1.75rem)] italic leading-[1.05] text-[#f0dcc0]/92 drop-shadow-[0_8px_24px_rgba(0,0,0,0.48)]">
                Un miembro especial de la familia
              </p>
            </div>
          </motion.div>

          <StoryParagraphs
            paragraphs={content.paragraphs}
            shouldReduceMotion={shouldReduceMotion}
            className="mr-auto mt-auto max-w-[47rem] pb-[clamp(1rem,4svh,3.5rem)] pt-14 text-left font-editorial !text-[#fff7e8] drop-shadow-[0_8px_24px_rgba(0,0,0,0.62)]"
          />
        </div>
      </section>

      <SectionWrapper
        id="mensaje-milka"
        className="bg-white pb-10 pt-10 md:min-h-[100svh] md:pb-12 md:pt-12"
        contentClassName="max-w-[72rem]"
        hideDivider
        animateContent={false}
      >
        <div className="relative isolate mx-auto text-center">
          <motion.div
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden text-[var(--color-gold)]"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: shouldReduceMotion ? 0 : 1.2, ease: EASE }}
            aria-hidden
          >
            <motion.span
              className="absolute left-[3%] top-[8%] block h-7 w-7 opacity-15 md:h-10 md:w-10"
              animate={shouldReduceMotion ? undefined : { y: [0, -8, 0], rotate: [-18, -10, -18] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <PawIcon className="h-full w-full" />
            </motion.span>
            <motion.span
              className="absolute right-[5%] top-[25%] block h-5 w-5 opacity-20 md:h-8 md:w-8"
              animate={shouldReduceMotion ? undefined : { y: [0, -6, 0], rotate: [20, 28, 20] }}
              transition={{ duration: 3.6, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <PawIcon className="h-full w-full" />
            </motion.span>
            <motion.span
              className="absolute bottom-[28%] left-[8%] block h-5 w-5 opacity-15 md:h-7 md:w-7"
              animate={shouldReduceMotion ? undefined : { y: [0, -7, 0], rotate: [14, 7, 14] }}
              transition={{ duration: 3.9, delay: 0.9, repeat: Infinity, ease: "easeInOut" }}
            >
              <PawIcon className="h-full w-full" />
            </motion.span>
            <motion.span
              className="absolute bottom-[10%] right-[3%] block h-8 w-8 opacity-10 md:h-12 md:w-12"
              animate={shouldReduceMotion ? undefined : { y: [0, -9, 0], rotate: [-24, -16, -24] }}
              transition={{ duration: 4.6, delay: 0.25, repeat: Infinity, ease: "easeInOut" }}
            >
              <PawIcon className="h-full w-full" />
            </motion.span>
          </motion.div>

          <MilkaOrnament />

          <motion.p
            className="relative z-10 mt-9 text-[0.62rem] font-medium uppercase tracking-[0.26em] text-[var(--color-olive)] md:mt-12 md:text-[0.74rem] md:tracking-[0.3em]"
            {...fadeUp(shouldReduceMotion, 0)}
          >
            Un mensaje de Milka
          </motion.p>

          <motion.div
            className="relative mx-auto mt-5 w-fit md:mt-6"
            {...fadeUp(shouldReduceMotion, 0.06, 18)}
          >
            <h2 className="font-script text-[clamp(3.25rem,7vw,5.2rem)] font-normal leading-none text-[var(--color-forest)]">
              Milka
            </h2>
            <motion.span
              className="absolute -left-8 top-0 block h-4 w-4 text-[var(--color-gold)]/65 md:-left-11 md:h-5 md:w-5"
              animate={shouldReduceMotion ? undefined : { y: [0, -5, 0], rotate: [-16, -8, -16] }}
              transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            >
              <PawIcon className="h-full w-full" />
            </motion.span>
            <motion.span
              className="absolute -right-8 bottom-1 block h-5 w-5 text-[var(--color-terracotta)]/55 md:-right-11 md:h-6 md:w-6"
              animate={shouldReduceMotion ? undefined : { y: [0, -6, 0], rotate: [14, 22, 14] }}
              transition={{ duration: 3.5, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            >
              <PawIcon className="h-full w-full" />
            </motion.span>
          </motion.div>

          <MilkaPortrait
            photos={portraitOptions}
            selectedIndex={MESSAGE_IMAGE_INDEX}
            shouldReduceMotion={shouldReduceMotion}
          />

          <motion.div
            className="mx-auto mt-9 max-w-[62rem] text-center md:mt-12"
          >
            {messageParagraphs.map((paragraph, index) => (
              <motion.p
                key={`milka-message-${index}`}
                className={cx(
                  "mx-auto max-w-[32ch] font-editorial text-[1.05rem] italic leading-[1.52] text-[var(--color-forest)]/72 md:max-w-[46rem] md:text-[1.35rem] md:leading-[1.55]",
                  index > 0 && "mt-3 md:mt-4",
                )}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.82, delay: index * 0.08, ease: EASE }}
              >
                {index === 0 && "“"}
                {paragraph}
                {index === messageParagraphs.length - 1 && "”"}
              </motion.p>
            ))}

            {closingLine && (
              <motion.p
                className="mt-5 font-editorial text-[0.9rem] italic text-[var(--color-forest)]/64 md:mt-6 md:text-[1.02rem]"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.76, ease: EASE }}
              >
                {closingLine}
              </motion.p>
            )}

            {signatureLine && (
              <motion.p
                className="mt-1.5 flex items-center justify-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-terracotta)] md:text-[0.76rem]"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.76, ease: EASE }}
              >
                <span aria-hidden>—</span>
                <span>{signatureLine}</span>
                <motion.span
                  animate={shouldReduceMotion ? undefined : { y: [0, -2, 0], rotate: [12, 20, 12] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden
                >
                  <PawIcon className="h-3.5 w-3.5 text-[var(--color-forest)]/72" />
                </motion.span>
              </motion.p>
            )}
          </motion.div>

          <MilkaOrnament className="mt-10 md:mt-14" />
        </div>
      </SectionWrapper>
    </>
  );
}
