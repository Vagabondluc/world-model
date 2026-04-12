import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
import { cn } from '../../utils/cn';
import { useGameStore } from '../../stores/gameStore';

interface MessageListProps {
    messages: ChatMessage[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const { currentPlayer } = useGameStore();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-stone-400 text-sm">
                <p>No messages yet.</p>
                <p className="text-xs">Be the first to say hello!</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto space-y-3 p-1">
            {messages.map((msg) => {
                const isMe = msg.senderName === currentPlayer?.name; // Improve with ID check in real app

                if (msg.type === 'system') {
                    return (
                        <div key={msg.id} className="flex justify-center my-2">
                            <span className="bg-stone-100 text-stone-500 text-[10px] px-2 py-1 rounded-full border border-stone-200">
                                {msg.content}
                            </span>
                        </div>
                    );
                }

                if (msg.type === 'action') {
                    return (
                        <div key={msg.id} className="flex gap-2 items-start px-2 py-1 bg-blue-50/50 rounded border border-blue-100">
                            <span className="text-xs text-blue-800 font-semibold whitespace-nowrap">{msg.senderName}:</span>
                            <span className="text-xs text-blue-900 italic">{msg.content}</span>
                        </div>
                    );
                }

                // Player messages
                return (
                    <div key={msg.id} className={cn("flex flex-col max-w-[85%]", isMe ? "self-end items-end" : "self-start items-start")}>
                        <span className="text-[10px] text-stone-400 mb-0.5 px-1">
                            {msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div className={cn(
                            "px-3 py-2 rounded-2xl text-sm shadow-sm",
                            isMe
                                ? "bg-amber-600 text-white rounded-tr-sm"
                                : "bg-white text-stone-800 border border-stone-200 rounded-tl-sm"
                        )}>
                            {msg.content}
                        </div>
                    </div>
                );
            })}
            <div ref={bottomRef} />
        </div>
    );
};

export default MessageList;
