'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Download, 
  Printer, 
  FileJson, 
  FileText, 
  FileCode,
  Upload,
  Loader2
} from 'lucide-react';
import { 
  downloadJSON, 
  downloadMarkdown, 
  downloadText, 
  printEncounter,
  readImportedFile,
  ExportableEncounter
} from '@/lib/export-utils';

interface ExportPrintButtonProps {
  data: ExportableEncounter;
  onImport?: (data: ExportableEncounter) => void;
  disabled?: boolean;
}

export function ExportPrintButton({ data, onImport, disabled }: ExportPrintButtonProps) {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filename = (data.name as string)?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'encounter';

  const handleExport = (format: 'json' | 'markdown' | 'text') => {
    switch (format) {
      case 'json':
        downloadJSON(data, filename);
        break;
      case 'markdown':
        downloadMarkdown(data, filename);
        break;
      case 'text':
        downloadText(data, filename);
        break;
    }
  };

  const handlePrint = () => {
    printEncounter(data);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportError(null);

    try {
      const importedData = await readImportedFile(file);
      if (onImport) {
        onImport(importedData);
        setShowImportDialog(false);
      }
    } catch (error) {
      setImportError((error as Error).message);
      setShowImportDialog(true);
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={disabled}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleExport('json')}>
            <FileJson className="h-4 w-4 mr-2" />
            Export as JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('markdown')}>
            <FileCode className="h-4 w-4 mr-2" />
            Export as Markdown
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('text')}>
            <FileText className="h-4 w-4 mr-2" />
            Export as Text
          </DropdownMenuItem>
          {onImport && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleImportClick}>
                <Upload className="h-4 w-4 mr-2" />
                Import Encounter
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Import Error Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Error</DialogTitle>
            <DialogDescription>
              {importError || 'An error occurred while importing the encounter.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowImportDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
