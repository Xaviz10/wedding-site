import { motion, useReducedMotion } from "framer-motion";
import SectionWrapper from "../SectionWrapper";
import type { MilkaPhoto, WeddingContent } from "../../types/wedding";

interface MilkaSectionProps {
  content: WeddingContent["milka"];
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const STORY_IMAGE_INDEX = 0;
const MESSAGE_IMAGE_INDEX = 0;
const STORY_IMAGE_POSITION = {
  desktop: "right center",
  mobile: "center top",
};

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

function MilkaStoryBackground({ photos, selectedIndex = 0, shouldReduceMotion }: MilkaStoryBackgroundProps) {
  const photo = photos[selectedIndex] ?? photos[0];

  if (!photo) {
    return null;
  }

  return (
    <motion.div
      className="absolute inset-0 z-0 overflow-hidden"
      initial={shouldReduceMotion ? false : { opacity: 0.82 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: shouldReduceMotion ? 0 : 1.2, ease: EASE }}
      aria-hidden
    >
      <motion.img
        src={photo.src}
        alt=""
        className="milka-story-background-image h-full w-full object-cover"
        loading="lazy"
        decoding="async"
        initial={shouldReduceMotion ? false : { scale: 1.045 }}
        whileInView={shouldReduceMotion ? undefined : { scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 1.7, ease: EASE }}
      />
      <style>{`
        #milka .milka-story-background-image {
          object-position: ${STORY_IMAGE_POSITION.mobile};
        }

        @media (min-width: 768px) {
          #milka .milka-story-background-image {
            object-position: ${STORY_IMAGE_POSITION.desktop};
          }
        }
      `}</style>
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
    <motion.figure className="mt-8 md:mt-9" {...fadeUp(shouldReduceMotion, 0.16, 20)}>
      <motion.div
        className="relative mx-auto aspect-square w-[min(70vw,260px)] overflow-hidden rounded-full bg-[var(--color-ivory)] shadow-[0_18px_48px_rgba(36,41,31,0.12)] ring-1 ring-[color-mix(in_oklab,var(--color-gold)_70%,var(--color-ivory)_30%)] md:w-[280px]"
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
          style={{ objectPosition: "50% 42%" }}
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
              "max-w-xl text-[1rem] leading-[1.78] md:text-[1.08rem]",
              isMilkaLine &&
                "font-editorial text-[1.35rem] italic leading-[1.32] text-[var(--color-terracotta)] md:text-[1.55rem]",
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

function MilkaOrnament() {
  return (
    <div
      className="mx-auto mb-5 flex w-fit items-center gap-4 text-[color-mix(in_oklab,var(--color-olive)_70%,var(--color-gold)_30%)]"
      aria-hidden
    >
      <PawIcon className="h-4 w-4 opacity-45" />
      <span className="h-px w-9 bg-current opacity-25" />
      <span className="h-1.5 w-1.5 rounded-full border border-current opacity-35" />
      <span className="h-px w-9 bg-current opacity-25" />
      <PawIcon className="h-4 w-4 opacity-45" />
    </div>
  );
}

export default function MilkaSection({ content }: MilkaSectionProps) {
  const shouldReduceMotion = useReducedMotion() === true;
  const familyPhoto = getPhotoByCaption(content.photos, "Milka");
  const puppyPhotos = content.photos.filter((photo) => photo.caption === "Milka cachorra");
  const messagePhotos = content.photos.filter((photo) => photo.caption === "Milka carrusel");
  const storyImageOptions = uniquePhotos([
    ...(familyPhoto ? [familyPhoto] : []),
    ...puppyPhotos,
    ...messagePhotos,
    ...content.photos,
  ]);
  const portraitOptions = uniquePhotos([
    ...messagePhotos,
    ...(familyPhoto ? [familyPhoto] : []),
    ...puppyPhotos,
    ...content.photos,
  ]);

  return (
    <>
      <section
        id="milka"
        className="relative isolate min-h-[100svh] overflow-hidden bg-[var(--color-ivory)] text-[var(--color-forest)] lg:h-[100vh]"
      >
        <MilkaStoryBackground
          photos={storyImageOptions}
          selectedIndex={STORY_IMAGE_INDEX}
          shouldReduceMotion={shouldReduceMotion}
        />

        <div
          className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(252,251,248,1)_0%,rgba(252,251,248,0.98)_28%,rgba(252,251,248,0.78)_52%,rgba(252,251,248,0.34)_74%,rgba(252,251,248,0.08)_100%)] md:bg-[linear-gradient(90deg,rgba(252,251,248,1)_0%,rgba(252,251,248,0.98)_32%,rgba(252,251,248,0.68)_54%,rgba(252,251,248,0.2)_76%,rgba(252,251,248,0.03)_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(252,251,248,0.28)_0%,rgba(252,251,248,0.7)_42%,rgba(252,251,248,0.98)_100%)] md:hidden"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_78%_22%,rgba(255,255,255,0.22),transparent_34%)]"
          aria-hidden
        />

        <div className="relative z-20 mx-auto flex min-h-[100svh] w-full max-w-[94rem] items-end px-5 pb-14 pt-20 sm:px-8 md:items-center md:px-[8vw] md:py-16 lg:h-[100vh] lg:px-[9vw]">
          <motion.div className="max-w-[35rem]" {...fadeUp(shouldReduceMotion)}>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-olive)] md:text-[0.74rem]">
              Un miembro especial de la familia
            </p>
            <div className="relative mt-4 inline-block">
              <h2 className="font-heading text-[clamp(3rem,9vw,5rem)] font-medium italic leading-[0.94] text-[var(--color-forest)]">
                Milka
              </h2>
              <PawIcon className="absolute -right-8 bottom-2 h-5 w-5 rotate-12 text-[var(--color-gold)]/70 md:-right-10 md:h-6 md:w-6" />
            </div>

