import React, { useState } from 'react';

const EMOJI_CATEGORIES = {
    'Nature': ['🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🍄', '🏔️', '⛰️', '🌋', '🗻', '🏕️', '🏖️', '🏜️', '🏝️', '🏞️', '🏟️', '🏛️'],
    'Water': ['🌊', '💧', '💦', '🧊', '🌫️', '🌧️', '🌨️', '🌩️', '🌪️', '🌀', '🌈', '☔'],
    'Celestial': ['☀️', '🌤️', '⛅', '☁️', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌙', '🌚', '🌛', '🌜', '⭐', '🌟', '💫', '☄️'],
    'Settlement': ['🏰', '🏯', '🛖', '🏠', '🏡', '⛪', '🕌', '🛕', '🕍', '⛩️', '🏢', '🏗️', '🏘️', '🏚️', '⛺'],
    'Symbols': ['⚔️', '🛡️', '🏹', '🔮', '⚗️', '📜', '💍', '👑', '💎', '🏺', '⚱️', '🧿', '🕯️', '🗝️', '🧬', '🖼️', '🎭', '🎨', '🧵'],
    'People': ['🧙', '🧙‍♀️', '🧙‍♂️', '🧚', '🧚‍♀️', '🧚‍♂️', '🧛', '🧛‍♀️', '🧛‍♂️', '🧜', '🧜‍♀️', '🧜‍♂️', '🧝', '🧝‍♀️', '🧝‍♂️', '🧞', '🧞‍♀️', '🧞‍♂️', '🧟', '🧟‍♀️', '🧟‍♂️'],
    'Animals': ['🐉', '🐲', '🦄', '🦅', '🐺', '🦁', '🐅', '🐘', '🐎', '🦓', '🦌', '🐂', '🐄', '🐏', '🐑', '🐐', '🐪', '🐫', '🦙', '🦒'],
    'Markers': ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬛', '⬜']
};

interface EmojiPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (emoji: string) => void;
    triggerRef: React.RefObject<HTMLElement | null>;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ isOpen, onClose, onSelect, triggerRef }) => {
    const [activeCategory, setActiveCategory] = useState('Nature');

    if (!isOpen) return null;

    // Basic positioning relative to trigger (simplified for now)
    const positionStyle: React.CSSProperties = {
        position: 'absolute',
        zIndex: 50,
        top: '100%',
        left: 0,
        marginTop: '0.5rem'
    };

    return (
        <div className="bg-white border rounded-lg shadow-xl w-72 flex flex-col overflow-hidden" style={positionStyle}>
            {/* Category Tabs */}
            <div className="flex overflow-x-auto bg-gray-50 border-b scrollbar-thin scrollbar-thumb-gray-300">
                {Object.keys(EMOJI_CATEGORIES).map(cat => (
                    <button
                        key={cat}
                        onClick={(e) => { e.preventDefault(); setActiveCategory(cat); }}
                        className={`px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-white text-amber-600 border-b-2 border-amber-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Emoji Grid */}
            <div className="p-3 bg-white h-48 overflow-y-auto grid grid-cols-6 gap-2">
                {EMOJI_CATEGORIES[activeCategory as keyof typeof EMOJI_CATEGORIES].map(emoji => (
                    <button
                        key={emoji}
                        onClick={(e) => { e.preventDefault(); onSelect(emoji); onClose(); }}
                        className="w-8 h-8 flex items-center justify-center text-xl rounded hover:bg-amber-100 transition-colors"
                        title={emoji}
                    >
                        {emoji}
                    </button>
                ))}
            </div>

            {/* Footer */}
            <div className="p-2 border-t bg-gray-50 flex justify-end">
                <button
                    onClick={(e) => { e.preventDefault(); onClose(); }}
                    className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
                >
                    Close
                </button>
            </div>

            {/* Click outside handler backdrop (transparent) */}
            <div
                className="fixed inset-0 z-[-1]"
                onClick={(e) => { e.preventDefault(); onClose(); }}
            />
        </div>
    );
};

export default EmojiPicker;
