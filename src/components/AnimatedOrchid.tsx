import { motion, useReducedMotion } from "framer-motion";

interface AnimatedOrchidProps {
  className?: string;
  mirrored?: boolean;
}

export default function AnimatedOrchid({ className, mirrored = false }: AnimatedOrchidProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.svg
      viewBox="0 0 220 360"
      aria-hidden
      className={className}
      style={{ transform: mirrored ? "scaleX(-1)" : undefined }}
      animate={shouldReduceMotion ? undefined : { y: [0, -7, 0], rotate: mirrored ? [2, 0, 2] : [-2, 0, -2] }}
      transition={
        shouldReduceMotion
          ? undefined
          : {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }
      }
    >
      <path
        d="M40 348C42 290 59 250 94 200C122 160 157 139 188 118"
        stroke="color-mix(in oklab, var(--color-olive) 65%, white)"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M129 144C126 131 129 116 143 104C157 92 174 96 182 107C188 117 184 132 168 141C153 149 139 146 129 144Z"
        fill="none"
        stroke="color-mix(in oklab, var(--color-olive) 65%, white)"
        strokeWidth="1.5"
      />
      <path
        d="M114 179C105 168 100 151 109 137C119 121 138 118 150 128C161 137 161 155 148 169C136 182 123 181 114 179Z"
        fill="none"
        stroke="color-mix(in oklab, var(--color-olive) 65%, white)"
        strokeWidth="1.5"
      />
      <path
        d="M79 212C68 205 58 192 61 174C65 157 82 148 97 153C111 159 116 175 108 191C101 206 88 212 79 212Z"
        fill="none"
        stroke="color-mix(in oklab, var(--color-olive) 65%, white)"
        strokeWidth="1.5"
      />
      <circle
        cx="104"
        cy="180"
        r="4"
        fill="color-mix(in oklab, var(--color-gold) 60%, var(--color-olive))"
      />
      <path
        d="M172 129C182 123 194 126 201 135"
        stroke="color-mix(in oklab, var(--color-gold) 58%, var(--color-olive))"
        strokeWidth="1.2"
        fill="none"
      />
    </motion.svg>
  );
}
