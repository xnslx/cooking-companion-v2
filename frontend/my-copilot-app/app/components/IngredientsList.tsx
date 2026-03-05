'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Ingredient } from '../types';

function formatIngredient(ing: Ingredient): string {
  const parts = [];
  if (ing.quantity) parts.push(ing.quantity % 1 === 0 ? String(ing.quantity) : ing.quantity.toString());
  if (ing.unit) parts.push(ing.unit);
  parts.push(ing.name);
  if (ing.preparation) parts.push(`(${ing.preparation})`);
  return parts.join(' ');
}

const CATEGORY_LABELS: Record<Ingredient['category'], string> = {
  produce: 'Produce',
  protein: 'Protein',
  dairy: 'Dairy',
  pantry: 'Pantry',
  spice: 'Spices',
  other: 'Other',
};

export function IngredientsList({ ingredients }: { ingredients: Ingredient[] }) {
  const grouped = ingredients.reduce<Partial<Record<Ingredient['category'], Ingredient[]>>>(
    (acc, ing) => {
      if (!acc[ing.category]) acc[ing.category] = [];
      acc[ing.category]!.push(ing);
      return acc;
    },
    {}
  );

  const categories = Object.keys(grouped) as Ingredient['category'][];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Ingredients</h2>
      {categories.map((cat) => (
        <div key={cat}>
          {categories.length > 1 && (
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
              {CATEGORY_LABELS[cat]}
            </h3>
          )}
          <ul className="space-y-2">
            <AnimatePresence initial={false}>
              {grouped[cat]!.map((ing) => (
                <motion.li
                  key={ing.name}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  {formatIngredient(ing)}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      ))}
    </div>
  );
}
