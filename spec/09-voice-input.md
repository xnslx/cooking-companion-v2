# Spec: Voice Input

Allow users to speak their chat messages instead of typing, transcribed via OpenAI Whisper.

## Overview

A microphone button sits inside the chat input area. Pressing it records the user's voice,
sends the audio to a `/api/transcribe` endpoint (Next.js route → OpenAI Whisper), and
inserts the transcribed text into the chat input field. The user can then review and send it.

---

## UI: Microphone Button

- Rendered inside the CopilotChat input area, to the left of the send button
- Idle state: mic icon, muted color, subtle border
- Recording state:
  - Icon changes to a stop/square icon
  - Button pulses red (scale: 1 → 1.12 → 1, repeat, duration 800ms)
  - A red recording indicator dot appears with a "Recording..." label
  - A live audio level visualizer (5 vertical bars that animate in height based on mic volume)
- Processing state (after stop, before transcript arrives):
  - Button shows a small spinner
  - Input field shows placeholder "Transcribing..."
- On success: transcribed text populates the input field, user can edit before sending
- On error: brief shake animation on the button, tooltip "Could not transcribe. Try again."

---

## Recording Flow

1. User clicks mic button → browser requests microphone permission
2. If permission denied: show inline error "Microphone access required"
3. If granted: begin `MediaRecorder` capture (audio/webm or audio/mp4, browser default)
4. Max recording duration: 60 seconds — auto-stops and transcribes at the limit
5. User clicks stop button (or max duration reached) → recording ends
6. Audio blob is POSTed to `/api/transcribe`
7. Response text is inserted into the chat input

---

## API Route: `POST /api/transcribe`

- Location: `frontend/my-copilot-app/app/api/transcribe/route.ts`
- Accepts: `multipart/form-data` with field `audio` (audio file blob)
- Calls OpenAI Whisper: `openai.audio.transcriptions.create({ model: 'whisper-1', file })`
- Returns: `{ text: string }`
- Error handling: returns `{ error: string }` with appropriate HTTP status
- Uses `OPENAI_API_KEY` from environment (same key as backend)

---

## Component: `VoiceChatInput`

- Location: `frontend/my-copilot-app/app/components/VoiceChatInput.tsx`
- Self-contained: manages recording state, MediaRecorder, and transcription fetch
- Props:
  - `onTranscript(text: string): void` — called when transcription succeeds
- Internal state: `idle | recording | processing | error`
- Cleans up MediaRecorder and audio stream on unmount

---

## Integration with CopilotChat

- CopilotKit's `CopilotChat` accepts a `customInput` prop for replacing the default input bar
- Build a `CustomChatInput` wrapper that:
  - Renders the standard text input
  - Renders the `VoiceChatInput` mic button alongside it
  - When transcript arrives, sets the input value and focuses the field

---

## Animations

- Recording pulse: `scale` keyframe `[1, 1.12, 1]`, repeat, 800ms, ease-in-out
- Audio level bars: 5 bars, each independently animated height (20%–100%) based on `AnalyserNode` data
- Transcript insert: text fades in via opacity 0 → 1 over 200ms
- Error shake: `x: [0, -6, 6, -4, 4, 0]`, duration 350ms

---

## Environment

- `OPENAI_API_KEY` must be set in `frontend/my-copilot-app/.env.local`
- No additional backend changes required — transcription happens in the Next.js API route
