'use client';

import { motion } from 'framer-motion';

const INGREDIENTS = [
  { emoji: '🍅', x: 60, delay: 0 },
  { emoji: '🧄', x: 90, delay: 0.3 },
  { emoji: '🥕', x: 45, delay: 0.6 },
  { emoji: '🌶️', x: 110, delay: 0.9 },
  { emoji: '🧅', x: 75, delay: 1.2 },
  { emoji: '🫚', x: 55, delay: 1.5 },
];

function Ingredient({ emoji, x, delay }: { emoji: string; x: number; delay: number }) {
  return (
    <motion.div
      className="absolute text-xl select-none"
      style={{ left: x, top: 0 }}
      initial={{ y: -10, opacity: 0, rotate: 0 }}
      animate={{
        y: [null, 40, 80, 90],
        opacity: [0, 1, 1, 0],
        rotate: [0, -15, 10, 0],
      }}
      transition={{
        duration: 0.7,
        delay,
        repeat: Infinity,
        repeatDelay: INGREDIENTS.length * 0.3 - 0.7,
        ease: 'easeIn',
      }}
    >
      {emoji}
    </motion.div>
  );
}

export function WokLoadingAnimation({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Ingredient drop zone */}
      <div className="relative w-40 h-32">
        {INGREDIENTS.map((ing) => (
          <Ingredient key={ing.emoji} {...ing} />
        ))}

        {/* Wok */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          animate={{ rotate: [-6, 6, -6] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '80%', originY: '100%' }}
        >
          <svg width="100" height="52" viewBox="0 0 100 52" fill="none">
            {/* Handle */}
            <rect x="72" y="20" width="28" height="7" rx="3.5" fill="#a16207" />
            {/* Wok body */}
            <path
              d="M5 18 Q10 50 50 50 Q90 50 95 18 Z"
              fill="#1c1917"
              stroke="#44403c"
              strokeWidth="2"
            />
            {/* Rim highlight */}
            <ellipse cx="50" cy="18" rx="45" ry="9" fill="#292524" stroke="#57534e" strokeWidth="1.5" />
            {/* Steam shimmer inside */}
            <ellipse cx="50" cy="18" rx="30" ry="5" fill="#3f3f46" opacity="0.4" />
          </svg>
        </motion.div>
      </div>

      {/* Cycling label */}
      <motion.p
        key={label}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.3 }}
        className="text-sm font-medium text-gray-500"
      >
        {label}
      </motion.p>
    </div>
  );
}
