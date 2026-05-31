import { motion, useReducedMotion } from "framer-motion";
import SectionWrapper from "../SectionWrapper";
import PawPrintDivider from "../PawPrintDivider";
import type { WeddingContent } from "../../types/wedding";

interface MilkaSectionProps {
  content: WeddingContent["milka"];
}

export default function MilkaSection({ content }: MilkaSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <SectionWrapper
      id="milka"
      eyebrow="Capítulo 03"
      title="Milka"
      intro={content.intro}
      className="bg-[var(--color-ivory)]"
    >
      <PawPrintDivider />
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -22 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1.05 }}
          className="relative mx-auto w-full max-w-[560px]"
        >
          <figure className="paper-surface overflow-hidden rounded-[8px] p-3">
            <div className="aspect-[4/5] overflow-hidden rounded-[6px]">
              <img
                src="https://picsum.photos/seed/milka-main/1200/1500"
                alt="Milka mirando a la cámara"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <figcaption className="section-caption mt-3 text-[var(--color-forest)]/85">
              Milka nos enseñó otra forma de familia: más pausada, más tierna, más presente.
            </figcaption>
          </figure>

          <figure className="paper-surface absolute -bottom-9 -right-4 hidden w-[46%] rounded-[8px] p-2 md:block">
            <div className="aspect-square overflow-hidden rounded-[6px]">
              <img
                src="https://picsum.photos/seed/milka-detail/900/900"
                alt="Huella de Milka sobre manta clara"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </figure>
        </motion.div>

        <div className="grid gap-4">
          {content.moments.map((moment, index) => (
            <motion.article
              key={moment.title}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.95, delay: shouldReduceMotion ? 0 : index * 0.12 }}
              className="paper-surface rounded-[8px] p-6"
            >
              <h3 className="font-heading text-2xl">{moment.title}</h3>
              <p className="section-caption mt-2 text-[var(--color-forest)]/85">{moment.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
