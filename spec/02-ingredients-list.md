# Spec: Ingredients List

Render `recipe.ingredients` as a list.

## Per Ingredient (`Ingredient` model)
- `quantity` + `unit` + `name` + `preparation` — e.g. `2 cups flour, sifted`
- Unit and preparation are optional; omit if null
- Category (`produce`, `protein`, `dairy`, `pantry`, `spice`, `other`) — optionally used for grouping

## Behavior
- Full list re-renders on `STATE_SNAPSHOT` (covers substitutions and scaling)
- Substituted ingredient replaces the original in-place (same position in list)
- Scaled quantities are pre-calculated by the backend; just display `ingredient.quantity`
