'use client';

import { useState, useEffect } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Bookmark, Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ElementCard } from './ElementCard';

interface SavedElementData {
  id: string;
  name: string;
  type: string;
  category: string | null;
  description: string | null;
  data: string;
  tags: string | null;
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface SavedElementsPanelProps {
  onUseElement?: (element: SavedElementData) => void;
  trigger?: React.ReactNode;
}

export function SavedElementsPanel({ onUseElement, trigger }: SavedElementsPanelProps) {
  const [elements, setElements] = useState<SavedElementData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  const fetchElements = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (typeFilter !== 'all') params.append('type', typeFilter);
      params.append('page', String(page));
      params.append('limit', '10');
      
      const response = await fetch(`/api/elements?${params}`);
      if (response.ok) {
        const result = await response.json();
        // Handle paginated response format
        if (result.data && Array.isArray(result.data)) {
          setElements(result.data);
          setPagination(result.pagination);
        } else if (Array.isArray(result)) {
          // Fallback for non-paginated response
          setElements(result);
          setPagination(null);
        }
      }
    } catch (error) {
      console.error('Failed to fetch elements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1); // Reset to first page when search/filter changes
  }, [search, typeFilter]);

  useEffect(() => {
    fetchElements();
  }, [search, typeFilter, page]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/elements/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setElements(elements.filter(e => e.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete element:', error);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Bookmark className="h-4 w-4 mr-2" />
      Saved Elements
      {pagination && pagination.totalItems > 0 && (
        <Badge variant="secondary" className="ml-2">
          {pagination.totalItems}
        </Badge>
      )}
    </Button>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || defaultTrigger}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            Saved Elements
          </SheetTitle>
          <SheetDescription>
            Your collection of saved monsters, environments, and hazards
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search elements..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="monster">Monsters</SelectItem>
                <SelectItem value="environment">Environment</SelectItem>
                <SelectItem value="hazard">Hazards</SelectItem>
                <SelectItem value="tactic">Tactics</SelectItem>
                <SelectItem value="reward">Rewards</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <ScrollArea className="h-[calc(100vh-280px)]">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : elements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bookmark className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No saved elements yet</p>
                <p className="text-sm mt-1">Save elements from encounters to reuse them</p>
              </div>
            ) : (
              <div className="space-y-3 pr-4">
                {elements.map((element) => (
                  <ElementCard
                    key={element.id}
                    id={element.id}
                    title={element.name}
                    description={element.description || undefined}
                    type={element.type}
                    category={element.category || undefined}
                    tags={element.tags?.split(',').map(t => t.trim()) || []}
                    isSaved={true}
                    onDelete={() => handleDelete(element.id)}
                    onUse={onUseElement ? () => onUseElement(element) : undefined}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
          
          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground">
                {pagination.totalItems} item{pagination.totalItems !== 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={!pagination.hasPreviousPage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
