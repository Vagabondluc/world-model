
import React, { FC, useState, KeyboardEvent } from 'react';

interface StringListInputProps {
    items: string[];
    onChange: (items: string[]) => void;
    label?: string;
    placeholder?: string;
    suggestions?: string[];
    id?: string;
}

export const StringListInput: FC<StringListInputProps> = ({ 
    items = [], 
    onChange, 
    label, 
    placeholder = "Add an item...", 
    suggestions = [],
    id = `string-list-${Math.random().toString(36).substr(2, 9)}`
}) => {
    const [inputValue, setInputValue] = useState('');
    const datalistId = `${id}-suggestions`;

    const addItem = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !items.includes(trimmed)) {
            onChange([...items, trimmed]);
            setInputValue('');
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addItem();
        }
    };

    const removeItem = (itemToRemove: string) => {
        onChange(items.filter(item => item !== itemToRemove));
    };

    return (
        <div className="form-group">
            {label && <label htmlFor={id}>{label}</label>}
            <div className="string-list-input-container">
                <input
                    id={id}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    list={suggestions.length > 0 ? datalistId : undefined}
                />
                {suggestions.length > 0 && (
                    <datalist id={datalistId}>
                        {suggestions.map(s => <option key={s} value={s} />)}
                    </datalist>
                )}
                <button type="button" onClick={addItem} className="action-button" disabled={!inputValue.trim()}>
                    Add
                </button>
            </div>
            {items.length > 0 && (
                <div className="string-list-items">
                    {items.map(item => (
                        <span key={item} className="string-list-tag">
                            {item}
                            <button type="button" onClick={() => removeItem(item)} aria-label={`Remove ${item}`}>×</button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};
