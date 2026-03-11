# Spec: Session Persistence via threadId

Link the upload session to the chat agent so state persists across reconnects and page refreshes.

## Problem

The backend generates a `threadId` on every `/upload` response but the frontend discards it.
`<CopilotKit>` in `layout.tsx` has no `threadId` prop, so every chat interaction starts a
brand new session. The agent cannot resume a previous conversation or maintain continuity
between the upload parse and the subsequent chat.

## Goal

After uploading a recipe, the `threadId` returned by the backend is stored and passed to
`<CopilotKit threadId={...}>`. This ties the chat session to the specific upload, allowing
the agent to maintain state across reconnects.

---

## Data Flow

```
User uploads file
  → POST /upload
  → Backend returns { threadId, runId, state: RecipeContext }
  → Frontend stores threadId in React state
  → threadId passed to <CopilotKit threadId={threadId}>
  → CopilotKit sends threadId on every subsequent agent request
  → Agent can resume and persist state for that thread
```

---

## Implementation

### 1. Store `threadId` in `page.tsx`

Add state:
```ts
const [threadId, setThreadId] = useState<string | undefined>(undefined);
```

After successful upload, save it alongside the recipe state:
```ts
const data = await res.json();
setState(data.state);
setThreadId(data.threadId);
```

Same for `submitExampleRecipe`.

### 2. Pass `threadId` to `<CopilotKit>`

`CopilotKit` is currently in `layout.tsx` which is a server component wrapper — it cannot
receive dynamic client state directly.

**Solution**: Move `<CopilotKit>` into `page.tsx` (client component), wrapping the page
content. Remove it from `layout.tsx`.

`layout.tsx` becomes a plain layout wrapper (no CopilotKit).
`page.tsx` renders `<CopilotKit runtimeUrl="/api/copilotkit" agent="recipe_agent" threadId={threadId}>`
around its content, re-rendering with the correct `threadId` once it's known.

### 3. Reset on new upload

When a user uploads a new recipe:
- Call `setThreadId(data.threadId)` with the new value
- CopilotKit re-mounts with the new `threadId`, starting a fresh linked session
- Clear previous `state` and `agentError`

### 4. Persistence across page refresh (optional / future)

- Store `threadId` in `sessionStorage` on set
- Restore it on mount via `useEffect`
- This allows the session to survive a browser refresh within the same tab

---

## Files Changed

| File | Change |
|------|--------|
| `app/layout.tsx` | Remove `<CopilotKit>`, keep as plain layout |
| `app/page.tsx` | Add `threadId` state, wrap content with `<CopilotKit threadId={threadId}>`, save threadId from upload responses |

---

## Acceptance Criteria

- After upload, the `threadId` from the response is stored in state
- `<CopilotKit>` receives the `threadId` prop
- Sending a chat message after upload uses the same thread as the upload
- Uploading a second recipe generates a new `threadId` and starts a fresh session
- No regression in existing chat / state-sync behaviour
