import React, { FC, useState, useRef, useEffect, useMemo } from 'react';
import { css, cx } from '@emotion/css';
import { useTavernStore } from '../../stores/tavernStore';
import { useCompendiumStore } from '../../stores/compendiumStore';
import { useAppContext } from '../../context/AppContext';

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: var(--space-l);
    `,
    header: css`
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        padding-bottom: var(--space-l);
        border-bottom: 1px solid var(--border-light);
        gap: var(--space-m);

        @media (max-width: 600px) {
            flex-direction: column;
            align-items: stretch;
        }
    `,
    chatContainer: css`
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
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
        white-space: pre-wrap;
    `,
    dmBubble: css`
        align-self: flex-end;
        background-color: var(--dark-brown);
        color: var(--parchment-bg);
        border-bottom-right-radius: 2px;
    `,
    npcBubble: css`
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
        padding: var(--space-s) var(--space-m);
        display: flex;
        align-items: center;
    `,
    emptyState: css`
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: var(--medium-brown);
        font-style: italic;
    `
};

export const NpcChatPanel: FC = () => {
    const { apiService } = useAppContext();
    const { 
        activeNpcId, 
        setActiveNpcId, 
        chatHistory, 
        aiLoading, 
        streamNpcResponse,
        summarizeConversation
    } = useTavernStore();
    const npcs = useCompendiumStore(s => s.compendiumEntries.filter(e => e.category === 'npc'));
    
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const activeNpc = useMemo(() => npcs.find(n => n.id === activeNpcId), [npcs, activeNpcId]);
    const currentMessages = useMemo(() => activeNpcId ? chatHistory[activeNpcId] || [] : [], [chatHistory, activeNpcId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentMessages, aiLoading]);
    
    const handleSend = () => {
        if (!input.trim() || !apiService) return;
        streamNpcResponse(apiService, input);
        setInput('');
    };

    const handleSummarize = () => {
        if (!apiService || !activeNpcId) return;
        if (window.confirm("Summarize this conversation and add it to the NPC's memory? This will help the AI remember key details in future chats.")) {
            summarizeConversation(apiService, activeNpcId);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div style={{flex: 1}}>
                    <label>Choose an NPC to speak with:</label>
                    <select value={activeNpcId || ''} onChange={e => setActiveNpcId(e.target.value || null)}>
                        <option value="">-- Choose an NPC --</option>
                        {npcs.map(npc => (
                            <option key={npc.id} value={npc.id}>{npc.title}</option>
                        ))}
                    </select>
                </div>
                {activeNpcId && currentMessages.length > 0 && (
                    <button 
                        className="secondary-button" 
                        onClick={handleSummarize}
                        disabled={aiLoading}
                        style={{fontSize: '0.9rem', whiteSpace: 'nowrap'}}
                        title="Persist key revelations to NPC memory."
                    >
                        💾 End & Summarize
                    </button>
                )}
            </div>
            
            <div className={styles.chatContainer}>
                {activeNpc ? (
                    <>
                        <div className={styles.messageList}>
                            {currentMessages.map(msg => (
                                <div key={msg.id} className={cx(styles.messageBubble, msg.sender === 'dm' ? styles.dmBubble : styles.npcBubble)}>
                                    <div className={styles.senderName}>{msg.sender === 'dm' ? 'You' : activeNpc.title}</div>
                                    {msg.content}
                                </div>
                            ))}
                            {aiLoading && (
                                <div className={styles.typingIndicator}>
                                    <span className="loader" style={{width:'0.8em', height:'0.8em', marginRight:'6px', borderColor:'var(--medium-brown)', borderLeftColor:'var(--dark-brown)'}}></span> 
                                    {activeNpc.title} is thinking...
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className={styles.inputArea}>
                            <input
                                className={styles.chatInput}
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder={`Speak to ${activeNpc.title}...`}
                                disabled={aiLoading}
                                autoFocus
                            />
                            <button className="primary-button" onClick={handleSend} disabled={aiLoading || !input.trim()} style={{padding: '0 20px'}}>
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <div className={styles.emptyState}>
                        <p>Select an NPC from the list to begin roleplaying.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
