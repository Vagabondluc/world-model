'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Trash2, 
  Save, 
  Calculator, 
  Users, 
  Skull, 
  Swords, 
  Gift,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Wand2,
  Dice5,
  Sparkles
} from 'lucide-react';
import { 
  Difficulty, 
  Monster, 
  TacticalElement, 
  Reward,
  EncounterBalancer as EncounterBalancerType,
  XP_THRESHOLDS,
  getMonsterMultiplier,
  calculateAdjustedXP,
  determineDifficulty,
  isLegendaryMonster
} from '@/lib/encounter-types';
import { TERRAIN_TYPES } from '@/lib/procedural-tables';
import {
  generateMonster,
  generateTacticalElement,
  generateReward,
  generateFullBalancedEncounter,
  generateEncounterNotes,
} from '@/lib/procedural-generator';
import { AddMonsterDialog, AddTacticalDialog, AddRewardDialog } from './dialogs';
import { ExportPrintButton } from './ExportPrintButton';
import type { EncounterTemplate } from './EncounterTemplatesGallery';
import { CR_TO_XP } from '@/lib/encounter-types';
import type { ExportableEncounter } from '@/lib/export-utils';
import { formatNumber } from '@/lib/format-utils';

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  hard: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  deadly: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

interface EncounterBalancerTabProps {
  template?: EncounterTemplate | null;
  onTemplateApplied?: () => void;
}

