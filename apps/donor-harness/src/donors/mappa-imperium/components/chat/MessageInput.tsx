import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Send, Smile, Paperclip } from 'lucide-react';
import { componentStyles } from '../../design/tokens';

interface MessageInputProps {
    onSend: (content: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        onSend(message);
        setMessage('');
    };

    return (
        <form onSubmit={handleSubmit} className="border-t border-stone-200 pt-3 flex items-end gap-2 bg-stone-50 p-2">
            <div className="flex gap-1">
                <button type="button" className="text-stone-400 hover:text-stone-600 p-1.5 rounded hover:bg-stone-200 transition-colors">
                    <Paperclip className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-grow relative">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className={cn(componentStyles.input.base, "w-full py-2 pr-8 text-sm max-h-32 rounded-xl bg-white focus:ring-1")}
                />
                <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-600 transition-colors"
                >
                    <Smile className="w-4 h-4" />
                </button>
            </div>

            <Button
                type="submit"
                variant="primary"
                size="sm"
                className="rounded-xl h-10 px-3 shadow-sm bg-amber-700 hover:bg-amber-600"
                disabled={!message.trim()}
            >
                <Send className="w-4 h-4" />
            </Button>
        </form>
    );
};

export default MessageInput;
