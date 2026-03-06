# Spec: Animated Transitions

Smooth transitions when recipe state changes.

## Recipe View Entry
- When recipe loads after upload, panels fade + slide up into view (staggered: header → ingredients → steps)
- Duration: 300ms ease-out per panel, 100ms stagger between each

## Ingredient Substitution
- Substituted ingredient animates out (fade + slide left), new ingredient slides in from right
- Highlight the changed row in blue for 1.5s then fade to normal

## Servings Scale
- Quantities in the ingredients list animate from old value to new value (number count-up/down)
- Duration: 400ms ease-in-out

## Step Transition
- When active step advances, completed step fades and shrinks slightly
- New active step expands with a blue highlight pulse
- Duration: 250ms

## Upload → Recipe
- Upload area fades out, recipe panels fade in
- Duration: 350ms crossfade
