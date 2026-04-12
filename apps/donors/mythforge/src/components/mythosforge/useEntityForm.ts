'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useWorldStore } from '@/store/useWorldStore';
import { validateEntityAttributes } from '@/lib/validation';

export type EditorMode = 'rich' | 'raw';
export type AttributesView = 'form' | 'json';
export type JsonViewMode = 'edit' | 'preview';

export interface FormData {
  title: string;
  markdown_content: string;
  json_attributes: string;
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function useEntityForm() {
  const {
    activeEntityId, entities, relationships,
    setActiveEntity, updateEntity, deleteEntity, duplicateEntity,
    deleteRelationship, togglePinEntity, getChildEntities, getParentEntities,
    addTag, removeTag, getAllTags, customCategories,
  } = useWorldStore();

  const [jsonError, setJsonError] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>('rich');
  const [attributesView, setAttributesView] = useState<AttributesView>('form');
  const [jsonViewMode, setJsonViewMode] = useState<JsonViewMode>('edit');
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [unsavedDialogOpen, setUnsavedDialogOpen] = useState(false);
  const [richMarkdown, setRichMarkdown] = useState('');
  const richMarkdownRef = useRef<string>('');

  const {
    register, handleSubmit, reset, setValue, getValues,
    formState: { isDirty },
  } = useForm<FormData>({
    defaultValues: { title: '', markdown_content: '', json_attributes: '' },
  });

  const entity = entities.find((e) => e.id === activeEntityId);
  const childEntities = activeEntityId ? getChildEntities(activeEntityId) : [];
  const parentEntities = activeEntityId ? getParentEntities(activeEntityId) : [];

  useEffect(() => {
    if (!activeEntityId) return;
    const e = useWorldStore.getState().entities.find((ent) => ent.id === activeEntityId);
    if (!e) return;
    richMarkdownRef.current = e.markdown_content;
    queueMicrotask(() => {
      reset({
        title: e.title,
        markdown_content: e.markdown_content,
        json_attributes: JSON.stringify(e.json_attributes, null, 2),
      });
      setRichMarkdown(e.markdown_content);
      setJsonError(null);
    });
  }, [activeEntityId, reset]);

  // Debounced save: avoid flooding undo history on every keystroke
  const debouncedSave = useCallback(
    (value: string) => {
      if (activeEntityId) updateEntity(activeEntityId, { markdown_content: value });
    },
    [activeEntityId, updateEntity],
  );
  const debouncedSaveRef = useRef(debouncedSave);
  useEffect(() => { debouncedSaveRef.current = debouncedSave; }, [debouncedSave]);

  const handleRichMarkdownChange = useCallback(
    (value: string) => {
      richMarkdownRef.current = value;
      setRichMarkdown(value);
      debouncedSaveRef.current(value);
    },
    [],
  );

  const handleAttributeChange = useCallback(
    (key: string, value: unknown) => {
      if (!activeEntityId) return;
      const current = useWorldStore.getState().entities.find((e) => e.id === activeEntityId);
      updateEntity(activeEntityId, {
        json_attributes: { ...(current?.json_attributes ?? {}), [key]: value },
      });
    },
    [activeEntityId, updateEntity],
  );

  const handleEditorModeChange = useCallback(
    (mode: EditorMode) => {
      if (mode === 'raw' && editorMode === 'rich') {
        setValue('markdown_content', richMarkdownRef.current);
      } else if (mode === 'rich' && editorMode === 'raw') {
        const rawValue = getValues('markdown_content');
        setRichMarkdown(rawValue);
        richMarkdownRef.current = rawValue;
      }
      setEditorMode(mode);
    },
    [editorMode, setValue, getValues],
  );

  const handleAttributesViewChange = useCallback(
    (view: AttributesView) => {
      if (view === 'json' && attributesView === 'form') {
        const current = useWorldStore.getState().entities.find((e) => e.id === activeEntityId);
        if (current) {
          setValue('json_attributes', JSON.stringify(current.json_attributes, null, 2));
          setJsonError(null);
        }
      }
      setAttributesView(view);
    },
    [attributesView, activeEntityId, setValue],
  );

  const onSave = useCallback(
    (data: FormData) => {
      if (!activeEntityId) return;
      const currentEntity = useWorldStore.getState().entities.find((e) => e.id === activeEntityId);
      const updates: {
        title: string;
        markdown_content: string;
        json_attributes?: Record<string, unknown>;
      } = {
        title: data.title,
        markdown_content: editorMode === 'rich' ? richMarkdownRef.current : data.markdown_content,
      };
      if (attributesView === 'json') {
        try {
          const parsedAttributes = JSON.parse(data.json_attributes);
          const validation = validateEntityAttributes(
            currentEntity?.category || '',
            parsedAttributes,
            customCategories,
          );
          if (!validation.success) {
            setJsonError(validation.errors.join('; '));
            return;
          }
          updates.json_attributes = validation.data;
          setJsonError(null);
        } catch (err) {
          setJsonError(err instanceof Error ? err.message : 'Invalid JSON');
          return;
        }
      }
      updateEntity(activeEntityId, updates);
      reset({
        title: data.title,
        markdown_content: updates.markdown_content,
        json_attributes:
          attributesView === 'json'
            ? data.json_attributes
            : JSON.stringify(
                useWorldStore.getState().entities.find((e) => e.id === activeEntityId)?.json_attributes ?? {},
                null,
                2,
              ),
      });
    },
    [activeEntityId, editorMode, attributesView, updateEntity, reset, customCategories],
  );

  const handleDelete = useCallback(() => {
    if (!activeEntityId) return;
    deleteEntity(activeEntityId);
    setDeleteDialogOpen(false);
  }, [activeEntityId, deleteEntity]);

  const handleDuplicate = useCallback(() => {
    if (!activeEntityId) return;
    const dup = duplicateEntity(activeEntityId);
    if (dup) setActiveEntity(dup.id);
  }, [activeEntityId, duplicateEntity, setActiveEntity]);

  const handleDeleteRelationship = useCallback(
    (relationshipId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      deleteRelationship(relationshipId);
    },
    [deleteRelationship],
  );

  const handleClose = useCallback(() => {
    if (isDirty) setUnsavedDialogOpen(true);
    else setActiveEntity(null);
  }, [isDirty, setActiveEntity]);

  const handleForceClose = useCallback(() => {
    setUnsavedDialogOpen(false);
    setActiveEntity(null);
  }, [setActiveEntity]);

  return {
    jsonError, editorMode, attributesView, jsonViewMode, setJsonViewMode,
    linkDialogOpen, setLinkDialogOpen, deleteDialogOpen, setDeleteDialogOpen,
    unsavedDialogOpen, setUnsavedDialogOpen, richMarkdown, richMarkdownRef,
    register, handleSubmit, isDirty, getValues,
    entity, childEntities, parentEntities, relationships,
    handleRichMarkdownChange, handleAttributeChange,
    handleEditorModeChange, handleAttributesViewChange,
    onSave, handleDelete, handleDuplicate,
    handleDeleteRelationship, handleClose, handleForceClose,
    addTag, removeTag, getAllTags, togglePinEntity, setActiveEntity,
    formatDate,
  };
}
