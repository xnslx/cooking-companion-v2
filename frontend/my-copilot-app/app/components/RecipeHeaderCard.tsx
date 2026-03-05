'use client';

import { Recipe } from '../types';

const DIFFICULTY_STYLES = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800',
};

function TimeDisplay({ label, minutes }: { label: string; minutes: number | null }) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const display = h > 0 ? `${h}h ${m > 0 ? `${m}m` : ''}`.trim() : `${m}m`;
  return (
    <div className="text-sm text-gray-600">
      <span className="font-medium">{label}:</span> {display}
    </div>
  );
}

export function RecipeHeaderCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{recipe.title}</h1>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${DIFFICULTY_STYLES[recipe.difficulty]}`}
        >
          {recipe.difficulty}
        </span>
      </div>

      {recipe.description && (
        <p className="text-gray-600 text-sm">{recipe.description}</p>
      )}

      <div className="flex flex-wrap gap-4">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Servings:</span>{' '}
          {recipe.servings}
          {recipe.original_servings && recipe.original_servings !== recipe.servings && (
            <span className="ml-1 text-gray-400">(originally {recipe.original_servings})</span>
          )}
        </div>
        <TimeDisplay label="Prep" minutes={recipe.prep_time_minutes} />
        <TimeDisplay label="Cook" minutes={recipe.cook_time_minutes} />
        {recipe.cuisine && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Cuisine:</span> {recipe.cuisine}
          </div>
        )}
      </div>

      {recipe.dietary_tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {recipe.dietary_tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
