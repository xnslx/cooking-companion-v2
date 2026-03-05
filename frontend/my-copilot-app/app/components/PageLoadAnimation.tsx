'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const INGREDIENTS = [
  { emoji: '🍅', left: '3%',  delay: 0.5,  rotation: -25, stiffness: 70,  damping: 9  },
  { emoji: '🧄', left: '13%', delay: 0.1,  rotation: 18,  stiffness: 90,  damping: 11 },
  { emoji: '🥕', left: '22%', delay: 0.75, rotation: -12, stiffness: 60,  damping: 8  },
  { emoji: '🌶️', left: '31%', delay: 0.2,  rotation: 22,  stiffness: 100, damping: 10 },
  { emoji: '🧅', left: '41%', delay: 0.6,  rotation: -20, stiffness: 75,  damping: 12 },
  { emoji: '🫚', left: '50%', delay: 0.05, rotation: 14,  stiffness: 85,  damping: 9  },
  { emoji: '🍋', left: '59%', delay: 0.4,  rotation: -18, stiffness: 65,  damping: 10 },
  { emoji: '🫛', left: '68%', delay: 0.15, rotation: 10,  stiffness: 95,  damping: 11 },
  { emoji: '🍄', left: '77%', delay: 0.55, rotation: -15, stiffness: 72,  damping: 8  },
  { emoji: '🌽', left: '86%', delay: 0.3,  rotation: 25,  stiffness: 88,  damping: 10 },
];

export function PageLoadAnimation({ onComplete }: { onComplete: () => void }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // let last ingredient land + settle, then fade the overlay out
    const hideTimer = setTimeout(() => setShow(false), 3200);
    const doneTimer = setTimeout(onComplete, 3700); // after fade-out
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 bg-zinc-50 overflow-hidden pointer-events-none"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {INGREDIENTS.map((ing) => (
            <motion.div
              key={ing.emoji}
              className="absolute select-none"
              style={{ left: ing.left, fontSize: '16rem', lineHeight: 1 }}
              initial={{ y: 'calc(-16rem - 40px)', rotate: ing.rotation, opacity: 1 }}
              animate={{ y: 'calc(100vh - 260px)', rotate: 0 }}
              transition={{
                delay: ing.delay,
                type: 'spring',
                stiffness: ing.stiffness,
                damping: ing.damping,
                mass: 3,
                velocity: 6,
              }}
            >
              {ing.emoji}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