            <StoryParagraphs
              paragraphs={content.paragraphs}
              shouldReduceMotion={shouldReduceMotion}
              className="mt-7 md:mt-8"
            />
          </motion.div>
        </div>
      </section>

      <SectionWrapper
        id="mensaje-milka"
        className="bg-[linear-gradient(180deg,var(--color-ivory)_0%,rgba(252,251,248,0.96)_52%,var(--color-surface)_100%)] pb-24 pt-[4.5rem] md:pb-[8.5rem] md:pt-28"
        contentClassName="max-w-[860px]"
        hideDivider
        animateContent={false}
      >
        <div className="relative mx-auto text-center">
          <MilkaOrnament />

          <motion.p
            className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-olive)] md:text-[0.74rem]"
            {...fadeUp(shouldReduceMotion, 0)}
          >
            Un mensaje de Milka
          </motion.p>

          <motion.h2
            className="font-heading mt-4 text-[clamp(3.1rem,9vw,5.1rem)] font-medium italic leading-[0.95] text-[var(--color-forest)]"
            {...fadeUp(shouldReduceMotion, 0.06, 18)}
          >
            Milka
          </motion.h2>

          <MilkaPortrait
            photos={portraitOptions}
            selectedIndex={MESSAGE_IMAGE_INDEX}
            shouldReduceMotion={shouldReduceMotion}
          />

          <motion.div
            className="mx-auto mt-9 max-w-[680px] text-center md:mt-11"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: shouldReduceMotion ? 0 : 0.08,
                },
              },
            }}
          >
            {content.note.map((line, index) => {
              const isClosing = line === "Con amor,";
              const isSignature = index === content.note.length - 1;

              return (
                <motion.p
                  key={`milka-message-${index}`}
                  className={cx(
                    "mx-auto max-w-[40rem] font-editorial text-[1.08rem] leading-[1.72] text-[var(--color-forest)]/78 md:text-[1.18rem] md:leading-[1.78]",
                    index > 0 && "mt-3",
                    isClosing && "mt-8",
                    isSignature &&
                      "mt-2 font-heading text-[1.55rem] italic leading-[1.18] text-[var(--color-terracotta)] md:text-[1.85rem]",
                  )}
                  variants={{
                    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 14 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.76, ease: EASE }}
                >
                  {line}
                </motion.p>
              );
            })}
          </motion.div>
        </div>
      </SectionWrapper>
    </>
  );
}