export function EncounterBalancerTab({ template, onTemplateApplied }: EncounterBalancerTabProps) {
  // Party Info
  const [partyLevel, setPartyLevel] = useState(5);
  const [playerCount, setPlayerCount] = useState(4);
  const [keyAbilities, setKeyAbilities] = useState('');
  const [availableResources, setAvailableResources] = useState('');
  
  // Encounter Settings
  const [encounterName, setEncounterName] = useState('');
  const [encounterLocation, setEncounterLocation] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [tacticalElements, setTacticalElements] = useState<TacticalElement[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [notes, setNotes] = useState('');
  
  // UI State
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMonsterDialog, setShowMonsterDialog] = useState(false);
  const [showTacticalDialog, setShowTacticalDialog] = useState(false);
  const [showRewardDialog, setShowRewardDialog] = useState(false);

  // Apply template data when provided
  useEffect(() => {
    if (template) {
      setEncounterName(template.name);
      setDifficulty(template.difficulty);
      if (template.terrain) {
        setEncounterLocation(template.terrain);
      }
      
      // Apply monsters from template config
      if (template.config.monsters && Array.isArray(template.config.monsters)) {
        const templateMonsters: Monster[] = template.config.monsters.map((m: { name: string; cr: string; xp?: number; count: number; isLegendary?: boolean }, index: number) => ({
          id: `monster-${Date.now()}-${index}`,
          name: m.name,
          cr: m.cr,
          xp: m.xp || CR_TO_XP[m.cr] || 200,
          size: 'Medium' as const,
          type: 'Humanoid' as const,
          count: m.count,
          isLegendary: m.isLegendary,
        }));
        setMonsters(templateMonsters);
      }
      
      // Apply tactical elements from template config
      if (template.config.tacticalElements && Array.isArray(template.config.tacticalElements)) {
        const templateTactical: TacticalElement[] = template.config.tacticalElements.map((t: { name: string; type: string; description: string }, index: number) => ({
          id: `tactical-${Date.now()}-${index}`,
          name: t.name,
          type: t.type as TacticalElement['type'],
          description: t.description,
        }));
        setTacticalElements(templateTactical);
      }
      
      // Apply notes from template config
      if (template.config.notes) {
        setNotes(template.config.notes as string);
      }
      
      // Notify parent that template was applied
      onTemplateApplied?.();
    }
  }, [template, onTemplateApplied]);

  // Calculations
  const calculations = useMemo(() => {
    const totalXP = monsters.reduce((sum, m) => sum + (m.xp * m.count), 0);
    const totalMonsterCount = monsters.reduce((sum, m) => sum + m.count, 0);
    const multiplier = getMonsterMultiplier(totalMonsterCount);
    const adjustedXP = calculateAdjustedXP(monsters);
    
    const threshold = XP_THRESHOLDS[partyLevel]?.[difficulty] || 0;
    const partyThreshold = threshold * playerCount;
    
    const actualDifficulty = determineDifficulty(adjustedXP, partyLevel, playerCount);
    
    const easyThreshold = (XP_THRESHOLDS[partyLevel]?.easy || 0) * playerCount;
    const mediumThreshold = (XP_THRESHOLDS[partyLevel]?.medium || 0) * playerCount;
    const hardThreshold = (XP_THRESHOLDS[partyLevel]?.hard || 0) * playerCount;
    const deadlyThreshold = (XP_THRESHOLDS[partyLevel]?.deadly || 0) * playerCount;
    
    const isBalanced = adjustedXP >= easyThreshold && adjustedXP <= deadlyThreshold;
    const hasLegendary = monsters.some(m => isLegendaryMonster(m));
    
    return {
      totalXP,
      adjustedXP,
      multiplier,
      partyThreshold,
      actualDifficulty,
      isBalanced,
      easyThreshold,
      mediumThreshold,
      hardThreshold,
      deadlyThreshold,
      totalMonsterCount,
      hasLegendary,
    };
  }, [monsters, partyLevel, playerCount, difficulty]);

  // Generate full encounter
  const handleGenerateFullEncounter = () => {
    setIsGenerating(true);
    try {
      const encounter = generateFullBalancedEncounter({
        partyLevel,
        playerCount,
        difficulty,
        location: encounterLocation || undefined,
      });
      
      setEncounterName(encounter.name);
      setMonsters(encounter.monsters);
      setTacticalElements(encounter.tacticalElements);
      setRewards(encounter.rewards);
      setNotes(encounter.notes);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddMonster = (monster: Monster) => {
    setMonsters([...monsters, monster]);
  };

  const handleAddTactical = (tactical: TacticalElement) => {
    setTacticalElements([...tacticalElements, tactical]);
  };

  const handleAddReward = (reward: Reward) => {
    setRewards([...rewards, reward]);
  };

  const handleSaveEncounter = async () => {
    setIsSaving(true);
    try {
      const encounter: Omit<EncounterBalancerType, 'id'> = {
        name: encounterName || `Encounter ${new Date().toISOString().split('T')[0]}`,
        partyInfo: {
          level: partyLevel,
          playerCount,
          keyAbilities: keyAbilities.split(',').map(s => s.trim()).filter(Boolean),
          availableResources: availableResources.split(',').map(s => s.trim()).filter(Boolean),
        },
        difficulty,
        monsters,
        tacticalElements,
        rewards,
        totalXP: calculations.totalXP,
        adjustedXP: calculations.adjustedXP,
        difficultyThreshold: {
          min: calculations.easyThreshold,
          max: calculations.deadlyThreshold,
        },
        description: '',
        notes,
      };
      
      const response = await fetch('/api/encounters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: encounter.name,
          type: 'balancer',
          data: JSON.stringify(encounter),
        }),
      });
      
      if (response.ok) {
        // Show success feedback
      }
    } catch (error) {
      console.error('Failed to save encounter:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateMonsterCount = (id: string, delta: number) => {
    setMonsters(monsters.map(m => 
      m.id === id ? { ...m, count: Math.max(1, m.count + delta) } : m
    ));
  };

  const removeMonster = (id: string) => {
    setMonsters(monsters.filter(m => m.id !== id));
  };

  const removeTacticalElement = (id: string) => {
    setTacticalElements(tacticalElements.filter(t => t.id !== id));
  };

  const removeReward = (id: string) => {
    setRewards(rewards.filter(r => r.id !== id));
  };

  const handleImportEncounter = (imported: ExportableEncounter) => {
    setEncounterName(imported.name);
    setEncounterLocation(imported.location || '');
    setDifficulty(imported.difficulty);
    setPartyLevel(imported.partyLevel);
    setPlayerCount(imported.playerCount);
    setMonsters(imported.monsters);
    setTacticalElements(imported.tacticalElements);
    setRewards(imported.rewards);
    setNotes(imported.notes || '');
  };

  return (
    <div className="space-y-6">
      {/* One-Click Generator */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Quick Encounter Generator</h3>
                <p className="text-sm text-muted-foreground">
                  Generate a balanced encounter based on party level and difficulty
                </p>
              </div>
            </div>
            <Button 
              onClick={handleGenerateFullEncounter} 
              disabled={isGenerating}
              size="lg"
              className="min-w-[180px]"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4 mr-2" />
              )}
              Generate Encounter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Party Info Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Party Information
          </CardTitle>
          <CardDescription>
            Assess your party&apos;s strength for encounter balancing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="partyLevel">Average Party Level</Label>
              <Input
                id="partyLevel"
                type="number"
                min={1}
                max={20}
                value={partyLevel}
                onChange={(e) => setPartyLevel(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="playerCount">Number of Players</Label>
              <Input
                id="playerCount"
                type="number"
                min={1}
                max={12}
                value={playerCount}
                onChange={(e) => setPlayerCount(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keyAbilities">Key Abilities</Label>
              <Input
                id="keyAbilities"
                placeholder="e.g., Fireball, Sneak Attack"
                value={keyAbilities}
                onChange={(e) => setKeyAbilities(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resources">Available Resources</Label>
              <Input
                id="resources"
                placeholder="e.g., 2 healing potions"
                value={availableResources}
                onChange={(e) => setAvailableResources(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Difficulty & Calculations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Encounter Difficulty
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Target Difficulty</Label>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="deadly">Deadly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total XP</span>
                <span className="font-mono font-bold">{formatNumber(calculations.totalXP)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Multiplier (x{calculations.multiplier})</span>
                <span className="font-mono">{formatNumber(calculations.adjustedXP)} XP</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Actual Difficulty</span>
                <Badge className={DIFFICULTY_COLORS[calculations.actualDifficulty]}>
                  {calculations.actualDifficulty.charAt(0).toUpperCase() + calculations.actualDifficulty.slice(1)}
                </Badge>
              </div>
              
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                calculations.isBalanced 
                  ? 'bg-green-50 dark:bg-green-900/20' 
                  : 'bg-amber-50 dark:bg-amber-900/20'
              }`}>
                {calculations.isBalanced ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                )}
                <span className={`text-sm ${
                  calculations.isBalanced ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300'
                }`}>
                  {calculations.isBalanced 
                    ? 'Encounter is balanced for your party!' 
                    : 'Consider adjusting monster count or types'}
                </span>
              </div>
            </div>
            
            {/* XP Thresholds Display */}
            <div className="space-y-2 text-sm">
              <p className="font-medium">XP Thresholds for Level {partyLevel} Party:</p>
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center p-2 rounded bg-green-50 dark:bg-green-900/20">
                  <div className="font-mono text-xs">Easy</div>
                  <div className="font-mono font-bold text-green-700 dark:text-green-300">
                    {formatNumber(calculations.easyThreshold)}
                  </div>
                </div>
                <div className="text-center p-2 rounded bg-yellow-50 dark:bg-yellow-900/20">
                  <div className="font-mono text-xs">Medium</div>
                  <div className="font-mono font-bold text-yellow-700 dark:text-yellow-300">
                    {formatNumber(calculations.mediumThreshold)}
                  </div>
                </div>
                <div className="text-center p-2 rounded bg-orange-50 dark:bg-orange-900/20">
                  <div className="font-mono text-xs">Hard</div>
                  <div className="font-mono font-bold text-orange-700 dark:text-orange-300">
                    {formatNumber(calculations.hardThreshold)}
                  </div>
                </div>
                <div className="text-center p-2 rounded bg-red-50 dark:bg-red-900/20">
                  <div className="font-mono text-xs">Deadly</div>
                  <div className="font-mono font-bold text-red-700 dark:text-red-300">
                    {formatNumber(calculations.deadlyThreshold)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monster Selection */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Skull className="h-5 w-5" />
                Monsters ({monsters.reduce((sum, m) => sum + m.count, 0)})
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMonsters(prev => [...prev, generateMonster(partyLevel, difficulty, encounterLocation || undefined)])}
                >
                  <Dice5 className="h-3 w-3 mr-1" />
                  Generate
                </Button>
                <Button size="sm" onClick={() => setShowMonsterDialog(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Monster
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {monsters.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Skull className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No monsters added yet</p>
                <p className="text-sm mt-1">Add monsters to balance your encounter</p>
              </div>
            ) : (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {monsters.map((monster) => (
                    <div 
                      key={monster.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{monster.name}</span>
                          <Badge variant="outline" className="text-xs">CR {monster.cr}</Badge>
                          <Badge variant="secondary" className="text-xs">{monster.type}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {formatNumber(monster.xp)} XP each
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => updateMonsterCount(monster.id, -1)}
                            disabled={monster.count <= 1}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center font-mono">{monster.count}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => updateMonsterCount(monster.id, 1)}
                          >
                            +
                          </Button>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Monster</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove {monster.name} from this encounter? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => removeMonster(monster.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tactical Elements & Rewards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tactical Elements */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Swords className="h-5 w-5" />
                Tactical Elements ({tacticalElements.length})
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTacticalElements(prev => [...prev, generateTacticalElement(encounterLocation || undefined)])}
                >
                  <Dice5 className="h-3 w-3 mr-1" />
                  Generate
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowTacticalDialog(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {tacticalElements.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground text-sm">No tactical elements</p>
            ) : (
              <div className="space-y-2">
                {tacticalElements.map((tactical) => (
                  <div key={tactical.id} className="flex items-start justify-between p-2 rounded border">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{tactical.name}</span>
                        <Badge variant="outline" className="text-xs">{tactical.type}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{tactical.description}</p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Tactical Element</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove &quot;{tactical.name}&quot; from this encounter?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => removeTacticalElement(tactical.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rewards */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Rewards ({rewards.length})
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRewards(prev => [...prev, generateReward(difficulty, partyLevel)])}
                >
                  <Dice5 className="h-3 w-3 mr-1" />
                  Generate
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowRewardDialog(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {rewards.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground text-sm">No rewards defined</p>
            ) : (
              <div className="space-y-2">
                {rewards.map((reward) => (
                  <div key={reward.id} className="flex items-start justify-between p-2 rounded border">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{reward.type}</Badge>
                        {reward.value ? (
                          <span className="text-xs font-mono">{formatNumber(reward.value)} gp</span>
                        ) : null}
                      </div>
                      <p className="text-sm mt-1">{reward.description}</p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Reward</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove this {reward.type} reward from the encounter?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => removeReward(reward.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes & Save */}
      <Card>
        <CardHeader>
          <CardTitle>Encounter Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Encounter Name</Label>
              <Input
                value={encounterName}
                onChange={(e) => setEncounterName(e.target.value)}
                placeholder="Give your encounter a name..."
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Location (Optional)</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={() => setEncounterLocation(TERRAIN_TYPES[Math.floor(Math.random() * TERRAIN_TYPES.length)])}
                >
                  <Dice5 className="h-3 w-3 mr-1" />
                  Random
                </Button>
              </div>
              <Select value={encounterLocation} onValueChange={setEncounterLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location..." />
                </SelectTrigger>
                <SelectContent>
                  {TERRAIN_TYPES.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Notes & Tactics</Label>
              {monsters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={() => setNotes(generateEncounterNotes(monsters, tacticalElements))}
                >
                  <Wand2 className="h-3 w-3 mr-1" />
                  Generate Notes
                </Button>
              )}
            </div>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about encounter tactics, monster behavior, or special conditions..."
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <ExportPrintButton 
              data={{
                name: encounterName,
                location: encounterLocation,
                difficulty,
                partyLevel,
                playerCount,
                monsters,
                tacticalElements,
                rewards,
                notes,
                totalXP: calculations.totalXP,
                adjustedXP: calculations.adjustedXP,
                activeTab: 'balancer',
              }}
            />
            <Button variant="outline" onClick={() => {
              setEncounterName('');
              setEncounterLocation('');
              setMonsters([]);
              setTacticalElements([]);
              setRewards([]);
              setNotes('');
            }}>
              Clear All
            </Button>
            <Button onClick={handleSaveEncounter} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Encounter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddMonsterDialog
        open={showMonsterDialog}
        onOpenChange={setShowMonsterDialog}
        onAddMonster={handleAddMonster}
      />
      <AddTacticalDialog
        open={showTacticalDialog}
        onOpenChange={setShowTacticalDialog}
        onAddTactical={handleAddTactical}
      />
      <AddRewardDialog
        open={showRewardDialog}
        onOpenChange={setShowRewardDialog}
        onAddReward={handleAddReward}
      />
    </div>
  );
}
