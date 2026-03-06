# Spec: Micro-interactions

Small delightful details that make the UI feel alive.

## Ingredient Check-off
- Each ingredient has a checkbox
- Checking an ingredient crosses out the text and dims the row
- Uses `checked_ingredients` from `RecipeContext` (persisted in agent state)
- Satisfying check animation: scale bounce on the checkbox icon

## Step Tap to Advance
- Tapping the active step card shows a "Mark as done" button
- On click: step advances, triggers `update_cooking_progress` via chat action
- Button press: brief scale-down (0.95) then snap back

## Servings Stepper
- +/- buttons next to the servings count on the header card
- On click: triggers `scale_recipe` via chat action
- Button press: small scale animation, number flips to new value

## Difficulty Badge Tooltip
- Hovering the difficulty badge shows a tooltip explaining what "medium" means for this recipe (e.g., estimated skill level)

## Upload Drop Zone
- On drag-over: border pulses blue, background shifts, upload icon bounces
- On successful parse: brief green flash before transitioning to recipe view
- On error: border flashes red, shakes horizontally (3 cycles, 300ms)
