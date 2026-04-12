'use client';

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
  entityTitle: string;
  parentCount: number;
  childCount: number;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({
  open, onOpenChange, entityTitle, parentCount, childCount, onConfirm,
}: DeleteConfirmDialogProps) {
  const total = parentCount + childCount;
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-void-800 border-white/[0.08] sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-bone-100">
            Delete &ldquo;{entityTitle}&rdquo;?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-ash-500">
            This will permanently remove this entity and all its relationships.
            {total > 0 && (
              <span className="block mt-2 text-accent-blood text-xs">
                ⚠ This entity has {total} linked{' '}
                {total === 1 ? 'entity' : 'entities'}.{' '}
                Those links will be removed.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="text-ash-500 hover:text-bone-300 hover:bg-surface-600/50 border-white/[0.08]"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-accent-blood/20 text-accent-blood hover:bg-accent-blood/30 border border-accent-blood/30"
          >
            Delete Entity
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface UnsavedChangesDialogProps {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
  onDiscard: () => void;
}

export function UnsavedChangesDialog({
  open, onOpenChange, onDiscard,
}: UnsavedChangesDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-void-800 border-white/[0.08] sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-bone-100">Unsaved Changes</AlertDialogTitle>
          <AlertDialogDescription className="text-ash-500">
            You have unsaved changes. Closing will discard all unsaved edits to the title,
            markdown, and attributes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="text-ash-500 hover:text-bone-300 hover:bg-surface-600/50 border-white/[0.08]"
          >
            Keep Editing
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDiscard}
            className="bg-surface-600 text-bone-300 hover:bg-surface-500 hover:text-bone-100 border border-white/[0.08]"
          >
            Discard &amp; Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
