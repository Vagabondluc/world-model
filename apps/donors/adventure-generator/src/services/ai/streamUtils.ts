export type StreamLineHandler = (line: string) => boolean | Promise<boolean>;

export const readStreamLines = async (
    reader: ReadableStreamDefaultReader<Uint8Array>,
    onLine: StreamLineHandler
): Promise<void> => {
    const decoder = new TextDecoder();
    let buffer = '';
    let shouldStop = false;

    while (!shouldStop) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() ?? '';

        for (const line of lines) {
            if (!line.trim()) continue;
            shouldStop = await onLine(line);
            if (shouldStop) break;
        }
    }

    if (!shouldStop && buffer.trim()) {
        await onLine(buffer);
    }
};
