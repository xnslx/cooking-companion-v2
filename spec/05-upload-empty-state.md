# Spec: Upload / Empty State

Shown when `RecipeContext.recipe` is null.

## Upload Flow
1. User selects a PDF or text file
2. Frontend sends `POST /upload` (multipart form) to backend
3. Backend extracts text, parses it via pydantic-ai, returns initial state:
   - `state.recipe` — parsed `Recipe` object
   - `threadId`, `runId` — for session tracking
4. Frontend hydrates `RecipeContext` with the returned state
5. Recipe Display panels render

## UI
- Show a file upload area when no recipe is loaded
- Accept: `.pdf`, `.txt`
- On success: transition to recipe view
- On failure: show error message (recipe parsing failed)
