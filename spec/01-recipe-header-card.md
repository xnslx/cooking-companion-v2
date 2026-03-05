# Spec: Recipe Header Card

Display after a recipe is uploaded (`RecipeContext.recipe` is not null).

## Fields
- Title: `recipe.title`
- Description: `recipe.description`
- Prep time: `recipe.prep_time_minutes`
- Cook time: `recipe.cook_time_minutes`
- Servings: `recipe.servings` (updates live when `scale_recipe` tool runs)
- Original servings: `recipe.original_servings` (show when different from current)
- Difficulty badge: `recipe.difficulty` — one of `easy`, `medium`, `hard`
- Cuisine: `recipe.cuisine`
- Dietary tags: `recipe.dietary_tags` (list of strings, e.g. `vegetarian`, `gluten-free`)

## Behavior
- Re-renders automatically on any `STATE_SNAPSHOT` event
- Servings count reflects scaled value after agent calls `scale_recipe`
