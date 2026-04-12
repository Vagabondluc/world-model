import { recordFeedback } from './runtime-feedback.js';

// Checks that all active tasks in todo.md have a Decision ID linked.
export async function verifyTodoDocs() {
    try {
        // Assumes docs/todo.md is served statically by the environment
        const response = await fetch('docs/todo.md');
        if (!response.ok) throw new Error(`Could not fetch docs/todo.md: ${response.statusText}`);
        const text = await response.text();
        
        const lines = text.split('\n');
        let activeTasks = 0;
        let missingDecisions = 0;

        // Regex to match tasks that are NOT 'Done' in the new checklist format.
        // Format: - [ ] {T-XXX} [Status] (DEC-XXX) Description
        // Matches: - [ ] {T-001} [Untouched] (DEC-001) ...
        // Capture 1: Task ID {T-XXX}
        // Capture 2: Status [Untouched|In Progress|Blocked|Bug]
        // Capture 3: Decision ID (DEC-XXX) or empty ()
        const activeTaskRegex = /-\s*\[.?\]\s*\{(T-\d+)\}\s*\[(Untouched|In Progress|Blocked|Bug)\]\s*\((DEC-\d+|)\)/;

        for (const line of lines) {
            const match = line.match(activeTaskRegex);
            if (match) {
                activeTasks++;
                // match[3] is the Decision ID group. If it's empty, it's missing.
                if (!match[3] || match[3].trim() === '') {
                    missingDecisions++;
                    console.warn(`%c[Verify] Active task ${match[1]} (${match[2]}) is missing a Decision ID.`, 'color: red');
                }
            }
        }

        if (missingDecisions > 0) {
            recordFeedback('FAIL', 'DocsVerification', `Found ${missingDecisions} active tasks without Decision IDs.`);
            return false;
        } else {
             recordFeedback('PASS', 'DocsVerification', `Verified ${activeTasks} active tasks. All have Decision IDs.`);
             return true;
        }

    } catch (e) {
        recordFeedback('FAIL', 'DocsVerification', e.message);
        console.error(e);
        return false;
    }
}
