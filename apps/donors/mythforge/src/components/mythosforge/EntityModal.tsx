'use client';

import { useState } from 'react';
import { useEntityForm } from './useEntityForm';
import { useWorldStore } from '@/store/useWorldStore';
import { DeleteConfirmDialog, UnsavedChangesDialog } from './EntityModalDialogs';
import { Textarea } from '@/components/ui/textarea';
import { MarkdownEditor } from './MarkdownEditor';
import { JsonHighlighter } from './JsonHighlighter';
import { AttributeForm } from './AttributeForm';
import { TagInput } from './TagInput';
import { LinkEntityDialog } from './LinkEntityDialog';
import { CalendarViewer } from './CalendarViewer';
import { ManualCalendarEditor } from './ManualCalendarEditor';
import { buildFinalMarkdown, DEFAULT_SEASONS, type CalendarStructuredData, type CalendarEvent, type CalendarAttributes, type CalendarSeason } from './calendar-forge-config';
import { X, Pin, Trash2, Eye, Code2, Plus, Unlink, Copy, Braces, Check, AlertTriangle, CalendarDays, Settings2 } from 'lucide-react';
import type { Entity, Relationship } from '@/lib/types';

// ─── Calendar Setup Prompt (shown when no synthesized data) ──────────────────

function CalendarSetupPrompt({ onOpenEditor }: { onOpenEditor: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-sm space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center mx-auto">
          <CalendarDays className="w-8 h-8 text-accent-gold" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-bone-100 font-semibold text-base">No Calendar Grid Configured</h3>
          <p className="text-ash-500 text-sm leading-relaxed">
            This calendar entity needs a grid structure (months, days, weekdays) before it can display the interactive calendar view.
          </p>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <button onClick={onOpenEditor}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-accent-gold text-void-900 font-medium text-sm hover:bg-accent-gold-dim transition-colors">
            <Settings2 className="w-4 h-4" /> Configure Calendar Grid
          </button>
          <p className="text-[10px] text-ash-600 leading-relaxed">
            Define the number of months, days per week, month/weekday names, and any intercalary days. You can also use the <span className="text-accent-gold/70">Calendar Forge</span> wizard to generate one with AI.
          </p>
        </div>
      </div>
    </div>
  );
}

type ToggleOpt = { label: string; value: string; icon?: React.ReactNode };

function Toggle({ options, value, onChange, sm }: { options: ToggleOpt[]; value: string; onChange: (_v: string) => void; sm?: boolean }) {
  const cls = sm ? 'gap-1.5 px-2 py-1 rounded text-[10px]' : 'gap-1.5 px-2.5 py-1 rounded text-xs';
  return (
    <div className="flex items-center bg-surface-700 rounded-md p-0.5">
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)}
          className={`flex items-center ${cls} font-medium transition-colors ${value === o.value ? 'bg-surface-600 text-accent-gold' : 'text-ash-500 hover:text-bone-300'}`}>
          {o.icon} {o.label}
        </button>
      ))}
    </div>
  );
}

