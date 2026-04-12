
import { AnySessionState, SessionStateV2 } from '../types/session';

export class SessionManager {
    private static saveFile(content: string, filename: string, type: string): void {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    static saveMarkdownFile(content: string, filename: string): void {
        SessionManager.saveFile(content, filename, 'text/markdown');
    }

    static saveSession(sessionState: SessionStateV2): void {
        const sessionJson = JSON.stringify(sessionState, null, 2);
        const worldName = sessionState.campaignState.config.worldName?.trim() || 'untitled_campaign';
        const safeWorldName = worldName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `${safeWorldName}_session_${new Date().toISOString().slice(0, 10)}.json`;
        SessionManager.saveFile(sessionJson, filename, 'application/json');
    }

    static loadSession(
        onLoad: (sessionState: AnySessionState) => void,
        onError: (error: string) => void
    ): void {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const result = event.target?.result;
                    if (typeof result === 'string') {
                        const sessionData: AnySessionState = JSON.parse(result);
                        // The consumer of loadSession is responsible for version handling.
                        onLoad(sessionData);
                    }
                } catch (err) {
                    console.error("Failed to load session:", err);
                    onError(`Failed to load session: ${(err as Error).message}`);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }
}
