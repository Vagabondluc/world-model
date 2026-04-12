# Project Documentation Charter

This file explains the **purpose of every document and folder** in the `/docs/` directory.  
It defines how the AI should interact with these files, maintain them, and ensure the development process remains consistent and traceable.  

---

## Goals of the Documentation System

- Provide **a living to-do list** (`to_do.md`) that tracks all current tasks with version-controlled entries.  
- Provide **a bug reporting system** (`bug_report.md`) that records user grievances, tracks resolution, and archives completed bugs.  
- Provide **versioning and archiving** so changes can be tracked over time without losing history.  
- Maintain **clarity and cleanliness** by regularly resetting and archiving when files grow too large.  
- Ensure **accountability** by linking every bug and task to a unique identifier and version number.  

---

## File & Folder Responsibilities

### `/docs/to_do.md`
- **Purpose:** Main tracker for UI/UX feedback, tasks, and development roadmap.  
- **Rules:**
  1. Start at version `0.0.1`.  
  2. Every entry must have a unique ID: `TODO-[VERSION]-[SEQUENTIAL NUMBER]`.  
  3. If the file exceeds **200 lines**, archive only the content from the **Completed** section into `/docs/versioning/archive/`, then reset the **Completed** section in the main file. The **Next Up** and **Backlog** sections must always be preserved. Increment the **MINOR** version number after archiving.  
  4. Keep structure: **Next Up**, **Backlog**, **Completed**, **Recurring Instructions**, **Roadmap Links**.  
  5. Ensure "Next Up" has **only one** priority task.  
  6. Ensure backlog contains **only actionable items**.  
  7. Move completed items to **Completed** section.  

---

### `/docs/bug_report.md`
- **Purpose:** Tracks user grievances, issues, and their resolution process.  
- **Rules:**
  1. Every bug has unique ID: `BUG-[VERSION]-[SEQUENTIAL NUMBER]`.  
  2. Each bug must link to the **to_do.md version** where it is expected to be resolved.  
  3. The AI must **ask the user for confirmation** when a fix is believed to be complete.  
  4. Once confirmed, move the bug into `/docs/bug_archive/`.  
  5. If `bug_report.md` exceeds **200 lines**, move oldest closed bugs to `/docs/bug_archive/`.  

---

### `/docs/versioning/`
- **Purpose:** Stores historical snapshots of `to_do.md`.  
- **Structure:**  
  - Each version is saved as `to_do_v[VERSION].md`.  
  - Example: `to_do_v0.0.1.md`.  
  - Contains `/docs/versioning/archive/` for storing bulk-archived content when `to_do.md` resets after 200 lines.  

---

### `/docs/bug_archive/`
- **Purpose:** Stores resolved and confirmed bug reports.  
- **Rules:**
  - Each archived bug file should note:  
    - The bug ID.  
    - The fix that resolved it (linked to a TODO ID).  
    - The version number of `to_do.md` where it was resolved.  
  - Files may be grouped by version (e.g., `bug_archive_v0.0.1.md`).  

---

### `/docs/README.md` (this file)
- **Purpose:** Explains the purpose of the entire system to the AI and developers.  
- **Rules:**  
  - Must never be removed.  
  - Must always be kept up-to-date with any changes to process.  

---

## AI Responsibilities (Team Simulation)

When maintaining these files, the AI must:  

1. **Track Tasks**
   - Ensure every task in `to_do.md` has a unique ID and correct placement.  

2. **Versioning**
   - Increment version numbers correctly when thresholds (200 lines, breaking changes) are reached.  
   - Save snapshots into `/docs/versioning/`.  

3. **Bug Handling**
   - Record new grievances in `bug_report.md`.  
   - Ask the user if a bug is resolved once the linked task is completed.  
   - If resolved, move bug entry into `/docs/bug_archive/`.  

4. **File Maintenance**
   - Keep files concise and clean.  
   - Archive or reset when they exceed size thresholds.  
   - Ensure references between files are correct (e.g., TODO ↔ BUG).  

5. **Communication**
   - Always use natural language with the user.  
   - Be explicit when asking for confirmation about bug resolution.  
   - Never assume a bug is resolved until the user confirms.  

---

## Example Workflow

1. User requests a new feature.  
   → AI logs it in `to_do.md` with ID `TODO-0.0.1-008`.  

2. User finds a bug.  
   → AI logs it in `bug_report.md` with ID `BUG-0.0.1-002`, linking to related TODO if applicable.  

3. Task completed.  
   → AI moves TODO into **Completed**.  
   → AI asks user if bug was resolved.  

4. User confirms bug fix.  
   → AI archives bug into `/docs/bug_archive/`.  
   → Bug entry links to the TODO ID that fixed it and the `to_do.md` version number.  

5. File exceeds 200 lines.  
   → AI archives old content into `/docs/versioning/archive/`.  
   → AI resets file with new version number.  

---

## Current Versioning State
- `to_do.md` → v0.0.1  
- `bug_report.md` → v0.0.1  
- `versioning/` → Initialized  
- `bug_archive/` → Initialized  

---