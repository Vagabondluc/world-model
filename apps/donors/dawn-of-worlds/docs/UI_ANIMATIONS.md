# 🎨 Touch-First Animation System (v1.0)

This document outlines the animation system designed to **communicate state**, not show off. These animations are cheap to run, deterministic, and map cleanly to the existing UX (map, actions, inspector, timeline).

## Core Rule

> **Animations only answer questions.**
> "What just happened?" · "Is this allowed?" · "Where should I look?"

No continuous motion. No idle shimmer. No latency masking.

## 1. Tap Feedback (Immediate Confirmation)

### Use Cases
* Tapping hex
* Selecting action
* Selecting timeline row

### Animation
* **Press scale + opacity**
* Duration: **90–120ms**
* Easing: `cubic-bezier(0.2, 0, 0.2, 1)`

### CSS
```css
.tap-feedback {
  transition: transform 120ms cubic-bezier(0.2,0,0.2,1),
              opacity 120ms cubic-bezier(0.2,0,0.2,1);
}

.tap-feedback:active {
  transform: scale(0.96);
  opacity: 0.85;
}
```

### Why
* Confirms input on touch devices
* Prevents “did it register?” anxiety
* Zero state dependency

## 2. Hex Focus Pulse (Attention Direction)

### Use Cases
* Inspector focuses a hex
* Structured error references a hex
* Search result jumps to hex

### Animation
* **Single pulse ring**
* No looping
* Duration: **600ms**

### CSS
```css
@keyframes hex-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(255,80,80,0.6); }
  100% { box-shadow: 0 0 0 12px rgba(255,80,80,0); }
}

.hex--pulse {
  animation: hex-pulse 600ms ease-out;
}
```

### React Usage
```ts
function pulseHex(hexId) {
  const el = document.getElementById(hexId);
  el?.classList.add("hex--pulse");
  setTimeout(() => el?.classList.remove("hex--pulse"), 600);
}
```

### Why
* Replaces hover
* Answers: *"Where is the problem?"*

## 3. Action Preview Slide-Up (Intent Declaration)

### Use Cases
* Selecting an action on mobile
* Entering preview mode

### Animation
* **Bottom sheet slides up**
* Distance: ~24–32px
* Duration: **180ms**

### CSS
```css
.preview-sheet {
  transform: translateY(32px);
  opacity: 0;
  transition: transform 180ms ease-out, opacity 180ms ease-out;
}

.preview-sheet--open {
  transform: translateY(0);
  opacity: 1;
}
```

### Why
* Communicates mode change (“you’re previewing now”)
* Prevents accidental confirmation
* Thumb-reachable buttons

## 4. Confirm / Reject Feedback (Commit vs Denial)

### 4.1 Confirmed Action

**Animation**
* Map ghost → solid
* Timeline entry fades in

```css
@keyframes confirm-flash {
  0% { background: rgba(100,255,100,0.4); }
  100% { background: transparent; }
}

.confirm-flash {
  animation: confirm-flash 400ms ease-out;
}
```

Apply to:
* affected hexes
* new timeline row

**Why:** Answers *"Did it go through?"* and reinforces trust in server authority.

### 4.2 Rejected Action (Structured Error)

**Animation**
* Shake + red outline
* Duration: **300ms**

```css
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-2px); }
  80% { transform: translateX(2px); }
}

.reject {
  animation: shake 300ms ease-in-out;
  outline: 2px solid #ff4444;
}
```

Apply to:
* preview sheet
* offending hex
* action row

**Why:** Immediate "no" without modal interruption.

## 5. Inspector Card Navigation (Mobile)

### Use Cases
* Hex → World Inspector
* World → Event Inspector
* Back navigation

### Animation
* **Horizontal card slide**
* Direction indicates hierarchy

### CSS
```css
.card {
  transition: transform 220ms ease-out, opacity 220ms ease-out;
}

.card--enter {
  transform: translateX(100%);
  opacity: 0;
}

.card--active {
  transform: translateX(0);
  opacity: 1;
}

.card--exit {
  transform: translateX(-30%);
  opacity: 0;
}
```

### Why
* Matches mental model (“drilling down”)
* No back button confusion

## 6. Timeline Focus Jump (Context Sync)

### Use Cases
* Selecting event from Inspector
* Jumping via search
* Server error references event

### Animation
* **Scroll snap + highlight**
* Duration: **200ms**

```css
.timeline-row--focus {
  background: rgba(80,160,255,0.25);
  transition: background 400ms ease-out;
}
```

### Why
* Answers: *"Which event?"*
* Avoids disorientation in long logs

## 7. End Turn State Transition

### Use Cases
* Ending turn
* New TURN_BEGIN arrives from server

### Animation
* AP meter drains → refills
* Subtle banner slide

```css
.turn-banner {
  animation: slide-down 240ms ease-out;
}
```

### Why
* Confirms authoritative turn change
* Prevents “did my turn end?” confusion

## 8. Performance Rules (Critical)

* ❌ No layout-thrashing (`top/left`)
* ✅ Only `transform` and `opacity`
* ❌ No infinite animations
* ✅ Disable animations if:

```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

## 9. Animation Priority Matrix

| Event      | Animate? | Why                |
| ---------- | -------- | ------------------ |
| Tap        | ✅        | Input confirmation |
| Preview    | ✅        | Mode clarity       |
| Confirm    | ✅        | Trust              |
| Reject     | ✅        | Learning           |
| Idle       | ❌        | Distraction        |
| Background | ❌        | Battery            |

## Result

With these animations:
* Touch feels **precise**
* Errors feel **helpful**
* State changes feel **authoritative**
* UI feels **alive but calm**

This is the sweet spot for a deep, rules-heavy game on mobile.
