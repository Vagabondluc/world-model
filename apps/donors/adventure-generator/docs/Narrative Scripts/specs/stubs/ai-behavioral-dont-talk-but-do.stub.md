# Spec stub — ai_behavioral_dont_talk_but_do

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Purpose
- Turn “don’t talk, just do” instructions into a managed task plan with downloadable output, hotkeys, and creative prompts.

API / Inputs
- Don’tTalkRequest {
  currentTaskList?: string,
  userMood?: "positive" | "neutral" | "frustrated",
  hotkeys?: { key: string; action: string }[],
  creativeHint?: string
}

Outputs
- Don’tTalkResponse {
  taskSteps: { id: string; action: string; status: "pending" | "in-progress" | "done" }[],
  downloadLink: string,
  hotkeyGuide: { key: string; meaning: string }[],
  ideationPrompts: { id: string; prompt: string }[]
}

Types
- `interface DontTalkRequest { currentTaskList?: string; userMood?: string; hotkeys?: Hotkey[]; creativeHint?: string }`
- `interface DontTalkResponse { taskSteps: TaskStep[]; downloadLink: string; hotkeyGuide: HotkeyGuide[]; ideationPrompts: IdeationPrompt[] }`
- `interface TaskStep { id: string; action: string; status: "pending" | "in-progress" | "done" }`
- `interface HotkeyGuide { key: string; meaning: string }`
- `interface IdeationPrompt { id: string; prompt: string }`
- `interface ApiError { error: string; code: number; details?: string[] }`

Behavior
- Read `chatGPT_Todo.txt` to reprioritize before every response.
- Summarize previous messages and decompose goals into 3–10 actions.
- Save task list to `chatGPT_Todo.txt` and return a download link before issuing hotkeys or prompts.
- Offer hotkeys mapping (w/s/a/d, variants) and creative multiple-choice prompts to spur novel thinking.

Edge cases
- Missing task list file → generate stub list with placeholders and note file creation.
- File write fails (permissions/offline) → return ApiError with code 503 and fallback instructions.
- Creative prompt limit exceeded → truncate ideation prompts and flag in response.

Mapping to UI
- Task manager displays steps, statuses, and download links.
- Hotkey overlay shows w/s/a/d variants plus double taps (ww/ss).
- Creative prompt panel shows MCQs with decision paths.

Non-functional requirements
- Latency: task list rewrite and file save must complete within 2s.
- Streaming: none required; deliver response atomically after file write.
- Accessibility: steps and hotkey text use high contrast and ARIA labels.
- i18n: support localization keys for hotkey meanings and prompts.

Error handling
- ApiError returned when file I/O fails or request lacks required context.

Test cases
- Valid request writes `chatGPT_Todo.txt`, returns download link, then hotkeys and prompts.
- Missing hotkey definitions default to standard w/s/a/d mapping.
- File write failure triggers ApiError code 503 and fallback message.

Priority
- Medium