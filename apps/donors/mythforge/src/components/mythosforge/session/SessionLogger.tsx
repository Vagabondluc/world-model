// =============================================================================
// MythosForge - Session Logger: Journal view for Session Notes with @-mentions
// =============================================================================

'use client';

import { useState, useMemo } from 'react';
import { useWorldStore } from '@/store/useWorldStore';
import { MentionEditor } from './MentionEditor';
import { parseMentions } from './mention-parser';
import { Plus, Calendar, Link2, ChevronRight, FileText, Tag, ScrollText } from 'lucide-react';
import type { Entity } from '@/lib/types';

export function SessionLogger() {
  const entities = useWorldStore((s) => s.entities);
  const relationships = useWorldStore((s) => s.relationships);
  const { addEntity, updateEntity, setActiveEntity, deleteEntity } = useWorldStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isNewNote, setIsNewNote] = useState(false);

  const sessionNotes = useMemo(() =>
    entities
      .filter((e) => e.category === 'Session Note')
      .sort((a, b) => ((b.json_attributes?.session_number as number) ?? 0) - ((a.json_attributes?.session_number as number) ?? 0)),
    [entities],
  );

  const getLinked = (noteId: string): Entity[] =>
    relationships.filter((r) => r.parent_id === noteId && r.relationship_type === 'mentioned_in')
      .map((r) => entities.find((e) => e.id === r.child_id))
      .filter(Boolean) as Entity[];

  const stripMd = (md: string, max = 180): string => {
    const plain = md.replace(/^#{1,6}\s+/gm, '').replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1')
      .replace(/`(.+?)`/g, '$1').replace(/!\[.*?\]\(.*?\)/g, '').replace(/\[(.+?)\]\(.*?\)/g, '$1')
      .replace(/^[-*]\s+/gm, '').replace(/\n+/g, ' ').trim();
    return plain.length > max ? plain.slice(0, max) + '...' : plain;
  };

  const handleNewNote = () => {
    const nextNum = sessionNotes.reduce((m, n) => Math.max(m, (n.json_attributes?.session_number as number) ?? 0), 0) + 1;
    const today = new Date().toISOString().slice(0, 10);
    const entity = addEntity(`Session ${nextNum}`, 'Session Note', `# Session ${nextNum}\n\n**Date:** ${today}\n\n`,
      { session_number: nextNum, date_played: today, participants: [], gm_notes: '', xp_awarded: 0 });
    setEditingId(entity.id);
    setIsNewNote(true);
  };

  const handleSave = (markdown: string) => {
    if (!editingId) return;
    updateEntity(editingId, { markdown_content: markdown, updated_at: Date.now() });
    setEditingId(null);
    setIsNewNote(false);
  };

  const handleCancel = () => {
    if (isNewNote && editingId) deleteEntity(editingId);
    setEditingId(null);
    setIsNewNote(false);
  };

  const editingNote = editingId ? entities.find((e) => e.id === editingId) : null;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center gap-2">
          <ScrollText className="w-4 h-4 text-accent-gold" />
          <h2 className="text-sm font-semibold text-bone-100">Session Logger</h2>
          <span className="text-xs text-ash-500">{sessionNotes.length} session{sessionNotes.length !== 1 ? 's' : ''}</span>
        </div>
        <button onClick={handleNewNote}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs bg-accent-gold/15 text-accent-gold hover:bg-accent-gold/25 transition-colors font-medium">
          <Plus className="w-3.5 h-3.5" /> New Session Note
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {editingNote ? (
          <div className="p-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <input type="text" value={editingNote.title}
                onChange={(e) => updateEntity(editingNote.id, { title: e.target.value })}
                className="bg-transparent text-bone-100 font-semibold text-lg focus:outline-none flex-1 min-w-0" />
              <span className="bg-surface-600 text-ash-500 text-xs rounded-full px-2 py-0.5">
                #{String(editingNote.json_attributes?.session_number ?? '?')}
              </span>
            </div>
            <MentionEditor initialValue={editingNote.markdown_content} sessionId={editingNote.id}
              onSave={handleSave} onCancel={handleCancel} />
          </div>
        ) : sessionNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-ash-600">
            <FileText className="w-10 h-10" />
            <p className="text-sm">No session notes yet.</p>
            <p className="text-xs">Click &quot;New Session Note&quot; to start logging your game sessions.</p>
          </div>
        ) : (
          <div className="p-4 max-w-3xl mx-auto space-y-3">
            {sessionNotes.map((note) => {
              const linked = getLinked(note.id);
              const mentions = parseMentions(note.markdown_content, entities);
              const mc = mentions.filter((m) => m.entity).length;
              const date = (note.json_attributes?.date_played as string) || '—';
              const xp = (note.json_attributes?.xp_awarded as number) || 0;
              return (
                <div key={note.id} className="bg-surface-700/30 border border-white/[0.06] rounded-lg hover:border-white/[0.1] transition-colors">
                  <button onClick={() => { setEditingId(note.id); setIsNewNote(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left group cursor-pointer">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-bone-100 text-sm font-medium group-hover:text-accent-gold transition-colors truncate">{note.title}</span>
                        <span className="text-ash-600 text-xs flex-shrink-0">#{String(note.json_attributes?.session_number ?? '?')}</span>
                      </div>
                      <p className="text-ash-500 text-xs leading-relaxed">{stripMd(note.markdown_content)}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-ash-600 flex-shrink-0 group-hover:text-bone-300 transition-colors" />
                  </button>
                  <div className="flex items-center gap-4 px-4 pb-2.5 text-[10px] text-ash-600">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {date}</span>
                    {linked.length > 0 && <span className="flex items-center gap-1 text-emerald-500/70"><Link2 className="w-3 h-3" /> {linked.length} linked</span>}
                    {mc > 0 && <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {mc} @-mentions</span>}
                    {xp > 0 && <span className="text-amber-500/60">+{xp} XP</span>}
                    <span className="ml-auto">{note.uuid_short}</span>
                  </div>
                  {linked.length > 0 && (
                    <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                      {linked.map((ent) => (
                        <button key={ent.id} onClick={() => setActiveEntity(ent.id)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-900/20 border border-emerald-700/20 text-emerald-300 text-[10px] hover:bg-emerald-900/30 transition-colors cursor-pointer">
                          {ent.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
