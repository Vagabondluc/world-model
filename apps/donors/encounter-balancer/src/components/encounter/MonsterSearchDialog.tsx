'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Search, Loader2, Plus, Crown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Monster, CR_TO_XP, MONSTER_TYPES } from '@/lib/encounter-types';
import { formatNumber } from '@/lib/format-utils';

interface MonsterTemplate {
  id: string;
  name: string;
  cr: string;
  xp: number;
  size: string;
  type: string;
  ac: number | null;
  hp: string | null;
  isLegendary: boolean;
  source: string | null;
  tags: string | null;
}

interface MonsterSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectMonster: (monster: Monster) => void;
}

const SIZES = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
const CR_OPTIONS = Object.keys(CR_TO_XP);

export function MonsterSearchDialog({ open, onOpenChange, onSelectMonster }: MonsterSearchDialogProps) {
  const [monsters, setMonsters] = useState<MonsterTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCr, setFilterCr] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterSize, setFilterSize] = useState<string>('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<{
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null>(null);

  const fetchMonsters = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filterCr) params.append('cr', filterCr);
      if (filterType) params.append('type', filterType);
      if (filterSize) params.append('size', filterSize);
      params.append('page', String(page));
      params.append('limit', '10');

      const response = await fetch(`/api/monsters?${params}`);
      if (response.ok) {
        const result = await response.json();
        setMonsters(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch monsters:', error);
    } finally {
      setIsLoading(false);
    }
  }, [search, filterCr, filterType, filterSize, page]);

  useEffect(() => {
    if (open) {
      fetchMonsters();
    }
  }, [open, fetchMonsters]);

  useEffect(() => {
    setPage(1);
  }, [search, filterCr, filterType, filterSize]);

  const handleSelectMonster = (template: MonsterTemplate) => {
    const monster: Monster = {
      id: `monster-${Date.now()}-${template.id}`,
      name: template.name,
      cr: template.cr,
      xp: template.xp,
      size: template.size as Monster['size'],
      type: template.type,
      count: 1,
      isLegendary: template.isLegendary,
    };
    onSelectMonster(monster);
    onOpenChange(false);
  };

  const handleClearFilters = () => {
    setSearch('');
    setFilterCr('');
    setFilterType('');
    setFilterSize('');
    setPage(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Monsters
          </DialogTitle>
          <DialogDescription>
            Search for monsters by name, CR, type, or size
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search monsters..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <Select value={filterCr} onValueChange={setFilterCr}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="CR" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any CR</SelectItem>
                {CR_OPTIONS.map(cr => (
                  <SelectItem key={cr} value={cr}>CR {cr}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Type</SelectItem>
                {MONSTER_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterSize} onValueChange={setFilterSize}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Size</SelectItem>
                {SIZES.map(size => (
                  <SelectItem key={size} value={size}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(search || filterCr || filterType || filterSize) && (
              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                Clear
              </Button>
            )}
          </div>

          {/* Results */}
          <ScrollArea className="h-[300px]">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : monsters.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No monsters found</p>
                <p className="text-sm mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="space-y-2 pr-4">
                {monsters.map((monster) => (
                  <div
                    key={monster.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => handleSelectMonster(monster)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{monster.name}</span>
                        {monster.isLegendary && (
                          <Crown className="h-4 w-4 text-amber-500" />
                        )}
                        <Badge variant="outline" className="text-xs">CR {monster.cr}</Badge>
                        <Badge variant="secondary" className="text-xs">{monster.type}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {monster.size} • {formatNumber(monster.xp)} XP
                        {monster.ac && ` • AC ${monster.ac}`}
                        {monster.hp && ` • HP ${monster.hp}`}
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground">
                Page {page} of {pagination.totalPages}
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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
