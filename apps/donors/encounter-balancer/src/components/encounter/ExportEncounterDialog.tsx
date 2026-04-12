'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Download, 
  Printer, 
  FileJson, 
  FileText, 
  FileCode,
  Upload,
  Copy,
  Check
} from 'lucide-react';
import { 
  ExportableEncounter, 
  ExportFormat,
  downloadJSON,
  downloadMarkdown,
  downloadText,
  printEncounter,
  exportAsJSON,
  exportAsMarkdown,
  exportAsText,
  readImportedFile,
} from '@/lib/export-utils';
import type { Monster, TacticalElement, Reward, Difficulty } from '@/lib/encounter-types';

interface ExportEncounterDialogProps {
  // Encounter data
  name: string;
  location?: string;
  difficulty: Difficulty;
  partyLevel: number;
  playerCount: number;
  monsters: Monster[];
  tacticalElements: TacticalElement[];
  rewards: Reward[];
  notes?: string;
  // Environmental data
  physicalFeatures?: unknown[];
  environmentalMechanics?: unknown[];
  enemyForces?: unknown[];
  dynamicChanges?: unknown[];
  outcomes?: unknown[];
  transitionHooks?: unknown[];
  // Callbacks
  onImport?: (encounter: ExportableEncounter) => void;
  trigger?: React.ReactNode;
}

export function ExportEncounterDialog({
  name,
  location,
  difficulty,
  partyLevel,
  playerCount,
  monsters,
  tacticalElements,
  rewards,
  notes,
  physicalFeatures,
  environmentalMechanics,
  enemyForces,
  dynamicChanges,
  outcomes,
  transitionHooks,
  onImport,
  trigger,
}: ExportEncounterDialogProps) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('json');
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const encounter: ExportableEncounter = {
    name,
    location,
    difficulty,
    partyLevel,
    playerCount,
    monsters,
    tacticalElements,
    rewards,
    notes,
    physicalFeatures: physicalFeatures as ExportableEncounter['physicalFeatures'],
    environmentalMechanics: environmentalMechanics as ExportableEncounter['environmentalMechanics'],
    enemyForces: enemyForces as ExportableEncounter['enemyForces'],
    dynamicChanges: dynamicChanges as ExportableEncounter['dynamicChanges'],
    outcomes: outcomes as ExportableEncounter['outcomes'],
    transitionHooks: transitionHooks as ExportableEncounter['transitionHooks'],
  };

  const handleExport = () => {
    switch (format) {
      case 'json':
        downloadJSON(encounter);
        break;
      case 'markdown':
        downloadMarkdown(encounter);
        break;
      case 'text':
        downloadText(encounter);
        break;
    }
    setOpen(false);
  };

  const handlePrint = () => {
    printEncounter(encounter);
    setOpen(false);
  };

  const handleCopyToClipboard = async () => {
    let content: string;
    switch (format) {
      case 'json':
        content = exportAsJSON(encounter);
        break;
      case 'markdown':
        content = exportAsMarkdown(encounter);
        break;
      case 'text':
        content = exportAsText(encounter);
        break;
    }
    
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError(null);
    const importedEncounter = await readImportedFile(file);
    
    if (importedEncounter) {
      onImport?.(importedEncounter);
      setOpen(false);
    } else {
      setImportError('Failed to import file. Please check the file format.');
    }
    
    // Reset the input
    event.target.value = '';
  };

  const getFormatIcon = () => {
    switch (format) {
      case 'json':
        return <FileJson className="h-4 w-4" />;
      case 'markdown':
        return <FileCode className="h-4 w-4" />;
      case 'text':
        return <FileText className="h-4 w-4" />;
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Download className="h-4 w-4 mr-2" />
      Export
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export / Import Encounter</DialogTitle>
          <DialogDescription>
            Export your encounter to share or print, or import an existing encounter
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Export Format Selection */}
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileJson className="h-4 w-4" />
                    JSON - Full data (re-importable)
                  </div>
                </SelectItem>
                <SelectItem value="markdown">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    Markdown - Documentation format
                  </div>
                </SelectItem>
                <SelectItem value="text">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Plain Text - Simple format
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preview Info */}
          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            <div className="font-medium mb-1">{encounter.name || 'Unnamed Encounter'}</div>
            <div className="text-muted-foreground">
              {monsters.length} monsters • {tacticalElements.length} tactical elements • {rewards.length} rewards
            </div>
          </div>

          {/* Import Section */}
          {onImport && (
            <div className="border-t pt-4">
              <Label className="mb-2 block">Import Encounter</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <label className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Import JSON
                    <input 
                      type="file" 
                      accept=".json" 
                      className="hidden" 
                      onChange={handleImportFile}
                    />
                  </label>
                </Button>
                <span className="text-xs text-muted-foreground">
                  Import a previously exported encounter
                </span>
              </div>
              {importError && (
                <p className="text-destructive text-sm mt-2">{importError}</p>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex-wrap gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleCopyToClipboard}>
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleExport}>
            {getFormatIcon()}
            <span className="ml-2">Download</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
