'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { TacticalElement } from '@/lib/encounter-types';

interface AddTacticalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTactical: (tactical: TacticalElement) => void;
}

const TACTICAL_TYPES = [
  { value: 'cover', label: 'Cover' },
  { value: 'hazard', label: 'Hazard' },
  { value: 'objective', label: 'Objective' },
  { value: 'terrain', label: 'Terrain' },
  { value: 'other', label: 'Other' },
] as const;

export function AddTacticalDialog({ open, onOpenChange, onAddTactical }: AddTacticalDialogProps) {
  const [newTactical, setNewTactical] = useState<Partial<TacticalElement>>({
    name: '',
    description: '',
    type: 'terrain',
  });

  const handleAddTactical = () => {
    if (!newTactical.name) return;
    
    const tactical: TacticalElement = {
      id: `tactical-${Date.now()}`,
      name: newTactical.name,
      description: newTactical.description || '',
      type: newTactical.type as TacticalElement['type'] || 'terrain',
    };
    
    onAddTactical(tactical);
    
    // Reset form
    setNewTactical({ name: '', description: '', type: 'terrain' });
    onOpenChange(false);
  };

  const handleCancel = () => {
    setNewTactical({ name: '', description: '', type: 'terrain' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Tactical Element</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={newTactical.name}
              onChange={(e) => setNewTactical({ ...newTactical, name: e.target.value })}
              placeholder="e.g., Partial Cover"
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select 
              value={newTactical.type} 
              onValueChange={(v) => setNewTactical({ ...newTactical, type: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TACTICAL_TYPES.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={newTactical.description}
              onChange={(e) => setNewTactical({ ...newTactical, description: e.target.value })}
              placeholder="Describe the tactical element..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleAddTactical}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
