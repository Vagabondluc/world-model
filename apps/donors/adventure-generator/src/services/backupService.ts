import { useCampaignStore } from '../stores/campaignStore';
import { FileSystemStore } from './fileSystemStore';
import type { SessionStateV2 } from '../types/session';
import { isTauri } from '../utils/envUtils';

export class BackupService {
    static async createBackup(sessionState: SessionStateV2): Promise<string> {
        const rootPath = useCampaignStore.getState().rootPath;
        if (!rootPath) {
            throw new Error('No campaign folder selected.');
        }

        const backupsDir = `${rootPath}/backups`;
        await FileSystemStore.ensureDir(backupsDir);

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `session_backup_${timestamp}.json`;
        const backupPath = `${backupsDir}/${filename}`;

        await FileSystemStore.writeFileContent(backupPath, JSON.stringify(sessionState, null, 2));
        return backupPath;
    }

    static async pickBackupFile(): Promise<string | null> {
        return FileSystemStore.openFileDialog('Select Session Backup', ['json']);
    }

    static async loadBackup(backupPath: string): Promise<SessionStateV2> {
        const content = await FileSystemStore.readFileContent(backupPath);
        return JSON.parse(content) as SessionStateV2;
    }

    static async pickBackupData(): Promise<SessionStateV2 | null> {
        if (isTauri()) {
            const backupPath = await this.pickBackupFile();
            if (!backupPath) return null;
            return this.loadBackup(backupPath);
        }

        return new Promise((resolve) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json,application/json';
            input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) {
                    resolve(null);
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const result = event.target?.result;
                        if (typeof result === 'string') {
                            resolve(JSON.parse(result) as SessionStateV2);
                            return;
                        }
                    } catch {
                        // Fall through to resolve null.
                    }
                    resolve(null);
                };
                reader.readAsText(file);
            };
            input.click();
        });
    }
}
