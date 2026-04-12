'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CATEGORY_ICONS } from '@/lib/types';
import { getCategoryIcon, CategoryIcon } from './category-icons';

// ---------------------------------------------------------------------------
// Shared props type for both sortable and static entity items
// ---------------------------------------------------------------------------
export type EntityItemProps = {
  entity: { id: string; title: string; uuid_short: string; category: string };
  depth: number;
  activeEntityId: string | null;
  setActiveEntity: (_id: string) => void;
  getChildEntities: (
    _parentId: string,
  ) => { id: string; title: string; uuid_short: string; category: string }[];
};

// ---------------------------------------------------------------------------
// Static version — no DnD hooks, used for SSR / pre-mount to avoid hydration mismatch
// ---------------------------------------------------------------------------
export function StaticEntityItem({
  entity,
  depth,
  activeEntityId,
  setActiveEntity,
  getChildEntities,
}: EntityItemProps) {
  const [childrenOpen, setChildrenOpen] = useState(true);
  const iconComponent = getCategoryIcon(CATEGORY_ICONS[entity.category] ?? '');
  const isActive = activeEntityId === entity.id;
  const children = getChildEntities(entity.id);
  const hasChildren = children.length > 0;

  return (
    <div>
      <button
        onClick={() => setActiveEntity(entity.id)}
        className={`
          group flex items-center w-full gap-2 px-3 py-1.5 text-left text-sm transition-colors cursor-pointer
          border-l-2
          ${isActive
            ? 'bg-surface-600 text-accent-gold border-l-accent-gold'
            : 'text-bone-400 border-l-transparent hover:bg-surface-600/50 hover:text-bone-100'
          }
        `}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        {hasChildren ? (
          <ChevronRight
            className={`shrink-0 size-3.5 text-ash-600 transition-transform duration-150 ${
              childrenOpen ? 'rotate-90' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setChildrenOpen(!childrenOpen);
            }}
          />
        ) : (
          <span className="shrink-0 w-3.5" />
        )}
        <CategoryIcon icon={iconComponent} className="shrink-0 size-3.5 text-ash-500 group-hover:text-ash-400" />
        <span className="truncate flex-1 min-w-0">{entity.title}</span>
        <span className="shrink-0 text-[10px] text-ash-600 font-mono">{entity.uuid_short}</span>
      </button>

      {/* Nested children */}
      {hasChildren && childrenOpen && (
        <div>
          {children.map((child) => (
            <StaticEntityItem
              key={child.id}
              entity={child}
              depth={depth + 1}
              activeEntityId={activeEntityId}
              setActiveEntity={setActiveEntity}
              getChildEntities={getChildEntities}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Recursive sortable entity item renderer (supports relationship nesting + DnD)
// ---------------------------------------------------------------------------
export function SortableEntityItem({
  entity,
  depth,
  activeEntityId,
  setActiveEntity,
  getChildEntities,
}: EntityItemProps) {
  const [childrenOpen, setChildrenOpen] = useState(true);
  const iconComponent = getCategoryIcon(CATEGORY_ICONS[entity.category] ?? '');
  const isActive = activeEntityId === entity.id;
  const children = getChildEntities(entity.id);
  const hasChildren = children.length > 0;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id: entity.id });

  const sortableStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={sortableStyle}>
      <button
        onClick={() => setActiveEntity(entity.id)}
        {...attributes}
        {...listeners}
        className={`
          group flex items-center w-full gap-2 px-3 py-1.5 text-left text-sm transition-colors cursor-pointer
          border-l-2
          ${isActive
            ? 'bg-surface-600 text-accent-gold border-l-accent-gold'
            : isOver
              ? 'bg-surface-600/70 text-bone-100 border-l-accent-gold/50 ring-1 ring-inset ring-accent-gold/30'
              : 'text-bone-400 border-l-transparent hover:bg-surface-600/50 hover:text-bone-100'
          }
        `}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        {hasChildren ? (
          <ChevronRight
            className={`shrink-0 size-3.5 text-ash-600 transition-transform duration-150 ${
              childrenOpen ? 'rotate-90' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setChildrenOpen(!childrenOpen);
            }}
          />
        ) : (
          <span className="shrink-0 w-3.5" />
        )}
        <CategoryIcon icon={iconComponent} className="shrink-0 size-3.5 text-ash-500 group-hover:text-ash-400" />
        <span className="truncate flex-1 min-w-0">{entity.title}</span>
        <span className="shrink-0 text-[10px] text-ash-600 font-mono">{entity.uuid_short}</span>
      </button>

      {/* Nested children */}
      {hasChildren && childrenOpen && (
        <div>
          {children.map((child) => (
            <SortableEntityItem
              key={child.id}
              entity={child}
              depth={depth + 1}
              activeEntityId={activeEntityId}
              setActiveEntity={setActiveEntity}
              getChildEntities={getChildEntities}
            />
          ))}
        </div>
      )}
    </div>
  );
}
