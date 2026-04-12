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
import { Reward } from '@/lib/encounter-types';

interface AddRewardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddReward: (reward: Reward) => void;
}

const REWARD_TYPES = [
  { value: 'treasure', label: 'Treasure' },
  { value: 'xp', label: 'Experience Points' },
  { value: 'item', label: 'Magic Item' },
  { value: 'story', label: 'Story Reward' },
] as const;

export function AddRewardDialog({ open, onOpenChange, onAddReward }: AddRewardDialogProps) {
  const [newReward, setNewReward] = useState<Partial<Reward>>({
    type: 'treasure',
    description: '',
    value: 0,
  });

  const handleAddReward = () => {
    if (!newReward.description) return;
    
    const reward: Reward = {
      id: `reward-${Date.now()}`,
      type: newReward.type as Reward['type'] || 'treasure',
      description: newReward.description,
      value: newReward.value,
    };
    
    onAddReward(reward);
    
    // Reset form
    setNewReward({ type: 'treasure', description: '', value: 0 });
    onOpenChange(false);
  };

  const handleCancel = () => {
    setNewReward({ type: 'treasure', description: '', value: 0 });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Reward</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select 
              value={newReward.type} 
              onValueChange={(v) => setNewReward({ ...newReward, type: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REWARD_TYPES.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={newReward.description}
              onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
              placeholder="Describe the reward..."
            />
          </div>
          <div className="space-y-2">
            <Label>Value (gp)</Label>
            <Input
              type="number"
              value={newReward.value}
              onChange={(e) => setNewReward({ ...newReward, value: Number(e.target.value) })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleAddReward}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
