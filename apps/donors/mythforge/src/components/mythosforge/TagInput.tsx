'use client';

import { useState, useRef, useMemo, useCallback } from 'react';
import { X, Plus } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onAdd: (_tag: string) => void;
  onRemove: (_tag: string) => void;
  suggestions?: string[];
  maxSuggestions?: number;
  placeholder?: string;
}

export function TagInput({
  tags,
  onAdd,
  onRemove,
  suggestions = [],
  maxSuggestions = 8,
  placeholder = 'Add tag...',
}: TagInputProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = useMemo(() => {
    if (!input.trim()) return suggestions.slice(0, maxSuggestions);
    const q = input.toLowerCase().trim();
    return suggestions
      .filter((s) => s.toLowerCase().includes(q) && !tags.includes(s))
      .slice(0, maxSuggestions);
  }, [input, suggestions, tags, maxSuggestions]);

  const handleAdd = useCallback(
    (tag: string) => {
      const trimmed = tag.trim().toLowerCase();
      if (trimmed && !tags.includes(trimmed)) {
        onAdd(trimmed);
        setInput('');
        setShowSuggestions(false);
        inputRef.current?.focus();
      }
    },
    [tags, onAdd],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        // If a suggestion is focused, use that; otherwise use input value
        if (filteredSuggestions.length > 0 && showSuggestions) {
          handleAdd(filteredSuggestions[0]);
        } else {
          handleAdd(input);
        }
      }
      if (e.key === 'Backspace' && !input && tags.length > 0) {
        onRemove(tags[tags.length - 1]);
      }
      if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    },
    [input, tags, filteredSuggestions, showSuggestions, handleAdd, onRemove],
  );

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-1.5 items-center bg-void-900 border border-white/[0.06] rounded-lg px-2.5 py-2 min-h-[36px] focus-within:border-accent-gold/30 focus-within:ring-1 focus-within:ring-accent-gold/20 transition-colors">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-600 text-accent-gold text-xs font-medium border border-accent-gold/20 group"
          >
            {tag}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(tag);
              }}
              className="opacity-60 hover:opacity-100 transition-opacity text-accent-gold cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            // Delay to allow click on suggestion
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[60px] bg-transparent border-none text-bone-300 text-xs placeholder:text-ash-600 focus:outline-none h-5"
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-void-800 border border-white/[0.08] rounded-lg shadow-xl max-h-40 overflow-y-auto">
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent blur before click fires
                handleAdd(suggestion);
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-bone-300 hover:bg-surface-600 hover:text-bone-100 transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3 inline mr-1.5 text-ash-500" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
