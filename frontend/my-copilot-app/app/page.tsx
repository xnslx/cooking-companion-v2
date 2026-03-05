'use client';

import { useCoAgent } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import { RecipeHeaderCard } from './components/RecipeHeaderCard';
import { IngredientsList } from './components/IngredientsList';
import { CookingSteps } from './components/CookingSteps';
import { RecipeUpload } from './components/RecipeUpload';
import { RecipeContext } from './types';

export default function Home() {
  const { state, setState } = useCoAgent<RecipeContext>({ name: 'recipe_agent' });

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <main className="flex-1 p-8 max-w-3xl mx-auto space-y-6">
        {state?.recipe ? (
          <>
            <RecipeHeaderCard recipe={state.recipe} />
            <IngredientsList ingredients={state.recipe.ingredients} />
            <CookingSteps steps={state.recipe.steps} currentStep={state.current_step} />
          </>
        ) : (
          <RecipeUpload onUpload={(ctx) => setState(ctx)} />
        )}
      </main>
      <CopilotSidebar onSetOpen={() => {}} />
    </div>
  );
}
