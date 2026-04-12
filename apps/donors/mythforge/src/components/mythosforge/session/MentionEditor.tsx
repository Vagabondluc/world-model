// =============================================================================
// MythosForge - MentionEditor: Textarea with @-Mention Autocomplete
// =============================================================================

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useWorldStore } from '@/store/useWorldStore';
import {
  parseMentions, mentionRelationships, diffMentionRelationships,
  searchEntitiesForMention,
} from './mention-parser';
import { Check, X, Link2, AlertCircle, AtSign } from 'lucide-react';

interface MentionEditorProps {
  /** Initial markdown content */
  initialValue: string;
  /** Session note entity ID (for relationship creation) */
  sessionId: string;
  /** Called when the user clicks Save */
  onSave: (_markdown: string, _mentionedEntityIds: string[]) => void;
  /** Called to cancel */
  onCancel: () => void;
}

export function MentionEditor({ initialValue, sessionId, onSave, onCancel }: MentionEditorProps) {
  const entities = useWorldStore((s) => s.entities);
  const relationships = useWorldStore((s) => s.relationships);
  const addRelationship = useWorldStore((s) => s.addRelationship);

  const [text, setText] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionIndex, setMentionIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cursorPos, setCursorPos] = useState(0);
  const [mentionStart, setMentionStart] = useState(-1);

  const candidates = searchEntitiesForMention(mentionQuery, entities);
  const mentions = parseMentions(text, entities);
  const matchedCount = mentions.filter((m) => m.entity).length;
  const unmatchedCount = mentions.filter((m) => !m.entity).length;

  // Detect @-trigger while typing
  const handleChange = useCallback((value: string) => {
    setText(value);
    const textarea = textareaRef.current;
    if (!textarea) return;
    const pos = textarea.selectionStart;
    setCursorPos(pos);

    // Look backwards from cursor to find @
    const before = value.slice(0, pos);
    const atIdx = before.lastIndexOf('@');
    if (atIdx >= 0 && (atIdx === 0 || /[\s\n]/.test(before[atIdx - 1]))) {
      const query = before.slice(atIdx + 1, pos);
      if (!query.includes(' ') || query.length < 30) {
        setMentionQuery(query);
        setMentionStart(atIdx);
        setShowDropdown(true);
        setMentionIndex(-1);
        return;
      }
    }
    setShowDropdown(false);
  }, []);

  // Select a mention candidate
  const selectMention = useCallback((entityId: string, entityTitle: string) => {
    const before = text.slice(0, mentionStart);
    const after = text.slice(cursorPos);
    const hasSpace = mentionQuery.includes(' ');
    const insertText = hasSpace
      ? `@"${entityTitle}" `
      : `@${entityTitle} `;
    setText(before + insertText + after);
    setShowDropdown(false);
    setMentionQuery('');
    setMentionStart(-1);
    // Move cursor after the inserted mention
    requestAnimationFrame(() => {
      const newPos = before.length + insertText.length;
      textareaRef.current?.setSelectionRange(newPos, newPos);
      textareaRef.current?.focus();
    });
  }, [text, mentionStart, cursorPos, mentionQuery]);

  // Keyboard navigation in dropdown
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showDropdown || candidates.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setMentionIndex((i) => Math.min(i + 1, candidates.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setMentionIndex((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && mentionIndex >= 0) { e.preventDefault(); selectMention(candidates[mentionIndex].id, candidates[mentionIndex].title); }
    else if (e.key === 'Escape') { setShowDropdown(false); }
  }, [showDropdown, candidates, mentionIndex, selectMention]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Handle save with auto-relationship creation
  const handleSave = useCallback(() => {
    const allMentions = parseMentions(text, entities);
    const desired = mentionRelationships(sessionId, allMentions);
    const toAdd = diffMentionRelationships(sessionId, relationships, desired);
    for (const rel of toAdd) {
      addRelationship(sessionId, rel.childId, rel.type);
    }
    const mentionedIds = allMentions.filter((m) => m.entity).map((m) => m.entity?.id ?? '');
    onSave(text, mentionedIds);
  }, [text, entities, sessionId, relationships, addRelationship, onSave]);

  return (
    <div className="flex flex-col gap-3">
      {/* Mentions summary bar */}
      <div className="flex items-center gap-3 text-xs">
        <AtSign className="w-3.5 h-3.5 text-ash-500" />
        <span className="text-ash-500">{mentions.length} mention{mentions.length !== 1 ? 's' : ''}</span>
        {matchedCount > 0 && <span className="flex items-center gap-1 text-emerald-400"><Link2 className="w-3 h-3" /> {matchedCount} linked</span>}
        {unmatchedCount > 0 && <span className="flex items-center gap-1 text-amber-400"><AlertCircle className="w-3 h-3" /> {unmatchedCount} unmatched</span>}
      </div>

      {/* Editor area */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write your session recap... Use @EntityName to link entities."
          className="w-full h-64 bg-void-900 text-bone-300 text-sm font-mono border border-white/[0.06] rounded-lg p-4 resize-y focus-visible:ring-accent-gold/30 focus-visible:border-accent-gold/40 placeholder:text-ash-600 leading-relaxed"
        />

        {/* Autocomplete dropdown */}
        {showDropdown && candidates.length > 0 && (
          <div ref={dropdownRef}
            className="absolute z-50 left-4 mt-1 w-72 max-h-56 overflow-y-auto bg-void-800 border border-white/[0.1] rounded-lg shadow-xl">
            {candidates.map((entity, idx) => (
              <button key={entity.id}
                onClick={() => selectMention(entity.id, entity.title)}
                onMouseEnter={() => setMentionIndex(idx)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
                  idx === mentionIndex ? 'bg-surface-600 text-bone-100' : 'text-bone-300 hover:bg-surface-600/50'
                }`}>
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">{entity.title}</div>
                  <div className="text-xs text-ash-500">{entity.category}</div>
                </div>
                <span className="text-xs text-ash-600 font-mono flex-shrink-0">{entity.uuid_short}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mentioned entities as badges */}
      {matchedCount > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {mentions.filter((m) => m.entity).map((m, i) => (
            <span key={m.entity?.id ?? `${i}`}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-900/30 border border-emerald-700/30 text-emerald-300 text-[10px]">
              <Link2 className="w-2.5 h-2.5" /> {m.entity?.title ?? ''}
            </span>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-2">
        <button onClick={onCancel}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-ash-500 hover:text-bone-300 hover:bg-surface-600 transition-colors">
          <X className="w-3.5 h-3.5" /> Cancel
        </button>
        <button onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30 transition-colors font-medium">
          <Check className="w-3.5 h-3.5" /> Save &amp; Link
        </button>
      </div>
    </div>
  );
}
