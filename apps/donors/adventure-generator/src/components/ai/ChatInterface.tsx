
import React, { FC, useState, useRef, useEffect } from 'react';
import { css, cx } from '@emotion/css';
import { useAppContext } from '../../context/AppContext';
import { useCampaignStore } from '../../stores/campaignStore';
import { CONFIG } from '../../data/constants';
import { generateId } from '../../utils/helpers';
import { Modal } from '../common/Modal';

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
}

interface ChatInterfaceProps {
    entityName: string;
    roleplayContext: string;
    onClose: () => void;
}

const styles = {
    chatContainer: css`
        display: flex;
        flex-direction: column;
        height: 60vh;
        max-height: 600px;
    `,
    messageList: css`
        flex: 1;
        overflow-y: auto;
        padding: var(--space-m);
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
        background-color: rgba(0,0,0,0.03);
        border-radius: var(--border-radius);
        margin-bottom: var(--space-m);
    `,
    messageBubble: css`
        padding: var(--space-s) var(--space-m);
        border-radius: 12px;
        max-width: 80%;
        line-height: 1.4;
        font-size: 0.95rem;
        position: relative;
    `,
    userBubble: css`
        align-self: flex-end;
        background-color: var(--dark-brown);
        color: var(--parchment-bg);
        border-bottom-right-radius: 2px;
    `,
    modelBubble: css`
        align-self: flex-start;
        background-color: #fff;
        border: 1px solid var(--border-light);
        color: var(--dark-brown);
        border-bottom-left-radius: 2px;
    `,
    senderName: css`
        font-size: 0.75rem;
        margin-bottom: 4px;
        opacity: 0.8;
        font-weight: bold;
    `,
    inputArea: css`
        display: flex;
        gap: var(--space-s);
    `,
    chatInput: css`
        flex: 1;
        margin-bottom: 0 !important;
    `,
    typingIndicator: css`
        font-style: italic;
        color: var(--medium-brown);
        font-size: 0.8rem;
        margin-bottom: var(--space-s);
        margin-left: var(--space-s);
    `
};

export const ChatInterface: FC<ChatInterfaceProps> = ({ entityName, roleplayContext, onClose }) => {
    const { apiService } = useAppContext();
    const { config } = useCampaignStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial greeting
    useEffect(() => {
        if (messages.length === 0) {
            // Simulate a brief delay for the "character" to get ready
            setIsTyping(true);
            setTimeout(() => {
                setMessages([{
                    id: generateId(),
                    role: 'model',
                    text: `*${entityName} looks at you.* "Greetings. What is it you seek?"`
                }]);
                setIsTyping(false);
            }, 600);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim() || !apiService) return;

        const userMsg: Message = { id: generateId(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            // Construct conversation history
            const history = messages.map(m => `${m.role === 'user' ? 'Player' : entityName}: ${m.text}`).join('\n');
            const fullPrompt = `Roleplay as ${entityName}.
Context: ${roleplayContext}
System Instructions: Keep responses concise (1-3 sentences) and in-character. Do not break character.

Conversation History:
${history}
Player: ${userMsg.text}
${entityName}:`;

            const responseText = await apiService.generateTextContent(
                fullPrompt, 
                config.aiModel || CONFIG.AI_MODEL
            );

            setMessages(prev => [...prev, { id: generateId(), role: 'model', text: responseText.trim() }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { id: generateId(), role: 'model', text: "*A strange silence falls... (Error generating response)*" }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={`Chat with ${entityName}`} size="standard">
            <div className={styles.chatContainer}>
                <div className={styles.messageList}>
                    {messages.map(msg => (
                        <div key={msg.id} className={cx(styles.messageBubble, msg.role === 'user' ? styles.userBubble : styles.modelBubble)}>
                            <div className={styles.senderName}>{msg.role === 'user' ? 'You' : entityName}</div>
                            {msg.text}
                        </div>
                    ))}
                    {isTyping && <div className={styles.typingIndicator}>{entityName} is thinking...</div>}
                    <div ref={messagesEndRef} />
                </div>
                <div className={styles.inputArea}>
                    <input
                        className={styles.chatInput}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your message..."
                        disabled={isTyping}
                        autoFocus
                    />
                    <button className="primary-button" onClick={handleSend} disabled={isTyping || !input.trim()} style={{padding: '0 20px'}}>
                        Send
                    </button>
                </div>
            </div>
        </Modal>
    );
};
