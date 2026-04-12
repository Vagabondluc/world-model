'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wand2, Loader2, RefreshCw, Dice5 } from 'lucide-react';

interface PopoverGenerateButtonProps<T> {
  onGenerate: (options: GenerateOptions) => T | Promise<T>;
  onApply: (result: T) => void;
  label?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  options?: GenerateOptionField[];
  className?: string;
}

export interface GenerateOptions {
  location?: string;
  theme?: string;
  challengeLevel?: string;
  partyLevel?: number;
  playerCount?: number;
  difficulty?: string;
  monsterNames?: string[];
  [key: string]: unknown;
}

export interface GenerateOptionField {
  key: string;
  label: string;
  type: 'select' | 'number' | 'text';
  options?: { value: string; label: string }[];
  placeholder?: string;
  defaultValue?: string | number;
}

export function PopoverGenerateButton<T>({
  onGenerate,
  onApply,
  label = 'Generate',
  icon,
  variant = 'outline',
  size = 'sm',
  options = [],
  className,
}: PopoverGenerateButtonProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<T | null>(null);
  const [optionValues, setOptionValues] = useState<Record<string, string | number>>(() => {
    const defaults: Record<string, string | number> = {};
    options.forEach(opt => {
      if (opt.defaultValue !== undefined) {
        defaults[opt.key] = opt.defaultValue;
      }
    });
    return defaults;
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const generateOptions: GenerateOptions = {};
      options.forEach(opt => {
        const value = optionValues[opt.key];
        if (value !== undefined && value !== '') {
          if (opt.type === 'number') {
            generateOptions[opt.key] = Number(value);
          } else {
            generateOptions[opt.key] = String(value);
          }
        }
      });
      
      const result = await onGenerate(generateOptions);
      setGeneratedResult(result);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (generatedResult) {
      onApply(generatedResult);
      setGeneratedResult(null);
      setIsOpen(false);
    }
  };

  const handleReroll = () => {
    handleGenerate();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          {icon || <Wand2 className="h-4 w-4" />}
          {label && <span className="ml-1">{label}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Dice5 className="h-4 w-4 text-primary" />
            <h4 className="font-medium">Generate Content</h4>
          </div>
          
          {options.length > 0 && (
            <div className="space-y-3">
              {options.map((opt) => (
                <div key={opt.key} className="space-y-1">
                  <Label className="text-xs">{opt.label}</Label>
                  {opt.type === 'select' && opt.options ? (
                    <Select
                      value={String(optionValues[opt.key] || '')}
                      onValueChange={(v) => setOptionValues(prev => ({ ...prev, [opt.key]: v }))}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder={opt.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {opt.options.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : opt.type === 'number' ? (
                    <Input
                      type="number"
                      className="h-8"
                      placeholder={opt.placeholder}
                      value={optionValues[opt.key] ?? opt.defaultValue ?? ''}
                      onChange={(e) => setOptionValues(prev => ({ ...prev, [opt.key]: Number(e.target.value) }))}
                    />
                  ) : (
                    <Input
                      className="h-8"
                      placeholder={opt.placeholder}
                      value={optionValues[opt.key] ?? ''}
                      onChange={(e) => setOptionValues(prev => ({ ...prev, [opt.key]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1"
              size="sm"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Dice5 className="h-4 w-4 mr-1" />
              )}
              Generate
            </Button>
            {generatedResult && (
              <Button
                onClick={handleReroll}
                disabled={isGenerating}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {generatedResult && (
            <div className="space-y-2">
              <div className="p-3 bg-muted rounded-md text-sm max-h-48 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-xs">
                  {typeof generatedResult === 'string' 
                    ? generatedResult 
                    : JSON.stringify(generatedResult, null, 2)}
                </pre>
              </div>
              <Button onClick={handleApply} className="w-full" size="sm">
                Apply
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Specialized button for single-field generation
interface QuickGenerateButtonProps {
  onGenerate: () => unknown;
  onApply: (result: unknown) => void;
  tooltip?: string;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
}

export function QuickGenerateButton({
  onGenerate,
  onApply,
  size = 'sm',
  variant = 'ghost',
}: QuickGenerateButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleClick = async () => {
    setIsGenerating(true);
    try {
      const result = onGenerate();
      onApply(result);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isGenerating}
      className="h-7 w-7 p-0"
    >
      {isGenerating ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Dice5 className="h-3 w-3" />
      )}
    </Button>
  );
}
