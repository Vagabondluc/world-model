'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  MoreVertical, 
  Save, 
  Copy, 
  Trash2, 
  Edit, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { ElementType } from '@/lib/encounter-types';

interface ElementCardProps {
  id: string;
  title: string;
  description?: string;
  type: ElementType | string;
  category?: string;
  tags?: string[];
  children?: React.ReactNode;
  expandedContent?: React.ReactNode;
  onSave?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onUse?: () => void;
  isSaved?: boolean;
  showExpand?: boolean;
  defaultExpanded?: boolean;
  className?: string;
}

const typeColors: Record<string, string> = {
  monster: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  environment: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  hazard: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  tactic: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
  reward: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  feature: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300',
  terrain: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  weather: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
};

export function ElementCard({
  id,
  title,
  description,
  type,
  category,
  tags = [],
  children,
  expandedContent,
  onSave,
  onEdit,
  onDelete,
  onDuplicate,
  onUse,
  isSaved = false,
  showExpand = false,
  defaultExpanded = false,
  className = '',
}: ElementCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card className={`relative transition-all duration-200 hover:shadow-md ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Badge 
                variant="secondary" 
                className={`${typeColors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'} text-xs`}
              >
                {type}
              </Badge>
              {category && (
                <Badge variant="outline" className="text-xs">
                  {category}
                </Badge>
              )}
              {isSaved && (
                <Badge variant="default" className="text-xs bg-primary">
                  Saved
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg leading-tight">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1 line-clamp-2">
                {description}
              </CardDescription>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onUse && (
                <DropdownMenuItem onClick={onUse}>
                  <Copy className="mr-2 h-4 w-4" />
                  Use in Encounter
                </DropdownMenuItem>
              )}
              {onSave && !isSaved && (
                <DropdownMenuItem onClick={onSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Element
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDuplicate && (
                <DropdownMenuItem onClick={onDuplicate}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {children}
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {showExpand && expandedContent && (
          <div className="mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full justify-between"
            >
              <span>{isExpanded ? 'Hide Details' : 'Show Details'}</span>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            
            {isExpanded && (
              <div className="mt-3 pt-3 border-t">
                {expandedContent}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
