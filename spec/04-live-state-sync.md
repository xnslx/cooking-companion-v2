# Spec: Live State Sync

All recipe UI reads from `RecipeContext` via CopilotKit shared state.

## State Shape (`RecipeContext`)
- `recipe` — full `Recipe` object (null until upload)
- `current_step` — int, 0-indexed active cooking step
- `scaled_servings` — int or null
- `checked_ingredients` — list of ingredient names marked as checked
- `cooking_started` — bool
- `document_text` — raw source text (not displayed)

## Sync Mechanism
- Use `useCoAgent<RecipeContext>({ name: "recipe_agent" })` to subscribe to state
- Every agent tool call (`scale_recipe`, `substitute_ingredient`, `update_cooking_progress`) returns a `StateSnapshotEvent`
- CopilotKit automatically merges the snapshot into shared state
- All panels re-render reactively — no manual polling or refresh needed
