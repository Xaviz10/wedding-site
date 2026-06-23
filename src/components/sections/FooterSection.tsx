import { motion, useReducedMotion } from "framer-motion";
import fincaLaMaraImage from "../../assets/finca-la-mara.avif";
import type { WeddingContent } from "../../types/wedding";

interface FooterSectionProps {
  couple: string;
  date: string;
  content: WeddingContent["footer"];
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function FooterSection({ couple, date, content }: FooterSectionProps) {
  const shouldReduceMotion = useReducedMotion() === true;
  const names = couple.split("&").map((name) => name.trim());

  return (
    <footer
      id="despedida"
      className="relative isolate min-h-[78svh] overflow-hidden bg-[var(--color-forest)] text-[#fff8e8]"
    >
      <motion.div
        className="absolute inset-x-0 -inset-y-[8%] z-0"
        initial={shouldReduceMotion ? false : { scale: 1.08 }}
        whileInView={shouldReduceMotion ? undefined : { scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: shouldReduceMotion ? 0 : 2.2, ease: EASE }}
      >
        <img
          src={fincaLaMaraImage}
          alt="Finca La Mara, lugar de celebración"
          className="h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
      </motion.div>

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(7,11,13,0.7)_0%,rgba(7,11,13,0.38)_42%,rgba(7,11,13,0.8)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_50%_46%,rgba(255,248,232,0.08)_0%,rgba(5,7,6,0.14)_38%,rgba(5,7,6,0.7)_100%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-[78svh] w-full max-w-[78rem] flex-col items-center justify-center px-5 py-16 text-center sm:px-8 md:py-20">
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.9, ease: EASE }}
          className="text-[0.62rem] font-semibold uppercase tracking-[0.36em] text-[var(--color-gold)] md:text-[0.72rem]"
        >
          {content.eyebrow}
        </motion.p>

        <motion.h2
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1.25, delay: shouldReduceMotion ? 0 : 0.08, ease: EASE }}
          className="font-heading mt-7 whitespace-nowrap text-[clamp(3.25rem,11vw,6.2rem)] font-medium italic leading-[0.88] tracking-normal text-[#fff8e8] drop-shadow-[0_14px_38px_rgba(0,0,0,0.48)] md:text-[clamp(5rem,7vw,8rem)]"
        >
          {names.length >= 2 ? (
            <>
              <span>{names[0]}</span>{" "}
              <span className="font-semibold text-[var(--color-gold)]">&amp;</span>{" "}
              <span>{names.slice(1).join(" & ")}</span>
            </>
          ) : (
            couple
          )}
        </motion.h2>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scaleX: 0.7 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1, delay: shouldReduceMotion ? 0 : 0.18, ease: EASE }}
          className="mt-8 flex w-[min(17rem,68vw)] origin-center items-center gap-4 text-[var(--color-gold)]"
          aria-hidden
        >
          <span className="h-px flex-1 bg-current opacity-65" />
          <span className="h-2 w-2 rotate-45 border border-current" />
          <span className="h-px flex-1 bg-current opacity-65" />
        </motion.div>

        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.95, delay: shouldReduceMotion ? 0 : 0.24, ease: EASE }}
          className="font-editorial mt-8 max-w-[34rem] text-[clamp(1.15rem,2.5vw,1.55rem)] italic leading-[1.35] text-[#fff8e8]/88 drop-shadow-[0_6px_20px_rgba(0,0,0,0.45)]"
        >
          {content.message}
        </motion.p>

        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.85, delay: shouldReduceMotion ? 0 : 0.32, ease: EASE }}
          className="mt-7 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)] md:text-[0.76rem]"
        >
          {date}
        </motion.p>

        <motion.a
          href="#portada"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: shouldReduceMotion ? 0 : 0.4, ease: EASE }}
          className="mt-10 inline-flex items-center gap-3 border-b border-[#fff8e8]/36 pb-2 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#fff8e8]/78 transition hover:border-[#fff8e8]/80 hover:text-[#fff8e8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)] md:text-[0.68rem]"
        >
          {content.backToTopLabel}
          <span aria-hidden>↑</span>
        </motion.a>
      </div>
    </footer>
  );
}