export function EntityModal() {
  const updateEntity = useWorldStore((s) => s.updateEntity);
  const {
    jsonError, editorMode, attributesView, jsonViewMode, setJsonViewMode,
    linkDialogOpen, setLinkDialogOpen, deleteDialogOpen, setDeleteDialogOpen,
    unsavedDialogOpen, setUnsavedDialogOpen, richMarkdown,
    register, handleSubmit, isDirty, getValues,
    entity, childEntities, parentEntities, relationships,
    handleRichMarkdownChange, handleAttributeChange,
    handleEditorModeChange, handleAttributesViewChange,
    onSave, handleDelete, handleDuplicate,
    handleDeleteRelationship, handleClose, handleForceClose,
    addTag, removeTag, getAllTags, togglePinEntity, setActiveEntity, formatDate,
  } = useEntityForm();

  const [calendarView, setCalendarView] = useState(false);
  const [calEditorOpen, setCalEditorOpen] = useState(false);

  if (!entity) return null;

  const isCalendar = entity.category === 'Calendar';
  const calendarData = isCalendar
    ? entity.json_attributes?.synthesized as CalendarStructuredData | undefined
    : undefined;

  const calendarEvents = (entity.json_attributes?.events || []) as CalendarEvent[];
  const calendarSeasons = (entity.json_attributes?.seasons || DEFAULT_SEASONS) as CalendarSeason[];

  const handleCalendarEditSave = (data: CalendarStructuredData) => {
    const notes = entity.json_attributes?.design_notes || {};
    const markdown = buildFinalMarkdown(notes as CalendarAttributes['design_notes'], data);
    updateEntity(entity.id, {
      json_attributes: { ...entity.json_attributes, synthesized: data },
      markdown_content: markdown,
    });
  };

  const handleCalendarEventsChange = (newEvents: CalendarEvent[]) => {
    updateEntity(entity.id, {
      json_attributes: { ...entity.json_attributes, events: newEvents },
    });
  };

  const linkedItem = (l: Entity, prefix: string, rel: Relationship | undefined) => (
    <div key={l.id} role="button" tabIndex={0} onClick={() => setActiveEntity(l.id)}
      onKeyDown={(e) => { if (e.key === 'Enter') setActiveEntity(l.id); }}
      className="flex items-center justify-between gap-2 p-2 rounded-md hover:bg-surface-600 transition-colors text-left group cursor-pointer">
      <div className="flex flex-col min-w-0">
        <span className="text-bone-300 text-sm truncate group-hover:text-bone-100 transition-colors">{prefix} {l.title}</span>
        <span className="text-ash-600 text-xs">{l.category} · {rel?.relationship_type || 'linked'}</span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-ash-600 text-xs font-mono">{l.uuid_short}</span>
        {rel && <button onClick={(e) => handleDeleteRelationship(rel.id, e)}
          className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-accent-blood/20 text-ash-600 hover:text-accent-blood transition-all"
          title="Unlink"><Unlink className="w-3.5 h-3.5" /></button>}
      </div>
    </div>
  );

  const findRel = (parentId: string, childId: string) =>
    relationships.find((r) => r.parent_id === parentId && r.child_id === childId);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="fixed inset-4 z-40 md:inset-8 lg:inset-12 bg-void-800 border border-white/[0.08] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 h-12 border-b border-white/[0.06] flex items-center justify-between px-4">
          <input type="text" {...register('title')}
            className="bg-transparent border-none text-bone-100 font-semibold text-lg focus:outline-none flex-shrink-1 min-w-0 mr-3" />
          <span className="bg-surface-600 text-ash-500 text-xs rounded-full px-2.5 py-0.5 flex-shrink-0">{entity.category}</span>
          <div className="flex items-center gap-3 flex-shrink-0 ml-3">
            <span className="text-ash-600 text-xs font-mono">{entity.uuid_short}</span>
            <button onClick={handleClose}
              className="p-1.5 rounded-md hover:bg-surface-600 text-ash-500 hover:text-bone-100 transition-colors"><X className="w-4 h-4" /></button>
          </div>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left: Editor / Calendar View */}
          <div className="flex-1 p-4 flex flex-col border-r border-white/[0.06] min-w-0 gap-2">
            <div className="flex items-center justify-between flex-shrink-0">
              <label className="text-xs text-ash-500 uppercase tracking-wider">
                {isCalendar ? (calendarView ? 'Calendar Grid' : 'Lore / Markdown') : 'Lore / Markdown'}
              </label>
              <div className="flex items-center gap-1.5">
                {isCalendar && (
                  <Toggle options={[
                    { label: 'Lore', value: 'lore', icon: <Eye className="w-3 h-3" /> },
                    { label: 'Calendar', value: 'cal', icon: <CalendarDays className="w-3 h-3" /> },
                  ]} value={calendarView ? 'cal' : 'lore'} onChange={(v) => setCalendarView(v === 'cal')} />
                )}
                {!calendarView && (
                  <Toggle options={[
                    { label: 'Rich', value: 'rich', icon: <Eye className="w-3 h-3" /> },
                    { label: 'Raw', value: 'raw', icon: <Code2 className="w-3 h-3" /> },
                  ]} value={editorMode} onChange={(v) => handleEditorModeChange(v as 'rich' | 'raw')} />
                )}
              </div>
            </div>
            <div className="flex-1 min-h-0 flex flex-col">
              {calendarView && isCalendar ? (
                calendarData ? (
                  <CalendarViewer data={calendarData} events={calendarEvents} seasons={calendarSeasons}
                    worldLore={entity.markdown_content || entity.json_attributes?.design_notes ? Object.values(entity.json_attributes?.design_notes || {}).filter(Boolean).join('\n') : undefined}
                    onEventsChange={handleCalendarEventsChange} />
                ) : (
                  <CalendarSetupPrompt onOpenEditor={() => setCalEditorOpen(true)} />
                )
              ) : editorMode === 'rich' ? (
                <MarkdownEditor value={richMarkdown} onChange={handleRichMarkdownChange} isRawMode={false} />
              ) : (
                <Textarea {...register('markdown_content')}
                  className="flex-1 bg-void-900 text-bone-400 font-mono text-xs min-h-full resize-none border border-white/[0.06] rounded-lg p-4 leading-relaxed focus-visible:ring-accent-gold/30 focus-visible:border-accent-gold/40 placeholder:text-ash-600"
                  placeholder="Write raw markdown here..." />
              )}
            </div>
          </div>
          {/* Right: Tags + Attributes + Links */}
          <div className="w-full md:w-80 flex-shrink-0 p-4 flex flex-col gap-4 overflow-y-auto">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-ash-500 uppercase tracking-wider">Tags</label>
              <TagInput tags={entity.tags} onAdd={(t) => addTag(entity.id, t)} onRemove={(t) => removeTag(entity.id, t)} suggestions={getAllTags()} placeholder="Add tag..." />
            </div>
            {/* Attributes */}
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between mb-2 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-ash-500 uppercase tracking-wider">Attributes</label>
                  {isCalendar && (
                    <button onClick={() => setCalEditorOpen(true)}
                      className={`p-1 rounded transition-colors ${calendarData ? 'text-ash-500 hover:text-accent-gold hover:bg-surface-600' : 'text-accent-gold animate-pulse'}`}
                      title={calendarData ? 'Edit Calendar Data' : 'Setup Calendar Grid'}><Settings2 className="w-3 h-3" /></button>
                  )}
                </div>
                <Toggle sm options={[{ label: 'Form', value: 'form' }, { label: 'JSON', value: 'json', icon: <Braces className="w-3 h-3" /> }]} value={attributesView} onChange={(v) => handleAttributesViewChange(v as 'form' | 'json')} />
              </div>
              {attributesView === 'form' ? (
                <div className="flex-1 overflow-y-auto max-h-[300px]">
                  <AttributeForm category={entity.category} attributes={entity.json_attributes} onChange={handleAttributeChange} />
                </div>
              ) : (
                <>
                  <Toggle sm options={[{ label: 'Edit', value: 'edit', icon: <Code2 className="w-3 h-3" /> }, { label: 'Preview', value: 'preview', icon: <Eye className="w-3 h-3" /> }]} value={jsonViewMode} onChange={(v) => setJsonViewMode(v as 'edit' | 'preview')} />
                  {jsonViewMode === 'edit' ? (
                    <>
                      <Textarea {...register('json_attributes')}
                        className={`flex-1 bg-void-900 text-bone-400 font-mono text-xs min-h-[200px] resize-none border rounded-lg p-3 focus-visible:ring-accent-gold/30 focus-visible:border-accent-gold/40 placeholder:text-ash-600 ${jsonError ? 'border-accent-blood focus-visible:ring-accent-blood/30 focus-visible:border-accent-blood/40' : 'border-white/[0.06]'}`}
                        placeholder="{}" />
                      {jsonError && <p className="text-accent-blood text-xs mt-1.5 leading-snug">⚠ {jsonError}</p>}
                    </>
                  ) : (
                    <div className="flex-1 min-h-[200px] bg-void-900 border border-white/[0.06] rounded-lg p-3 overflow-auto">
                      <JsonHighlighter code={(() => { try { return JSON.stringify(JSON.parse(getValues('json_attributes') || '{}'), null, 2); } catch { return getValues('json_attributes') || '{}'; } })()} />
                    </div>
                  )}
                </>
              )}
            </div>
            {/* Linked Entities */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2 flex-shrink-0">
                <label className="text-xs text-ash-500 uppercase tracking-wider">Linked Entities</label>
                <button onClick={() => setLinkDialogOpen(true)} className="p-1 rounded-md text-ash-500 hover:text-accent-gold hover:bg-surface-600 transition-colors" title="Link new entity"><Plus className="w-3.5 h-3.5" /></button>
              </div>
              <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                {parentEntities.map((p) => linkedItem(p, '←', findRel(p.id, entity.id)))}
                {childEntities.map((c) => linkedItem(c, '→', findRel(entity.id, c.id)))}
                {!parentEntities.length && !childEntities.length && <p className="text-ash-600 text-xs py-2 text-center italic">No linked entities</p>}
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="flex-shrink-0 h-10 border-t border-white/[0.06] flex items-center justify-between px-4">
          <div className="flex items-center gap-4 text-xs text-ash-600">
            {isDirty && <span className="flex items-center gap-1 text-accent-gold font-medium animate-pulse"><AlertTriangle className="w-3 h-3" /> Unsaved</span>}
            <span>Created {formatDate(entity.created_at)}</span>
            <span>Updated {formatDate(entity.updated_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => handleSubmit(onSave)()} className={`p-1.5 rounded-md transition-colors ${isDirty ? 'text-accent-gold hover:text-accent-gold-dim hover:bg-surface-600' : 'text-ash-600 cursor-default'}`} title={isDirty ? 'Save changes' : 'No changes to save'} disabled={!isDirty}><Check className="w-4 h-4" /></button>
            <button onClick={handleDuplicate} className="p-1.5 rounded-md text-ash-500 hover:text-bone-300 hover:bg-surface-600 transition-colors" title="Duplicate entity"><Copy className="w-4 h-4" /></button>
            <button onClick={() => togglePinEntity(entity.id)} className={`p-1.5 rounded-md transition-colors ${entity.isPinned ? 'text-accent-gold hover:text-accent-gold-dim' : 'text-ash-500 hover:text-bone-300 hover:bg-surface-600'}`} title={entity.isPinned ? 'Unpin entity' : 'Pin entity'}><Pin className={`w-4 h-4 ${entity.isPinned ? 'fill-current' : ''}`} /></button>
            <button onClick={() => setDeleteDialogOpen(true)} className="p-1.5 rounded-md text-accent-blood hover:bg-accent-blood/10 hover:text-accent-blood transition-colors" title="Delete entity"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
      <LinkEntityDialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen} entityId={entity.id} />
      <DeleteConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} entityTitle={entity.title} parentCount={parentEntities.length} childCount={childEntities.length} onConfirm={handleDelete} />
      <UnsavedChangesDialog open={unsavedDialogOpen} onOpenChange={setUnsavedDialogOpen} onDiscard={handleForceClose} />
      <ManualCalendarEditor open={calEditorOpen} onOpenChange={setCalEditorOpen}
        initialData={calendarData} onSave={handleCalendarEditSave} />
    </>
  );
}
