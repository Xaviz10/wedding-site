import { motion, useReducedMotion } from "framer-motion";

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

export default function PawPrintDivider() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="flex items-center justify-center gap-2 text-[var(--color-terracotta)]/70"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.9 }}
      aria-hidden
    >
      <PawIcon className="h-5 w-5 rotate-[-8deg]" />
      <PawIcon className="h-4 w-4 translate-y-1" />
      <PawIcon className="h-5 w-5 rotate-[8deg]" />
    </motion.div>
  );
}
