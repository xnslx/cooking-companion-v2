'use client';

import { useCoAgent } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import { AnimatePresence, motion } from 'framer-motion';
import { RecipeHeaderCard } from './components/RecipeHeaderCard';
import { IngredientsList } from './components/IngredientsList';
import { CookingSteps } from './components/CookingSteps';
import { RecipeUpload } from './components/RecipeUpload';
import { CookingProgressBar } from './components/CookingProgressBar';
import { PageLoadAnimation } from './components/PageLoadAnimation';
import { RecipeContext } from './types';
import { useState } from 'react';

export default function Home() {
  const { state, setState, running } = useCoAgent<RecipeContext>({
    name: 'recipe_agent',
  });
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {!introComplete && <PageLoadAnimation onComplete={() => setIntroComplete(true)} />}
      <main className="flex-1 p-8 max-w-3xl mx-auto space-y-6">
        <AnimatePresence mode="wait">
          {state?.recipe ? (
            <motion.div
              key="recipe"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              <CookingProgressBar
                currentStep={state.current_step}
                totalSteps={state.recipe.steps.length}
              />

              {[
                <RecipeHeaderCard key="header" recipe={state.recipe} />,
                <motion.div
                  key="ingredients"
                  animate={{ opacity: running ? 0.6 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <IngredientsList ingredients={state.recipe.ingredients} />
                </motion.div>,
                <CookingSteps
                  key="steps"
                  steps={state.recipe.steps}
                  currentStep={state.current_step}
                />,
              ].map((panel, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: 'easeOut',
                    delay: i * 0.1,
                  }}
                >
                  {panel}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <RecipeUpload onUpload={(ctx) => setState(ctx)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <CopilotSidebar onSetOpen={() => {}} />
    </div>
  );
}
