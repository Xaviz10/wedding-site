import { motion, useReducedMotion } from "framer-motion";
import type { HeroContent } from "../../types/wedding";
import InvitationLayer from "../InvitationLayer";
import BotanicalFrame from "../BotanicalFrame";
import AnimatedOrchid from "../AnimatedOrchid";

interface HeroSectionProps {
  content: HeroContent;
}

export default function HeroSection({ content }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="portada" className="relative min-h-[100svh] px-4 pb-16 pt-10 md:px-8 md:pt-14 lg:pb-24">
      <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end">
        <motion.header
          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -22 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1.1 }}
          className="paper-surface--soft relative rounded-[8px] p-7 md:p-10"
        >
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[var(--color-olive)]">Invitación</p>
          <h1 className="font-heading text-5xl leading-[1.02] md:text-7xl">{content.title}</h1>
          <p className="font-editorial mt-3 text-3xl md:text-4xl">{content.subtitle}</p>
          <p className="section-caption mt-6 max-w-[36ch] text-[var(--color-forest)]/88">{content.text}</p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-terracotta)]">{content.date}</p>
            <a
              href="#nuestra-historia"
              className="inline-flex min-h-11 items-center justify-center rounded-[6px] border border-[var(--color-olive)]/45 px-5 py-2 text-sm uppercase tracking-[0.12em] text-[var(--color-olive)] transition hover:border-[var(--color-gold)] hover:text-[var(--color-terracotta)]"
            >
              {content.cta}
            </a>
          </div>
        </motion.header>

        <div className="relative mx-auto h-[520px] w-full max-w-[560px]">
          <InvitationLayer index={0} className="translate-x-7 translate-y-7 opacity-65">
            <div className="h-full rounded-[6px] border border-[var(--color-olive)]/12" />
          </InvitationLayer>
          <InvitationLayer index={1} className="translate-x-3 translate-y-3 opacity-80">
            <div className="h-full rounded-[6px] border border-[var(--color-gold)]/20" />
          </InvitationLayer>
          <InvitationLayer index={2}>
            <BotanicalFrame />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-olive)]">Boda</p>
                <p className="font-heading mt-2 text-4xl leading-tight md:text-5xl">{content.title}</p>
              </div>
              <div className="max-w-[240px]">
                <p className="font-editorial text-2xl leading-tight">{content.subtitle}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.14em] text-[var(--color-terracotta)]">{content.date}</p>
              </div>
            </div>
            <AnimatedOrchid className="absolute -right-6 bottom-0 h-[230px] w-[146px] text-[var(--color-olive)]/60 md:h-[255px] md:w-[162px]" />
            <AnimatedOrchid
              mirrored
              className="absolute -left-8 top-4 h-[168px] w-[112px] text-[var(--color-olive)]/58 md:h-[188px] md:w-[124px]"
            />
          </InvitationLayer>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 1.3, delay: shouldReduceMotion ? 0 : 0.35 }}
        className="mx-auto mt-12 flex max-w-[1180px] justify-center lg:justify-start"
      >
        <a
          href="#nuestra-historia"
          className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.16em] text-[var(--color-olive)]"
        >
          <span className="h-px w-14 bg-[var(--color-olive)]/70" aria-hidden />
          Abrir la historia
        </a>
      </motion.div>

      <div className="section-divider" aria-hidden />
    </section>
  );
}
