# Spec: Error Handling

Graceful, informative error states for upload failures, agent errors, and network issues.

## Error Categories

| Category       | Trigger                                                   |
|----------------|-----------------------------------------------------------|
| Upload failure | File too large, unsupported type, parse failure, 4xx/5xx |
| Agent error    | Backend 5xx during chat, agent tool crash, timeout       |
| Network issue  | Fetch throws (no connection, CORS, DNS failure)          |
| Transcription  | Whisper API failure, mic permission denied               |

---

## Upload Errors

### Inline error in drop zone (already partially exists)
- Shown below the file name in the drop zone
- Red text (#f70000), 12.5px
- Error clears when user removes the file or selects a new one

### Error types & messages
| Condition                         | Message                                              |
|-----------------------------------|------------------------------------------------------|
| File > 10 MB                      | "File is too large (max 10 MB)"                      |
| Unsupported extension             | "Only PDF and TXT files are supported"               |
| Backend 4xx                       | "Upload failed — check the file and try again"       |
| Backend 5xx                       | "Server error — the backend may be down"             |
| No recipe found in response       | "Could not parse a recipe from this file"            |
| Network error (fetch throws)      | "No connection — check your network and try again"   |

### File validation (client-side, before fetch)
- Check file size < 10 MB before posting
- Check extension is `.pdf` or `.txt`
- Show error immediately, do not start upload

---

## Agent / Chat Errors

### Error banner in chat panel header
- Appears below the "Recipe Assistant" header when an agent error occurs
- Amber background (#fef3c7), amber border (#fcd34d), amber text (#92400e)
- Message: "The assistant ran into an issue. Try sending your message again."
- Dismiss button (×) on the right
- Animates in: slide down + fade (200ms)
- Auto-dismisses after 8 seconds

### Detecting agent errors
- `CopilotChat` has an `onInProgress` prop — when `inProgress` goes from `true` to `false` but no new assistant message arrived, treat as a silent failure
- Alternatively, wrap fetch calls in try/catch and surface via a shared error state

---

## Network Issue Toast

### Offline detection
- Listen to `window` `online` / `offline` events
- When offline: show a fixed toast at the top of the screen
  - Dark background (#1c1c1e), white text, WiFi-off icon
  - Message: "You're offline — changes won't be saved"
  - Stays visible until back online
- When back online: toast changes to "Back online" (green), auto-dismisses after 3s

### Failed fetch (non-offline)
- If a fetch throws a non-offline network error, show the same inline error as the upload zone or agent banner depending on context

---

## Empty / Degraded States

### Backend unreachable on load
- The chat panel shows a subtle inline notice: "Could not connect to the assistant"
- Does not block the upload UI — user can still browse example recipes

### Upload endpoint down
- Same as Backend 5xx upload error above

---

## Error Component: `ErrorToast`

- Location: `app/components/ErrorToast.tsx`
- Props: `message: string`, `type: 'offline' | 'online' | 'error'`, `onDismiss?: () => void`
- Renders as a fixed banner at the very top of the viewport (above nav), `z-index: 100`
- Animates in from top: `y: -40 → 0`, opacity 0 → 1, 220ms ease-out
- Animates out: reverse

---

## Error Hook: `useNetworkStatus`

- Location: `app/hooks/useNetworkStatus.ts`
- Returns `{ isOnline: boolean }`
- Listens to `window.addEventListener('online' | 'offline')`
- Initial value from `navigator.onLine`

---

## Implementation Notes

- All error state lives in `page.tsx` (upload error already exists as `error` state)
- Add `agentError` state for chat panel banner
- Add `useNetworkStatus` hook and render `ErrorToast` conditionally
- Client-side file validation runs in `handleFileChange` and `handleDrop` before setting `uploadedFile`
- No new dependencies required
