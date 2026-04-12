'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Monster, CR_TO_XP, MONSTER_TYPES } from '@/lib/encounter-types';

interface AddMonsterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMonster: (monster: Monster) => void;
}

const CR_OPTIONS = Object.keys(CR_TO_XP);

export function AddMonsterDialog({ open, onOpenChange, onAddMonster }: AddMonsterDialogProps) {
  const [newMonster, setNewMonster] = useState<Partial<Monster>>({
    name: '',
    cr: '1',
    xp: 200,
    size: 'Medium',
    type: 'Humanoid',
    count: 1,
  });

  const handleAddMonster = () => {
    if (!newMonster.name) return;
    
    const monster: Monster = {
      id: `monster-${Date.now()}`,
      name: newMonster.name,
      cr: newMonster.cr || '1',
      xp: CR_TO_XP[newMonster.cr || '1'] || 200,
      size: newMonster.size || 'Medium',
      type: newMonster.type || 'Humanoid',
      count: newMonster.count || 1,
      isCustom: true,
    };
    
    onAddMonster(monster);
    
    // Reset form
    setNewMonster({
      name: '',
      cr: '1',
      xp: 200,
      size: 'Medium',
      type: 'Humanoid',
      count: 1,
    });
    
    onOpenChange(false);
  };

  const handleCancel = () => {
    setNewMonster({
      name: '',
      cr: '1',
      xp: 200,
      size: 'Medium',
      type: 'Humanoid',
      count: 1,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Monster</DialogTitle>
          <DialogDescription>
            Add a monster to your encounter
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Monster Name</Label>
            <Input
              value={newMonster.name}
              onChange={(e) => setNewMonster({ ...newMonster, name: e.target.value })}
              placeholder="e.g., Goblin Warrior"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Challenge Rating</Label>
              <Select 
                value={newMonster.cr} 
                onValueChange={(v) => setNewMonster({ ...newMonster, cr: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CR_OPTIONS.map(cr => (
                    <SelectItem key={cr} value={cr}>CR {cr}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>XP Value</Label>
              <Input
                value={CR_TO_XP[newMonster.cr || '1']}
                disabled
                className="font-mono"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Size</Label>
              <Select 
                value={newMonster.size} 
                onValueChange={(v) => setNewMonster({ ...newMonster, size: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select 
                value={newMonster.type} 
                onValueChange={(v) => setNewMonster({ ...newMonster, type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONSTER_TYPES.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Count</Label>
            <Input
              type="number"
              min={1}
              value={newMonster.count}
              onChange={(e) => setNewMonster({ ...newMonster, count: Number(e.target.value) })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleAddMonster}>Add Monster</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
