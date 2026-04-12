'use client';

import { Plus, Trash2, Save, X } from 'lucide-react';
import { CATEGORY_GROUPS, CATEGORY_ICONS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export type AttrType = 'string' | 'number' | 'boolean';

export const ATTR_TYPE_OPTIONS: { value: AttrType; label: string }[] = [
  { value: 'string', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Toggle' },
];

export const ICON_OPTIONS = Object.entries(CATEGORY_ICONS).map(([name]) => name);
export const GROUP_OPTIONS = [...Object.keys(CATEGORY_GROUPS), 'Custom'];

export function getDefaultForType(type: AttrType): string | number | boolean {
  switch (type) {
    case 'string': return '';
    case 'number': return 0;
    case 'boolean': return false;
  }
}

export type AttrEntry = { type: AttrType; default: string | number | boolean };

interface TemplateEditorProps {
  editingId: string;
  name: string;
  group: string;
  icon: string;
  baseCategory: string;
  baseCategoryOptions: string[];
  attrs: Record<string, AttrEntry>;
  setName: (_v: string) => void;
  setGroup: (_v: string) => void;
  setIcon: (_v: string) => void;
  setBaseCategory: (_v: string) => void;
  setAttrs: React.Dispatch<React.SetStateAction<Record<string, AttrEntry>>>;
  onSave: () => void;
  onAddAttr: () => void;
  onRemoveAttr: (_key: string) => void;
  onUpdateAttrKey: (_oldKey: string, _newKey: string) => void;
  onUpdateAttrType: (_key: string, _type: AttrType) => void;
  onUpdateAttrDefault: (_key: string, _value: string) => void;
  onClose: () => void;
}

export function TemplateEditor({
  editingId, name, group, icon, baseCategory, baseCategoryOptions, attrs,
  setName, setGroup, setIcon, setBaseCategory, setAttrs,
  onSave, onAddAttr, onRemoveAttr, onUpdateAttrKey, onUpdateAttrType, onUpdateAttrDefault,
  onClose,
}: TemplateEditorProps) {
  const builtInCategoryNames = new Set(Object.values(CATEGORY_GROUPS).flat());
  const selectableBaseCategories = baseCategoryOptions.filter(
    (cat) => cat !== name || builtInCategoryNames.has(cat),
  );

  return (
    <div className="border border-accent-gold/20 rounded-lg p-4 bg-void-900/50 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-accent-gold uppercase tracking-wider font-semibold">
          {editingId === 'new' ? 'New Template' : 'Editing Template'}
        </span>
        <button onClick={onClose}
          className="p-1 rounded text-ash-500 hover:text-bone-300 hover:bg-surface-600 transition-colors cursor-pointer">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="col-span-1 flex flex-col gap-1.5">
          <Label className="text-bone-300 text-xs">Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mecha"
            className="h-8 text-xs bg-void-900 border-white/[0.06] text-bone-300 placeholder:text-ash-600 focus-visible:ring-accent-gold/30" />
        </div>
        <div className="col-span-1 flex flex-col gap-1.5">
          <Label className="text-bone-300 text-xs">Group</Label>
          <Select value={group} onValueChange={setGroup}>
            <SelectTrigger className="h-8 text-xs bg-void-900 border-white/[0.06] text-bone-300 focus:ring-accent-gold/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-void-800 border-white/[0.08]">
              {GROUP_OPTIONS.map((g) => (
                <SelectItem key={g} value={g} className="text-xs text-bone-300">{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1 flex flex-col gap-1.5">
          <Label className="text-bone-300 text-xs">Icon</Label>
          <Select value={icon} onValueChange={setIcon}>
            <SelectTrigger className="h-8 text-xs bg-void-900 border-white/[0.06] text-bone-300 focus:ring-accent-gold/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-void-800 border-white/[0.08] max-h-48">
              {ICON_OPTIONS.map((ic) => (
                <SelectItem key={ic} value={ic} className="text-xs text-bone-300">{ic}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1 flex flex-col gap-1.5">
          <Label className="text-bone-300 text-xs">Extends</Label>
          <Select value={baseCategory || '__none__'} onValueChange={(v) => setBaseCategory(v === '__none__' ? '' : v)}>
            <SelectTrigger className="h-8 text-xs bg-void-900 border-white/[0.06] text-bone-300 focus:ring-accent-gold/20">
              <SelectValue placeholder="New category" />
            </SelectTrigger>
            <SelectContent className="bg-void-800 border-white/[0.08] max-h-48">
              <SelectItem value="__none__" className="text-xs text-bone-300">New category</SelectItem>
              {selectableBaseCategories.map((cat) => (
                <SelectItem key={cat} value={cat} className="text-xs text-bone-300">{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label className="text-bone-300 text-xs">Attributes Schema</Label>
          <Button variant="ghost" size="sm" onClick={onAddAttr}
            className="h-6 text-xs text-accent-gold hover:text-accent-gold hover:bg-surface-600/50 gap-1">
            <Plus className="w-3 h-3" /> Add Field
          </Button>
        </div>

        {!Object.keys(attrs).length && (
          <p className="text-ash-600 text-xs py-2 text-center italic">
            No attributes defined. Add fields to create the schema for this category.
          </p>
        )}

        <div className="flex flex-col gap-2">
          {Object.entries(attrs).map(([key, attr]) => (
            <div key={key}
              className="flex items-center gap-2 p-2 bg-void-800 border border-white/[0.04] rounded-md group/attr">
              <Input value={key} onChange={(e) => onUpdateAttrKey(key, e.target.value)}
                placeholder="field_name"
                className="flex-1 h-7 text-xs bg-transparent border-white/[0.06] text-bone-300 font-mono placeholder:text-ash-600 focus-visible:ring-accent-gold/30" />
              <Select value={attr.type} onValueChange={(v) => onUpdateAttrType(key, v as AttrType)}>
                <SelectTrigger className="w-20 h-7 text-xs bg-transparent border-white/[0.06] text-bone-300 focus:ring-accent-gold/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-void-800 border-white/[0.08]">
                  {ATTR_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs text-bone-300">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {attr.type === 'boolean' ? (
                <Switch checked={!!attr.default}
                  onCheckedChange={(checked) =>
                    setAttrs((prev) => ({ ...prev, [key]: { ...prev[key], default: checked } }))
                  }
                  className="data-[state=checked]:bg-accent-gold" />
              ) : (
                <Input value={String(attr.default)} onChange={(e) => onUpdateAttrDefault(key, e.target.value)}
                  placeholder={attr.type === 'number' ? '0' : 'default'}
                  type={attr.type === 'number' ? 'number' : 'text'}
                  className="w-20 h-7 text-xs bg-transparent border-white/[0.06] text-bone-300 font-mono placeholder:text-ash-600 focus-visible:ring-accent-gold/30" />
              )}
              <button onClick={() => onRemoveAttr(key)}
                className="p-1 rounded text-ash-600 hover:text-accent-blood hover:bg-accent-blood/10 transition-colors opacity-0 group-hover/attr:opacity-100 cursor-pointer">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={!name.trim()}
          className="bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30 border border-accent-gold/30 text-xs h-8">
          <Save className="w-3.5 h-3.5 mr-1.5" />
          {editingId === 'new' ? 'Create Template' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
