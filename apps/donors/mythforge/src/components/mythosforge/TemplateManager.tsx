'use client';

import { useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import { useWorldStore } from '@/store/useWorldStore';
import type { CustomCategoryDef, CustomAttributeDef } from '@/lib/types';
import { CATEGORY_GROUPS } from '@/lib/types';
import { TemplateEditor } from '@/components/mythosforge/TemplateEditor';
import { getDefaultForType, type AttrEntry, type AttrType } from '@/components/mythosforge/TemplateEditor';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface TemplateManagerProps {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
}

export function TemplateManager({ open, onOpenChange }: TemplateManagerProps) {
  const { customCategories, addCustomCategory, updateCustomCategory, removeCustomCategory } =
    useWorldStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [group, setGroup] = useState('Custom');
  const [icon, setIcon] = useState('FileText');
  const [baseCategory, setBaseCategory] = useState('');
  const [attrs, setAttrs] = useState<Record<string, AttrEntry>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const baseCategoryOptions = useMemo(
    () => Array.from(new Set([...Object.values(CATEGORY_GROUPS).flat(), ...customCategories.map((cat) => cat.name)])).sort(),
    [customCategories],
  );

  const handleNew = useCallback(() => {
    setEditingId('new');
    setName('');
    setGroup('Custom');
    setIcon('FileText');
    setBaseCategory('');
    setAttrs({});
  }, []);

  const handleEdit = useCallback((def: CustomCategoryDef) => {
    setEditingId(def.id);
    setName(def.name);
    setGroup(def.group);
    setIcon(def.icon);
    setBaseCategory(def.baseCategory ?? '');
    const converted: Record<string, AttrEntry> = {};
    for (const [key, attr] of Object.entries(def.attributes)) {
      converted[key] = { type: attr.type, default: attr.default };
    }
    setAttrs(converted);
  }, []);

  const handleSave = useCallback(() => {
    if (!name.trim()) return;
    const attributesDef: Record<string, CustomAttributeDef> = {};
    for (const [key, val] of Object.entries(attrs)) {
      attributesDef[key] = { type: val.type, default: val.default };
    }
    if (editingId === 'new') {
      addCustomCategory({
        id: uuidv4(),
        name: name.trim(),
        group,
        icon,
        baseCategory: baseCategory || undefined,
        attributes: attributesDef,
      });
    } else if (editingId) {
      updateCustomCategory(editingId, { name: name.trim(), group, icon, baseCategory: baseCategory || undefined, attributes: attributesDef });
    }
    setEditingId(null);
  }, [editingId, name, group, icon, baseCategory, attrs, addCustomCategory, updateCustomCategory]);

  const handleDelete = useCallback(
    (id: string) => {
      removeCustomCategory(id);
      setDeleteConfirmId(null);
      if (editingId === id) setEditingId(null);
    },
    [removeCustomCategory, editingId],
  );

  const addAttr = useCallback(() => {
    const key = `field_${Object.keys(attrs).length + 1}`;
    setAttrs((prev) => ({ ...prev, [key]: { type: 'string', default: '' } }));
  }, [attrs]);

  const removeAttr = useCallback((key: string) => {
    setAttrs((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const updateAttrKey = useCallback((oldKey: string, newKey: string) => {
    if (oldKey === newKey) return;
    setAttrs((prev) => {
      const next: typeof prev = {};
      for (const [k, v] of Object.entries(prev)) {
        next[k === oldKey ? newKey : k] = v;
      }
      return next;
    });
  }, []);

  const updateAttrType = useCallback((key: string, type: AttrType) => {
    setAttrs((prev) => ({ ...prev, [key]: { type, default: getDefaultForType(type) } }));
  }, []);

  const updateAttrDefault = useCallback((key: string, defaultVal: string) => {
    setAttrs((prev) => {
      const current = prev[key];
      if (!current) return prev;
      let parsed: string | number | boolean = defaultVal;
      if (current.type === 'number') parsed = Number(defaultVal) || 0;
      else if (current.type === 'boolean') parsed = defaultVal === 'true';
      return { ...prev, [key]: { ...current, default: parsed } };
    });
  }, []);

  const isEditing = editingId !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-void-800 border-white/[0.08] sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-accent-gold">Entity Template Manager</DialogTitle>
          <DialogDescription className="text-ash-500">
            Create custom entity categories with their own attribute schemas. No database migrations
            needed — the &ldquo;Magic Folder&rdquo; handles it all.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-ash-500 uppercase tracking-wider font-semibold">
                Custom Templates ({customCategories.length})
              </span>
              {!isEditing && (
                <Button variant="ghost" size="sm" onClick={handleNew}
                  className="h-7 text-xs text-accent-gold hover:text-accent-gold hover:bg-surface-600/50 gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> New Template
                </Button>
              )}
            </div>

            {customCategories.length === 0 && !isEditing && (
              <p className="text-ash-600 text-xs py-4 text-center italic">
                No custom templates yet. Create one to define a new entity type with its own attributes.
              </p>
            )}

            {customCategories.map((cat) => (
              <div key={cat.id}
                className="flex items-center justify-between gap-3 p-3 bg-void-900 border border-white/[0.06] rounded-lg group">
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-bone-100 text-sm font-medium">{cat.name}</span>
                    <span className="text-ash-600 text-xs bg-surface-600 px-1.5 py-0.5 rounded">{cat.group}</span>
                    {cat.baseCategory && (
                      <span className="text-ash-600 text-xs bg-surface-600/80 px-1.5 py-0.5 rounded">
                        extends {cat.baseCategory}
                      </span>
                    )}
                  </div>
                  <span className="text-ash-600 text-xs mt-0.5">
                    {Object.keys(cat.attributes).length} attribute{Object.keys(cat.attributes).length !== 1 ? 's' : ''}
                    {Object.keys(cat.attributes).length > 0 && `: ${Object.keys(cat.attributes).join(', ')}`}
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => handleEdit(cat)}
                    className="p-1.5 rounded-md text-ash-500 hover:text-bone-300 hover:bg-surface-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Edit template"><Edit3 className="w-3.5 h-3.5" /></button>
                  {deleteConfirmId === cat.id ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleDelete(cat.id)}
                        className="px-2 py-0.5 text-xs rounded bg-accent-blood/20 text-accent-blood hover:bg-accent-blood/30 cursor-pointer">Confirm</button>
                      <button onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-0.5 text-xs rounded bg-surface-600 text-ash-500 hover:text-bone-300 cursor-pointer">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirmId(cat.id)}
                      className="p-1.5 rounded-md text-ash-500 hover:text-accent-blood hover:bg-accent-blood/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Delete template"><Trash2 className="w-3.5 h-3.5" /></button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {isEditing && (
            <TemplateEditor
              editingId={editingId}
              name={name}
              group={group}
              icon={icon}
              baseCategory={baseCategory}
              baseCategoryOptions={baseCategoryOptions}
              attrs={attrs}
              setName={setName}
              setGroup={setGroup}
              setIcon={setIcon}
              setBaseCategory={setBaseCategory}
              setAttrs={setAttrs}
              onSave={handleSave} onAddAttr={addAttr} onRemoveAttr={removeAttr}
              onUpdateAttrKey={updateAttrKey} onUpdateAttrType={updateAttrType}
              onUpdateAttrDefault={updateAttrDefault} onClose={() => setEditingId(null)}
            />
          )}
        </div>
        <DialogFooter className="flex-shrink-0 border-t border-white/[0.06] pt-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}
            className="text-ash-500 hover:text-bone-300 hover:bg-surface-600/50">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
