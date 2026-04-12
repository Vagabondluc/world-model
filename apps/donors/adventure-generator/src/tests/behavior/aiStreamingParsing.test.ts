import { describe, it, expect, vi, beforeEach } from 'vitest';
const httpFetch = vi.hoisted(() => vi.fn());

vi.mock('../../utils/httpUtils', () => ({
    httpFetch
}));

import { OpenAIImpl } from '../../services/ai/openaiImpl';
import { ClaudeImpl } from '../../services/ai/claudeImpl';
import { OllamaImpl } from '../../services/ai/ollamaImpl';

const makeStreamResponse = (chunks: string[]) => {
    const encoder = new TextEncoder();
    const encoded = chunks.map(chunk => encoder.encode(chunk));
    let index = 0;
    const reader = {
        read: vi.fn().mockImplementation(() => {
            if (index >= encoded.length) {
                return Promise.resolve({ done: true, value: undefined });
            }
            const value = encoded[index++];
            return Promise.resolve({ done: false, value });
        })
    };

    return {
        ok: true,
        body: {
            getReader: () => reader
        }
    } as any;
};

describe('AI provider streaming parsing', () => {
    beforeEach(() => {
        httpFetch.mockReset();
    });

    it('parses OpenAI SSE stream chunks', async () => {
        httpFetch.mockResolvedValueOnce(makeStreamResponse([
            'data: {"choices":[{"delta":{"content":"Hello "}}]}\n\n',
            'data: {"choices":[{"delta":{"content":"world"}}]}\n\n',
            'data: [DONE]\n\n'
        ]));

        const impl = new OpenAIImpl('https://api.openai.com/v1', 'test-key');
        const onProgress = vi.fn();
        const result = await impl.streamText('prompt', 'gpt-test', undefined, onProgress);

        expect(result).toBe('Hello world');
        expect(onProgress).toHaveBeenCalledTimes(2);
        expect(onProgress).toHaveBeenLastCalledWith('Hello world');
    });

    it('parses Claude SSE stream chunks', async () => {
        httpFetch.mockResolvedValueOnce(makeStreamResponse([
            'data: {"type":"content_block_delta","delta":{"text":"Hello "}}\n\n',
            'data: {"type":"content_block_delta","delta":{"text":"world"}}\n\n'
        ]));

        const impl = new ClaudeImpl('test-key');
        const onProgress = vi.fn();
        const result = await impl.streamText('prompt', 'claude-test', undefined, onProgress);

        expect(result).toBe('Hello world');
        expect(onProgress).toHaveBeenCalledTimes(2);
        expect(onProgress).toHaveBeenLastCalledWith('Hello world');
    });

    it('parses Ollama JSON line stream chunks', async () => {
        httpFetch.mockResolvedValueOnce(makeStreamResponse([
            '{"message":{"content":"Hello "},"done":false}\n',
            '{"message":{"content":"world"},"done":true}\n'
        ]));

        const impl = new OllamaImpl('http://localhost:11434', 'llama3');
        const onProgress = vi.fn();
        const result = await impl.streamText('prompt', 'llama3', undefined, onProgress);

        expect(result).toBe('Hello world');
        expect(onProgress).toHaveBeenCalledTimes(2);
        expect(onProgress).toHaveBeenLastCalledWith('Hello world');
    });
});
