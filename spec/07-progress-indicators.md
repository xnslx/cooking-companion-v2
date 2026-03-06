# Spec: Progress Indicators

Visual feedback for cooking progress and async operations.

## Cooking Progress Bar
- Sticky bar at the top of the recipe view
- Shows: `current_step / total_steps` as a filled progress bar
- Label: "Step 2 of 6" next to the bar
- Updates instantly when `current_step` changes

## Upload Loading State
- Spinner shown while file is uploading and being parsed
- Label cycles between "Uploading...", "Parsing recipe...", "Almost done..." on a timer

## Step Completion Tracker
- Each step number badge shows: empty circle (upcoming), blue filled (active), green checkmark (done)
- Matches the progress bar so both stay in sync

## Agent Thinking Indicator
- While the agent is processing a chat request, show a subtle pulsing indicator on the recipe panel being affected (e.g., pulse the ingredients card while a substitution runs)
