# Spec: Cooking Steps

Render `recipe.steps` in order.

## Per Step (`RecipeStep` model)
- Step number: `step.step_number`
- Instruction: `step.instruction`
- Duration: `step.duration_minutes` (optional, show as timer hint if present)
- Timer label: `step.timer_label` (optional label for a timer button)
- Requires attention flag: `step.requires_attention` (highlight if true)
- Tips: `step.tips` (optional list of tip strings)

## Active Step
- Active step = `RecipeContext.current_step` (0-indexed)
- Steps before active step: marked as completed
- Active step: highlighted
- Steps after: default/inactive state

## Behavior
- Re-renders on `STATE_SNAPSHOT` (agent calls `update_cooking_progress`)
- User can say "next step" / "done" in chat — agent updates `current_step` via tool
