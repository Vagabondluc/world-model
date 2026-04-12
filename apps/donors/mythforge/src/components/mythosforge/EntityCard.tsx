'use client';

import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Pin, ExternalLink, Trash2, PinOff, CopyPlus } from 'lucide-react';
import type { Entity } from '@/lib/types';
import { useWorldStore } from '@/store/useWorldStore';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface EntityCardProps {
  entity: Entity;
}

export function EntityCard({ entity }: EntityCardProps) {
  const { setActiveEntity, deleteEntity, togglePinEntity, duplicateEntity, pinnedEntityIds } = useWorldStore();
  const [copied, setCopied] = useState(false);

  const isPinned = pinnedEntityIds.includes(entity.id);

  const handleCopyId = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      navigator.clipboard.writeText(entity.id).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    },
    [entity.id]
  );

  const handlePinToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      togglePinEntity(entity.id);
    },
    [entity.id, togglePinEntity]
  );

  const handleClick = useCallback(() => {
    setActiveEntity(entity.id);
  }, [entity.id, setActiveEntity]);

  const handleContextOpen = useCallback(() => {
    setActiveEntity(entity.id);
  }, [entity.id, setActiveEntity]);

  const handleContextDuplicate = useCallback(() => {
    const dup = duplicateEntity(entity.id);
    if (dup) {
      setActiveEntity(dup.id);
    }
  }, [entity.id, duplicateEntity, setActiveEntity]);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleContextDelete = useCallback(() => {
    setDeleteConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    deleteEntity(entity.id);
    setDeleteConfirmOpen(false);
  }, [entity.id, deleteEntity]);

  const handleContextPin = useCallback(() => {
    togglePinEntity(entity.id);
  }, [entity.id, togglePinEntity]);

  return (
    <>
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          data-testid={`entity-card-${entity.title}`}
          onClick={handleClick}
          className="entity-card-glow bg-surface-700 border border-white/[0.06] rounded-lg p-4 cursor-pointer select-none"
        >
          {/* Top row: category badge + pin */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="bg-surface-600 text-ash-500 text-xs rounded-full px-2 py-0.5">
                {entity.category}
              </span>
              {entity.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="bg-accent-gold/10 text-accent-gold/70 text-[10px] rounded-full px-1.5 py-0.5 border border-accent-gold/15"
                >
                  {tag}
                </span>
              ))}
              {entity.tags.length > 3 && (
                <span className="text-ash-600 text-[10px]">
                  +{entity.tags.length - 3}
                </span>
              )}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handlePinToggle}
                  className={`transition-colors ${
                    isPinned ? 'text-accent-arcane' : 'text-ash-600 hover:text-ash-500'
                  }`}
                >
                  <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-current' : ''}`} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-void-700 border-white/[0.08] text-bone-300 text-xs">
                {isPinned ? 'Unpin entity' : 'Pin entity'}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Title */}
          <h3 data-testid={`entity-title-${entity.title}`} className="text-bone-100 font-semibold text-base mb-2 leading-snug">
            {entity.title}
          </h3>

          {/* Markdown preview */}
          {entity.markdown_content && (
            <div className="max-h-[6rem] overflow-hidden mb-3 prose prose-invert prose-sm max-w-none lore-serif prose-headings:text-bone-100 prose-headings:font-semibold prose-p:text-bone-400 prose-p:leading-relaxed prose-p:mt-0 prose-li:text-bone-400 prose-strong:text-bone-100 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_a]:text-accent-gold [&_a]:no-underline hover:[&_a]:underline [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-xs [&_h1]:mt-0 [&_h2]:mt-0 [&_h3]:mt-0 [&_hr]:border-white/[0.06] [&_p:first-child]:mt-0">
              <ReactMarkdown>{entity.markdown_content}</ReactMarkdown>
            </div>
          )}

          {/* Bottom row: uuid_short + copy */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/[0.04]">
            <span className="text-ash-600 text-xs font-mono">{entity.uuid_short}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleCopyId}
                  className="flex items-center gap-1 text-ash-600 hover:text-ash-500 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span className="text-xs">{copied ? 'Copied!' : 'Copy ID'}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-void-700 border-white/[0.08] text-bone-300 text-xs">
                Copy full ID
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent className="bg-void-800 border-white/[0.08] text-bone-300">
        <ContextMenuItem
          onClick={handleContextOpen}
          className="text-bone-300 focus:bg-white/[0.06] focus:text-bone-100 cursor-pointer"
        >
          <ExternalLink className="size-4 text-ash-500" />
          Open
        </ContextMenuItem>
        <ContextMenuItem
          onClick={handleContextPin}
          className="text-bone-300 focus:bg-white/[0.06] focus:text-bone-100 cursor-pointer"
        >
          {isPinned ? (
            <PinOff className="size-4 text-ash-500" />
          ) : (
            <Pin className="size-4 text-ash-500" />
          )}
          {isPinned ? 'Unpin' : 'Pin'}
        </ContextMenuItem>
        <ContextMenuItem
          onClick={handleContextDuplicate}
          className="text-bone-300 focus:bg-white/[0.06] focus:text-bone-100 cursor-pointer"
        >
          <CopyPlus className="size-4 text-ash-500" />
          Duplicate
        </ContextMenuItem>
        <ContextMenuSeparator className="bg-white/[0.06]" />
        <ContextMenuItem
          onClick={handleContextDelete}
          className="text-red-400 focus:bg-white/[0.06] focus:text-red-300 cursor-pointer"
        >
          <Trash2 className="size-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>

    {/* Delete Confirmation Dialog */}
    <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
      <AlertDialogContent className="bg-void-800 border-white/[0.08] sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-accent-blood">Delete "{entity.title}"?</AlertDialogTitle>
          <AlertDialogDescription className="text-ash-400">
            This will permanently remove the entity and all its relationships. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-ash-400 hover:text-bone-100 hover:bg-surface-600/50">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmDelete}
            className="bg-accent-blood text-white hover:bg-red-600">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
