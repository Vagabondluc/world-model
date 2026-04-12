'use client';

import { useWorldStore } from '@/store/useWorldStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

interface AttributeFormProps {
  category: string;
  attributes: Record<string, unknown>;
  onChange: (_key: string, _value: unknown) => void;
}

/** Convert a snake_case key into a human-readable label. */
function humanizeKey(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/^./, (c) => c.toUpperCase());
}

function isArrayField(defaultValue: unknown): boolean {
  return Array.isArray(defaultValue);
}

function isNumberArray(defaultValue: unknown): boolean {
  if (!Array.isArray(defaultValue)) return false;
  if (defaultValue.length === 0) return false; // ambiguous – treat as string[]
  return defaultValue.every((v) => typeof v === 'number');
}

export function AttributeForm({ category, attributes, onChange }: AttributeFormProps) {
  const getEffectiveTemplate = useWorldStore((s) => s.getEffectiveTemplate);
  const template = getEffectiveTemplate(category);

  if (!template) {
    return (
      <p className="text-ash-600 text-xs py-3 text-center italic">
        No template fields for this category
      </p>
    );
  }

  const fields = Object.entries(template);

  return (
    <div className="flex flex-col gap-3">
      {fields.map(([key, defaultValue]) => {
        const label = humanizeKey(key);
        const value = attributes[key] ?? defaultValue;

        if (typeof defaultValue === 'boolean') {
          return (
            <div
              key={key}
              className="flex items-center justify-between gap-3 rounded-lg bg-void-900 border border-white/[0.06] px-3 py-2.5"
            >
              <Label className="text-bone-300 text-xs font-normal leading-none select-none">
                {label}
              </Label>
              <Switch
                checked={!!value}
                onCheckedChange={(checked) => onChange(key, checked)}
                className="data-[state=checked]:bg-accent-gold"
              />
            </div>
          );
        }

        if (isNumberArray(defaultValue)) {
          const displayValue = Array.isArray(value)
            ? (value as number[]).join(', ')
            : String(value ?? '');
          return (
            <div key={key} className="flex flex-col gap-1.5">
              <Label className="text-bone-300 text-xs font-normal leading-none select-none">
                {label}
              </Label>
              <Input
                type="text"
                value={displayValue}
                placeholder="Comma-separated numbers"
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw.trim() === '') {
                    onChange(key, []);
                    return;
                  }
                  const nums = raw
                    .split(',')
                    .map((s) => s.trim())
                    .filter((s) => s !== '')
                    .map(Number);
                  onChange(key, nums);
                }}
                className="bg-void-900 border-white/[0.06] text-bone-300 text-xs h-8 rounded-md focus-visible:ring-accent-gold/30 focus-visible:border-accent-gold/40 placeholder:text-ash-600"
              />
            </div>
          );
        }

        if (isArrayField(defaultValue)) {
          const displayValue = Array.isArray(value)
            ? (value as string[]).join(', ')
            : String(value ?? '');
          return (
            <div key={key} className="flex flex-col gap-1.5">
              <Label className="text-bone-300 text-xs font-normal leading-none select-none">
                {label}
              </Label>
              <Input
                type="text"
                value={displayValue}
                placeholder="Comma-separated values"
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw.trim() === '') {
                    onChange(key, []);
                    return;
                  }
                  const items = raw
                    .split(',')
                    .map((s) => s.trim())
                    .filter((s) => s !== '');
                  onChange(key, items);
                }}
                className="bg-void-900 border-white/[0.06] text-bone-300 text-xs h-8 rounded-md focus-visible:ring-accent-gold/30 focus-visible:border-accent-gold/40 placeholder:text-ash-600"
              />
            </div>
          );
        }

        if (typeof defaultValue === 'number') {
          return (
            <div key={key} className="flex flex-col gap-1.5">
              <Label className="text-bone-300 text-xs font-normal leading-none select-none">
                {label}
              </Label>
              <Input
                type="number"
                value={value as number}
                onChange={(e) => {
                  const v = e.target.value;
                  onChange(key, v === '' ? 0 : Number(v));
                }}
                className="bg-void-900 border-white/[0.06] text-bone-300 text-xs h-8 rounded-md focus-visible:ring-accent-gold/30 focus-visible:border-accent-gold/40 placeholder:text-ash-600"
              />
            </div>
          );
        }

        if (typeof defaultValue === 'object' && defaultValue !== null) {
          return (
            <div key={key} className="flex flex-col gap-1.5">
              <Label className="text-bone-300 text-xs font-normal leading-none select-none">
                {label}
              </Label>
              <Textarea
                value={JSON.stringify(value ?? defaultValue, null, 2)}
                rows={3}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    onChange(key, parsed);
                  } catch {
                    // keep raw value so user can finish typing
                  }
                }}
                className="bg-void-900 border-white/[0.06] text-bone-400 font-mono text-xs rounded-lg p-2.5 resize-none focus-visible:ring-accent-gold/30 focus-visible:border-accent-gold/40 placeholder:text-ash-600"
                placeholder="JSON"
              />
            </div>
          );
        }

        // Default: string input
        return (
          <div key={key} className="flex flex-col gap-1.5">
            <Label className="text-bone-300 text-xs font-normal leading-none select-none">
              {label}
            </Label>
            <Input
              type="text"
              value={(value as string) ?? ''}
              placeholder={label}
              onChange={(e) => onChange(key, e.target.value)}
              className="bg-void-900 border-white/[0.06] text-bone-300 text-xs h-8 rounded-md focus-visible:ring-accent-gold/30 focus-visible:border-accent-gold/40 placeholder:text-ash-600"
            />
          </div>
        );
      })}
    </div>
  );
}
