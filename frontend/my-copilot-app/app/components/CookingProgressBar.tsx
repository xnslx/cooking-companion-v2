'use client';

import { motion } from 'framer-motion';

interface CookingProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function CookingProgressBar({ currentStep, totalSteps }: CookingProgressBarProps) {
  if (totalSteps === 0) return null;
  const percent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="sticky top-0 z-10 bg-zinc-50/90 backdrop-blur-sm py-3">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        </div>
        <span className="shrink-0 text-xs font-medium text-gray-500 w-20 text-right">
          {currentStep === 0 ? 'Not started' : `Step ${currentStep} of ${totalSteps}`}
        </span>
      </div>
    </div>
  );
}
