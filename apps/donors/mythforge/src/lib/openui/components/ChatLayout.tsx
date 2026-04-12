import React, { useState } from 'react';

export interface ChatMessage {
  id?: string;
  role?: 'user' | 'assistant' | 'system' | 'agent';
  content: string;
  timestamp?: string;
}

interface ChatLayoutProps {
  messages: ChatMessage[];
  onSend: (_message: string) => void;
  isLoading?: boolean;
  streamingContent?: string;
}

export default function ChatLayout({ messages, onSend, isLoading, streamingContent }: ChatLayoutProps) {
  const [input, setInput] = useState('');

  const submit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput('');
  };

  return (
    <div style={{ border: '1px solid #e6e6e6', padding: 12, borderRadius: 6, maxWidth: 720 }}>
      <div style={{ maxHeight: 320, overflow: 'auto', paddingBottom: 8 }}>
        {messages.map((m, i) => (
          <div key={m.id ?? `${i}-${m.role ?? 'msg'}`} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 12, color: '#888' }}>{m.role ?? 'user'}</div>
            <div style={{ padding: 8, background: '#fafafa', borderRadius: 6 }}>{m.content}</div>
          </div>
        ))}

        {isLoading && streamingContent && (
          <div style={{ marginTop: 6, fontStyle: 'italic', color: '#444' }}>{streamingContent}</div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
          placeholder="Type a message"
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={submit}>Send</button>
      </div>
    </div>
  );
}
