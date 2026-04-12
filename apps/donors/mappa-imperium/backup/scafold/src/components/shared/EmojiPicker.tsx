import React, { useState, useRef } from 'react';
import type { EmojiPickerProps } from '../../types';
import { emojiCategories, EmojiData } from '../../data/emojis';
import useOnClickOutside from '../../hooks/useOnClickOutside';

const EmojiPicker = ({ isOpen, onClose, onSelect, triggerRef }: EmojiPickerProps) => {
    const [activeCategory, setActiveCategory] = useState(emojiCategories[0].name);
    const [hoveredEmoji, setHoveredEmoji] = useState<EmojiData | null>(null);
    const pickerRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(pickerRef, (event) => {
        // If the click is on the trigger button, don't do anything;
        // let the button's own onClick handler manage the state.
        if (triggerRef.current && triggerRef.current.contains(event.target as Node)) {
            return;
        }
        onClose();
    });

    if (!isOpen) return null;

    const handleEmojiSelect = (emoji: string) => {
        onSelect(emoji);
        onClose();
    };

    const currentCategory = emojiCategories.find(c => c.name === activeCategory);
    
    return (
        <div ref={pickerRef} className="absolute z-10 top-full mt-2 w-72 p-2 bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col max-h-80 animate-fade-in-scale-up">
            <div className="flex-shrink-0 border-b pb-2 mb-2 overflow-x-auto">
                <div className="flex space-x-2">
                    {emojiCategories.map(category => (
                        <button
                            key={category.name}
                            type="button"
                            onClick={() => setActiveCategory(category.name)}
                            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${activeCategory === category.name ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                        >
                            {`${category.icon} ${category.name}`}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-grow overflow-y-auto">
                <div className="grid grid-cols-6 gap-2">
                    {currentCategory?.emojis.map(emoji => (
                        <button
                            key={emoji.char}
                            type="button"
                            onClick={() => handleEmojiSelect(emoji.char)}
                            onMouseEnter={() => setHoveredEmoji(emoji)}
                            onMouseLeave={() => setHoveredEmoji(null)}
                            className="text-2xl p-1 rounded-md hover:bg-amber-100 transition-colors"
                            aria-label={emoji.name}
                            title={emoji.name}
                        >
                            {emoji.char}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-shrink-0 border-t pt-2 mt-2 h-14 flex items-center">
                {hoveredEmoji ? (
                    <div className="flex items-center gap-2 text-sm text-gray-600 w-full">
                        <span className="text-3xl">{hoveredEmoji.char}</span>
                        <div className="overflow-hidden">
                            <div className="font-semibold capitalize truncate">{hoveredEmoji.name.toLowerCase()}</div>
                            <div className="text-xs text-gray-400">{hoveredEmoji.codepoint}</div>
                        </div>
                    </div>
                ) : (
                    <div className="text-sm text-gray-400 text-center w-full">Hover over an emoji for details.</div>
                )}
            </div>
        </div>
    );
};

export default EmojiPicker;