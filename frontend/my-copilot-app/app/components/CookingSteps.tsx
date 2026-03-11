'use client';

import { motion } from 'framer-motion';
import { RecipeStep } from '../types';

export function CookingSteps({
  steps,
  currentStep,
  onStepToggle,
}: {
  steps: RecipeStep[];
  currentStep: number;
  onStepToggle?: (newStep: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Steps</h2>
      <ol className="space-y-4">
        {steps.map((step) => {
          const isDone = step.step_number <= currentStep;
          const isActive = step.step_number - 1 === currentStep;

          const handleToggle = () => {
            if (!onStepToggle) return;
            // Checking: mark this step done → currentStep = step_number
            // Unchecking: revert to just before this step → currentStep = step_number - 1
            onStepToggle(isDone ? step.step_number - 1 : step.step_number);
          };

          return (
            <motion.li
              key={step.step_number}
              layout
              animate={{
                opacity: isDone ? 0.5 : 1,
                scale: isActive ? 1.01 : 1,
              }}
              transition={{ duration: 0.25 }}
              className={`flex gap-4 rounded-xl p-4 transition-colors ${
                isActive
                  ? 'bg-blue-50 border border-blue-200'
                  : isDone
                  ? ''
                  : 'bg-gray-50'
              }`}
            >
              {/* Step number badge */}
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isActive
                    ? 'bg-blue-500 text-white'
                    : isDone
                    ? 'bg-green-400 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {isDone ? '✓' : step.step_number}
              </div>

              <div className="flex-1 space-y-1">
                <p
                  className={`text-sm ${
                    isActive ? 'font-medium text-gray-900' : 'text-gray-700'
                  }`}
                >
                  {step.instruction}
                </p>

                <div className="flex flex-wrap gap-3">
                  {step.duration_minutes && (
                    <span className="text-xs text-gray-400">
                      ⏱ {step.duration_minutes} min{step.timer_label ? ` · ${step.timer_label}` : ''}
                    </span>
                  )}
                  {step.requires_attention && (
                    <span className="text-xs font-medium text-amber-600">⚠ Needs attention</span>
                  )}
                </div>

                {step.tips.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {step.tips.map((tip, i) => (
                      <li key={i} className="text-xs text-blue-600">
                        💡 {tip}
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  onClick={handleToggle}
                  className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-all ${
                    isDone
                      ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'
                      : 'border-gray-300 bg-white text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {isDone ? (
                    <>
                      <span>✓</span> Done — undo?
                    </>
                  ) : (
                    <>
                      <span className="text-base leading-none">○</span> Mark as done
                    </>
                  )}
                </button>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
