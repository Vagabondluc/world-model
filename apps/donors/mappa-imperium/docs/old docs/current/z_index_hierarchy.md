# Z-Index Hierarchy

This document defines the z-index layering strategy for the Mappa Imperium application. Its purpose is to establish a clear, predictable stacking order for all floating, fixed, and absolute-positioned UI elements, preventing visual conflicts and ensuring a consistent user experience.

All z-index values are defined either in the centralized component class library in `index.html` or directly within specific, high-level component files.

## The Golden Rule
When adding a new floating element, it must be assigned a z-index that fits logically within this established hierarchy. Avoid using arbitrary high numbers.

## Stacking Order (Highest to Lowest)

This list represents the visual layers of the application, from front to back.

#### 1. Tooltips (z-1000)
-   **Value**: `1000`
-   **Components**: `ElementTooltip.tsx`, `HelpTooltip.tsx`, Quill.js tooltips (`.ql-tooltip`)
-   **Rationale**: Tooltips must always appear on top of all other content, including open modals and dropdowns, to provide immediate contextual help without being obscured.

#### 2. Dropdown Menus (z-950)
-   **Value**: `950`
-   **CSS Class**: `.dropdown-menu`
-   **Components**: `NavigationHeader.tsx` (Export Menu), `ElementCardDisplay.tsx` (Actions Menu)
-   **Rationale**: Dropdown menus are high-priority interactive elements that need to appear above modals but below the tooltips that might describe their items.

#### 3. Emoji Picker (z-920)
-   **Value**: `920`
-   **Component**: `EmojiPicker.tsx`
-   **Rationale**: The emoji picker is a specialized pop-up that functions like a dropdown but is often triggered from within a modal. It must appear above confirmation modals.

#### 4. Confirmation Modals (z-910)
-   **Value**: `910`
-   **Component**: `ConfirmationModal.tsx`
-   **Rationale**: Confirmation dialogs (e.g., "Are you sure you want to delete?") must appear on top of the modal that triggered them (like the Edit Element modal) to prevent the user from interacting with the underlying modal.

#### 5. Modal Overlay & Content (z-900)
-   **Value**: `900`
-   **CSS Class**: `.modal-overlay`
-   **Components**: `EditElementModal.tsx`, `SettingsModal.tsx`, `UnifiedDebugSystem.tsx`
-   **Rationale**: This is the base layer for all full-screen modal dialogs. It covers the main application content to focus the user's attention.

#### 6. Main Header (z-800)
-   **Value**: `800`
-   **CSS Class**: `.header-main`
-   **Component**: `NavigationHeader.tsx`
-   **Rationale**: The main application header is sticky and must remain on top of the scrolling page content (`<main>`) at all times. All modal and overlay content must appear above it.

---

### Summary Table

| Z-Index | Component/Class                                     | Purpose                                     |
| :------ | :-------------------------------------------------- | :------------------------------------------ |
| `1000`  | Tooltips (`ElementTooltip`, `.ql-tooltip`, etc.)    | Highest layer for contextual help           |
| `950`   | Dropdown Menus (`.dropdown-menu`)                   | For action menus, etc.                      |
| `920`   | Emoji Picker (`EmojiPicker.tsx`)                    | Specialized pop-up, often used in modals    |
| `910`   | Confirmation Modals (`ConfirmationModal.tsx`)       | Dialogs that must appear over other modals  |
| `900`   | Modals & Overlays (`.modal-overlay`)                | Base layer for all modal dialogs            |
| `800`   | Main Header (`.header-main`)                        | Sticky header above page content            |
