import type { PropsWithChildren } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface InvitationLayerProps extends PropsWithChildren {
  index: number;
  className?: string;
}

function cx(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function InvitationLayer({ index, className, children }: InvitationLayerProps) {
  const shouldReduceMotion = useReducedMotion();
  const rotate = shouldReduceMotion ? 0 : (index - 2) * 1.8;

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 28 + index * 18, rotate }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, amount: 0.7 }}
      transition={{ duration: shouldReduceMotion ? 0 : 1.2, delay: shouldReduceMotion ? 0 : index * 0.12 }}
      className={cx("paper-surface absolute inset-0 rounded-[8px] p-6 md:p-8", className)}
    >
      {children}
    </motion.div>
  );
}
