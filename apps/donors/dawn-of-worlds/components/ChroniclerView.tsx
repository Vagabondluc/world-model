import React, { useState, useMemo, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { JournalEntry, ChronicleCandidate } from '../logic/chronicler/types';
import { resolveTemplateText } from '../logic/templates/engine';
import { getTemplate } from '../logic/templates/library';
import { triggerHaptic } from '../logic/haptics';
import SagaView from './SagaView';
import { selectPlayerColor } from '../logic/selectors';
import { formManager } from '../logic/chronicler/forms/registry';
import { FormView } from './chronicler/forms/FormView';
import { ChroniclerForm } from '../logic/chronicler/forms/types';
import { BookLayout } from './chronicler/book/BookLayout';

interface ChroniclerViewProps {
  onClose: () => void;
}

const ChroniclerView: React.FC<ChroniclerViewProps> = ({ onClose }) => {
  const [tab, setTab] = useState<'SCRIBE' | 'SAGA'>('SCRIBE');
  const store = useGameStore();

  // Workflow State
  const [mode, setMode] = useState<'SELECT' | 'FORM' | 'EDITOR'>('SELECT');
  const [selectedCandidates, setSelectedCandidates] = useState<ChronicleCandidate | null>(null);
  const [activeForm, setActiveForm] = useState<ChroniclerForm | null>(null);

  // Editor State
  const [editBuffer, setEditBuffer] = useState<Partial<JournalEntry> | null>(null);

  // Derived Lists
  const candidates = useMemo(() => Object.values(store.candidates).sort((a, b) => b.createdAtTurn - a.createdAtTurn), [store.candidates]);
  const journalMessages = useMemo(() => Object.values(store.journal).sort((a, b) => b.timestamp - a.timestamp), [store.journal]);

  const resetSelection = () => {
    setMode('SELECT');
    setSelectedCandidates(null);
    setActiveForm(null);
    setEditBuffer(null);
  };

  const handleSelectCandidate = (candidate: ChronicleCandidate) => {
    triggerHaptic('tap');
    setSelectedCandidates(candidate);

    // 1. Try to initialize a Form
    const form = formManager.initializeForm(candidate.triggerType, candidate.id);
    if (form) {
      setActiveForm(form);
      setMode('FORM');
    } else {
      // 2. Fallback: Jump straight to Editor with default template
      generateDraftFromCandidate(candidate, {});
      setMode('EDITOR');
    }
  };

  const generateDraftFromCandidate = (candidate: ChronicleCandidate, formValues: Record<string, any>) => {
    const template = candidate.suggestedTemplates[0] ? getTemplate(candidate.suggestedTemplates[0]) : null;
    const event = store.events.find(e => e.id === candidate.sourceEventIds[0]);

    let draftTitle = "Untitled Legacy";
    let draftBody = "";

    if (template && event) {
      // mix event payload + form values
      const context: any = {
        ...event.payload,
        ...formValues, // Form overrides
        // Global Helpers
        ageName: `Age ${event.age}`,
        prevAgeName: `Age ${event.age - 1}`,
      };

      const resolved = resolveTemplateText(template, context);
      draftTitle = resolved.title;
      draftBody = resolved.body;
    }

    setEditBuffer({
      title: draftTitle,
      text: draftBody,
      type: 'CHRONICLE',
      scope: candidate.scope,
      age: candidate.age,
      author: 'IMPERIAL_SCRIBE',
      triggeredByEventIds: candidate.sourceEventIds
    });
  };

  const handleFormAction = (actionId: string, form: ChroniclerForm) => {
    if (actionId === 'cancel') {
      resetSelection();
    } else if (actionId === 'submit') {
      // Proceed to Editor with form values
      if (selectedCandidates) {
        generateDraftFromCandidate(selectedCandidates, form.values);
        setMode('EDITOR');
      }
    } else if (actionId === 'auto_fill') {
      // Re-initialize logic? For now handled by FormView state mostly
      // Could implement a reset here
    }
  };

  const handleSelectEntry = (entry: JournalEntry) => {
    triggerHaptic('tap');
    setEditBuffer(entry);
    setMode('EDITOR');
  };

  const handleSave = () => {
    if (!editBuffer) return;

    if (activeForm && selectedCandidates) {
      // New Entry from Candidate
      const entry: JournalEntry = {
        ...editBuffer as JournalEntry,
        id: `je_${Date.now()}`,
        timestamp: Date.now()
      };
      store.commitJournalEntry(entry);
      triggerHaptic('confirm');
      resetSelection();
    } else {
      // Edit existing logic (read only for now)
    }
  };

  if (tab === 'SAGA') {
    return <BookLayout entries={journalMessages} onClose={() => setTab('SCRIBE')} />;
  }

  return (
    <div className="fixed inset-0 z-[60] bg-bg-dark flex flex-col font-sans animate-in fade-in zoom-in-95 duration-300">
      {/* Header */}
      <header className="h-16 border-b border-white/5 bg-bg-panel px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="size-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary border border-primary/20">
            <span className="material-symbols-outlined">auto_stories</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-white font-display tracking-tight uppercase">The Scribe</h1>
            <p className="text-[10px] text-text-muted uppercase tracking-widest">
              {mode === 'SELECT' ? 'Chronicle Interface' : mode === 'FORM' ? 'Guided Reflection' : 'Final Polish'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTab('SAGA')}
            className="px-6 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-amber-500/20 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">menu_book</span>
            Read the Saga
          </button>
          <div className="w-px h-6 bg-white/10 mx-2"></div>
          <button
            onClick={onClose}
            className="size-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar: Selection List (Hidden in FORM mode for focus?) -> No, keep for context */}
        <aside className={`w-1/3 border-r border-white/5 flex flex-col bg-black/20 transition-all duration-300 ${mode === 'FORM' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
          {/* Candidates Section */}
          <div className="p-4 border-b border-white/5 bg-amber-500/5">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">history_edu</span>
              Pending History ({candidates.length})
            </span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1 min-h-0 border-b border-white/5">
            {candidates.map(c => (
              <div
                key={c.id}
                onClick={() => handleSelectCandidate(c)}
                className={`group p-3 rounded-xl border transition-all cursor-pointer ${selectedCandidates?.id === c.id
                  ? 'bg-primary/20 border-primary/50 shadow-glow'
                  : 'bg-white/5 border-transparent hover:bg-white/10'
                  }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[9px] font-bold font-mono text-text-muted">A{c.age} · {c.urgency}</span>
                  <span className="material-symbols-outlined text-sm text-amber-500 animate-pulse">edit_note</span>
                </div>
                <p className="text-xs font-bold text-white mb-1 line-clamp-1">{c.triggerType.replace('_', ' ')}</p>
              </div>
            ))}
            {candidates.length === 0 && (
              <div className="p-8 text-center opacity-30 text-xs italic">
                No history waiting to be written...
              </div>
            )}
          </div>

          {/* Written History Section */}
          <div className="p-4 border-b border-white/5 bg-white/5">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Written Chronicle</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1 min-h-0">
            {journalMessages.map(entry => (
              <div
                key={entry.id}
                onClick={() => handleSelectEntry(entry)}
                className={`group p-3 rounded-xl border transition-all cursor-pointer ${(!selectedCandidates && editBuffer?.id === entry.id)
                  ? 'bg-white/10 border-white/30'
                  : 'bg-transparent border-transparent hover:bg-white/5'
                  }`}
              >
                <p className="text-xs font-bold text-white mb-1 line-clamp-1">{entry.title}</p>
                <span className="text-[9px] font-mono text-text-muted">A{entry.age} · {entry.author}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Work Area */}
        <section className="flex-1 flex flex-col bg-bg-dark p-12 overflow-y-auto relative">
          {mode === 'SELECT' && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20">
              <span className="material-symbols-outlined text-8xl">ink_pen</span>
              <div className="max-w-xs">
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Select an Epoch</h3>
                <p className="text-sm text-text-muted">Choose a Pending Event to chronicle it, or review the ancient texts.</p>
              </div>
            </div>
          )}

          {mode === 'FORM' && activeForm && (
            <FormView initialForm={activeForm} onAction={handleFormAction} />
          )}

          {mode === 'EDITOR' && editBuffer && (
            <div className="max-w-2xl mx-auto w-full space-y-8 animate-in slide-in-from-right-10 duration-500">
              {/* Editor View */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Chronicle Title</label>
                    <input
                      type="text"
                      value={editBuffer.title}
                      onChange={e => setEditBuffer(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-transparent p-0 text-2xl font-display font-bold text-white focus:outline-none"
                    />
                  </div>
                  {activeForm && (
                    <button onClick={() => setMode('FORM')} className="text-xs text-text-muted hover:text-white underline">
                      Edit Choices
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <textarea
                    value={editBuffer.text}
                    onChange={e => setEditBuffer(prev => ({ ...prev, text: e.target.value }))}
                    rows={12}
                    className="w-full bg-bg-panel border border-white/5 p-6 rounded-2xl text-lg text-text-muted leading-relaxed focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button onClick={() => resetSelection()} className="text-text-muted hover:text-white text-sm">
                    Discard
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-glow hover:bg-primary-hover transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">history_edu</span>
                    Seal in Time
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ChroniclerView;
