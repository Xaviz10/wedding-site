import type { PropsWithChildren } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface SectionWrapperProps extends PropsWithChildren {
  id: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  className?: string;
  contentClassName?: string;
  hideDivider?: boolean;
  animateContent?: boolean;
}

function cx(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function SectionWrapper({
  id,
  eyebrow,
  title,
  intro,
  className,
  contentClassName,
  hideDivider = false,
  animateContent = true,
  children,
}: SectionWrapperProps) {
  const shouldReduceMotion = useReducedMotion();
  const content = (
    <>
      {(eyebrow || title || intro) && (
        <div className="mb-10 md:mb-14">
          {eyebrow && (
            <p className="mb-3 text-sm uppercase tracking-[0.22em] text-[var(--color-olive)]/85">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="font-heading text-3xl leading-[1.08] md:text-4xl lg:text-5xl">{title}</h2>
          )}
          {intro && <p className="section-caption mt-5 max-w-3xl text-[var(--color-forest)]/86">{intro}</p>}
        </div>
      )}
      {children}
    </>
  );

  return (
    <section id={id} className={cx("relative px-4 py-20 md:px-8 lg:py-28", className)}>
      {animateContent ? (
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1.1 }}
          className={cx("mx-auto max-w-[1180px]", contentClassName)}
        >
          {content}
        </motion.div>
      ) : (
        <div className={cx("mx-auto max-w-[1180px]", contentClassName)}>{content}</div>
      )}
      {!hideDivider && <div className="section-divider" aria-hidden />}
    </section>
  );
}
