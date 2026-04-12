'use client';

import { useState, useEffect } from 'react';
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
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
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
  Mountain, 
  CloudLightning, 
  Users, 
  Zap,
  Map,
  Target,
  ArrowRight,
  Loader2,
  Wand2,
  Dice5,
  Sparkles
} from 'lucide-react';
import { 
  EnvironmentalScenario as EnvironmentalScenarioType,
  PhysicalFeature,
  EnvironmentalMechanic,
  EnemyForce,
  DynamicChange,
  EncounterOutcome,
  TransitionHook
} from '@/lib/encounter-types';
import { TERRAIN_TYPES } from '@/lib/procedural-tables';
import {
  generateTerrain,
  generateDescription,
  generatePhysicalFeature,
  generateEnvironmentalMechanic,
  generateEnemyForce,
  generateDynamicChange,
  generateOutcome,
  generateTransitionHook,
  generateFullEnvironmentalScenario,
} from '@/lib/procedural-generator';
import { ExportEncounterDialog } from './ExportEncounterDialog';
import type { ExportableEncounter } from '@/lib/export-utils';
import type { EncounterTemplate } from './EncounterTemplatesGallery';

interface EnvironmentalScenarioTabProps {
  template?: EncounterTemplate | null;
  onTemplateApplied?: () => void;
}

export function EnvironmentalScenarioTab({ template, onTemplateApplied }: EnvironmentalScenarioTabProps) {
  // Scenario State
  const [scenarioName, setScenarioName] = useState('');
  const [location, setLocation] = useState('');
  const [terrainType, setTerrainType] = useState('');
  const [description, setDescription] = useState('');
  const [startingConditions, setStartingConditions] = useState('');
  const [interactionMechanics, setInteractionMechanics] = useState('');
  const [notes, setNotes] = useState('');
  
  // Collections
  const [physicalFeatures, setPhysicalFeatures] = useState<PhysicalFeature[]>([]);
  const [environmentalMechanics, setEnvironmentalMechanics] = useState<EnvironmentalMechanic[]>([]);
  const [enemyForces, setEnemyForces] = useState<EnemyForce[]>([]);
  const [dynamicChanges, setDynamicChanges] = useState<DynamicChange[]>([]);
  const [outcomes, setOutcomes] = useState<EncounterOutcome[]>([]);
  const [transitionHooks, setTransitionHooks] = useState<TransitionHook[]>([]);
  
  // UI State
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Dialog States
  const [showFeatureDialog, setShowFeatureDialog] = useState(false);
  const [showMechanicDialog, setShowMechanicDialog] = useState(false);
  const [showEnemyDialog, setShowEnemyDialog] = useState(false);
  const [showDynamicDialog, setShowDynamicDialog] = useState(false);
  const [showOutcomeDialog, setShowOutcomeDialog] = useState(false);
  const [showTransitionDialog, setShowTransitionDialog] = useState(false);
  
  // New item forms
  const [newFeature, setNewFeature] = useState<Partial<PhysicalFeature>>({
    name: '',
    description: '',
    mechanicalEffect: '',
    impactOnGameplay: [],
  });
  const [newMechanic, setNewMechanic] = useState<Partial<EnvironmentalMechanic>>({
    name: '',
    trigger: '',
    effect: '',
    damageType: '',
    damageDice: '',
    saveType: 'DEX',
    saveDC: 14,
    areaOfEffect: '',
  });
  const [newEnemy, setNewEnemy] = useState<Partial<EnemyForce>>({
    name: '',
    type: '',
    count: 1,
    specialAbilities: [],
    tactics: [],
    startingLocation: '',
  });
  const [newDynamic, setNewDynamic] = useState<Partial<DynamicChange>>({
    name: '',
    trigger: '',
    timing: '',
    effect: '',
    tacticalImplication: '',
  });
  const [newOutcome, setNewOutcome] = useState<Partial<EncounterOutcome>>({
    condition: '',
    result: '',
    consequences: [],
  });
  const [newTransition, setNewTransition] = useState<Partial<TransitionHook>>({
    name: '',
    description: '',
    prerequisites: [],
  });

  // Apply template data when provided
  useEffect(() => {
    if (template) {
      setScenarioName(template.name);
      if (template.terrain) {
        setLocation(template.terrain);
      }
      
      // Apply physical features from template config
      if (template.config.physicalFeatures && Array.isArray(template.config.physicalFeatures)) {
        const templateFeatures: PhysicalFeature[] = template.config.physicalFeatures.map((f: { name: string; description?: string; mechanicalEffect?: string }, index: number) => ({
          id: `feature-${Date.now()}-${index}`,
          name: f.name,
          description: f.description || '',
          mechanicalEffect: f.mechanicalEffect || '',
          impactOnGameplay: [],
        }));
        setPhysicalFeatures(templateFeatures);
      }
      
      // Apply environmental mechanics from template config
      if (template.config.environmentalMechanics && Array.isArray(template.config.environmentalMechanics)) {
        const templateMechanics: EnvironmentalMechanic[] = template.config.environmentalMechanics.map((m: { name: string; trigger: string; damageDice?: string; damageType?: string; saveDC?: number; saveType?: string }, index: number) => ({
          id: `mechanic-${Date.now()}-${index}`,
          name: m.name,
          trigger: m.trigger,
          effect: '',
          damageDice: m.damageDice,
          damageType: m.damageType,
          saveDC: m.saveDC || 14,
          saveType: (m.saveType as EnvironmentalMechanic['saveType']) || 'DEX',
        }));
        setEnvironmentalMechanics(templateMechanics);
      }
      
      // Apply notes from template config
      if (template.config.notes) {
        setNotes(template.config.notes as string);
      }
      
      // Notify parent that template was applied
      onTemplateApplied?.();
    }
  }, [template, onTemplateApplied]);

  // Helper to convert comma-separated string to array
  const stringToArray = (str: string) => str.split(',').map(s => s.trim()).filter(Boolean);

  // Generate full scenario
  const handleGenerateFullScenario = () => {
    setIsGenerating(true);
    try {
      const scenario = generateFullEnvironmentalScenario({
        location: location || undefined,
        challengeLevel: 'medium',
      });
      
      setScenarioName(scenario.name);
      if (!location) setLocation(scenario.location);
      setDescription(scenario.description);
      setPhysicalFeatures(scenario.physicalFeatures);
      setEnvironmentalMechanics(scenario.environmentalMechanics);
      setEnemyForces(scenario.enemyForces);
      setStartingConditions(scenario.startingConditions);
      setInteractionMechanics(scenario.interactionMechanics.join('\n'));
      setDynamicChanges(scenario.dynamicChanges);
      setOutcomes(scenario.outcomes);
      setTransitionHooks(scenario.transitionHooks);
      setNotes(scenario.notes);
    } finally {
      setIsGenerating(false);
    }
  };

  // Add handlers
  const handleAddFeature = () => {
    if (!newFeature.name) return;
    const feature: PhysicalFeature = {
      id: `feature-${Date.now()}`,
      name: newFeature.name,
      description: newFeature.description || '',
      mechanicalEffect: newFeature.mechanicalEffect || '',
      impactOnGameplay: Array.isArray(newFeature.impactOnGameplay) 
        ? newFeature.impactOnGameplay 
        : stringToArray(newFeature.impactOnGameplay as unknown as string || ''),
    };
    setPhysicalFeatures([...physicalFeatures, feature]);
    setNewFeature({ name: '', description: '', mechanicalEffect: '', impactOnGameplay: [] });
    setShowFeatureDialog(false);
  };

  const handleAddMechanic = () => {
    if (!newMechanic.name) return;
    const mechanic: EnvironmentalMechanic = {
      id: `mechanic-${Date.now()}`,
      name: newMechanic.name,
      trigger: newMechanic.trigger || '',
      effect: newMechanic.effect || '',
      damageType: newMechanic.damageType,
      damageDice: newMechanic.damageDice,
      saveType: newMechanic.saveType,
      saveDC: newMechanic.saveDC,
      areaOfEffect: newMechanic.areaOfEffect,
    };
    setEnvironmentalMechanics([...environmentalMechanics, mechanic]);
    setNewMechanic({ name: '', trigger: '', effect: '', saveType: 'DEX', saveDC: 14 });
    setShowMechanicDialog(false);
  };

  const handleAddEnemy = () => {
    if (!newEnemy.name) return;
    const enemy: EnemyForce = {
      id: `enemy-${Date.now()}`,
      name: newEnemy.name,
      type: newEnemy.type || '',
      count: newEnemy.count || 1,
      specialAbilities: Array.isArray(newEnemy.specialAbilities)
        ? newEnemy.specialAbilities
        : stringToArray(newEnemy.specialAbilities as unknown as string || ''),
      tactics: Array.isArray(newEnemy.tactics)
        ? newEnemy.tactics
        : stringToArray(newEnemy.tactics as unknown as string || ''),
      startingLocation: newEnemy.startingLocation,
    };
    setEnemyForces([...enemyForces, enemy]);
    setNewEnemy({ name: '', type: '', count: 1, specialAbilities: [], tactics: [] });
    setShowEnemyDialog(false);
  };

  const handleAddDynamic = () => {
    if (!newDynamic.name) return;
    const dynamic: DynamicChange = {
      id: `dynamic-${Date.now()}`,
      name: newDynamic.name,
      trigger: newDynamic.trigger || '',
      timing: newDynamic.timing || '',
      effect: newDynamic.effect || '',
      tacticalImplication: newDynamic.tacticalImplication || '',
    };
    setDynamicChanges([...dynamicChanges, dynamic]);
    setNewDynamic({ name: '', trigger: '', timing: '', effect: '', tacticalImplication: '' });
    setShowDynamicDialog(false);
  };

  const handleAddOutcome = () => {
    if (!newOutcome.condition) return;
    const outcome: EncounterOutcome = {
      id: `outcome-${Date.now()}`,
      condition: newOutcome.condition,
      result: newOutcome.result || '',
      consequences: Array.isArray(newOutcome.consequences)
        ? newOutcome.consequences
        : stringToArray(newOutcome.consequences as unknown as string || ''),
    };
    setOutcomes([...outcomes, outcome]);
    setNewOutcome({ condition: '', result: '', consequences: [] });
    setShowOutcomeDialog(false);
  };

  const handleAddTransition = () => {
    if (!newTransition.name) return;
    const transition: TransitionHook = {
      id: `transition-${Date.now()}`,
      name: newTransition.name,
      description: newTransition.description || '',
      prerequisites: Array.isArray(newTransition.prerequisites)
        ? newTransition.prerequisites
        : stringToArray(newTransition.prerequisites as unknown as string || ''),
    };
    setTransitionHooks([...transitionHooks, transition]);
    setNewTransition({ name: '', description: '', prerequisites: [] });
    setShowTransitionDialog(false);
  };

  const handleSaveScenario = async () => {
    setIsSaving(true);
    try {
      const scenario: Omit<EnvironmentalScenarioType, 'id'> = {
        name: scenarioName || `Environmental Encounter ${new Date().toISOString().split('T')[0]}`,
        location,
        description,
        physicalFeatures,
        environmentalMechanics,
        enemyForces,
        startingConditions,
        interactionMechanics: interactionMechanics.split('\n').filter(Boolean),
        dynamicChanges,
        outcomes,
        transitionHooks,
        notes,
      };
      
      const response = await fetch('/api/encounters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: scenario.name,
          type: 'environmental',
          description: description.substring(0, 200),
          data: JSON.stringify(scenario),
        }),
      });
      
      if (response.ok) {
        // Success feedback
      }
    } catch (error) {
      console.error('Failed to save scenario:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImportEncounter = (imported: ExportableEncounter) => {
    setScenarioName(imported.name);
    setLocation(imported.location || '');
    setPhysicalFeatures(imported.physicalFeatures || []);
    setEnvironmentalMechanics(imported.environmentalMechanics || []);
    setEnemyForces(imported.enemyForces || []);
    setDynamicChanges(imported.dynamicChanges || []);
    setOutcomes(imported.outcomes || []);
    setTransitionHooks(imported.transitionHooks || []);
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
                  Generate a complete encounter from scratch or build around your selections
                </p>
              </div>
            </div>
            <Button 
              onClick={handleGenerateFullScenario} 
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

      {/* Introduction to Environment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mountain className="h-5 w-5" />
            Environment Introduction
          </CardTitle>
          <CardDescription>
            Define the geographical setting and its impact on gameplay
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Location Type</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={() => {
                    const newLocation = generateTerrain();
                    setLocation(newLocation);
                    setDescription(generateDescription(newLocation));
                  }}
                >
                  <Dice5 className="h-3 w-3 mr-1" />
                  Random
                </Button>
              </div>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select terrain type..." />
                </SelectTrigger>
                <SelectContent>
                  {TERRAIN_TYPES.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Scenario Name</Label>
              <Input
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                placeholder="e.g., The Burning Pass"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Environment Description</Label>
              {location && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={() => setDescription(generateDescription(location))}
                >
                  <Dice5 className="h-3 w-3 mr-1" />
                  Generate
                </Button>
              )}
            </div>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the environment vividly - highlight physical features, hazards, and atmosphere..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Physical Features */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              Physical Features ({physicalFeatures.length})
            </CardTitle>
            <div className="flex gap-2">
              {location && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPhysicalFeatures(prev => [...prev, generatePhysicalFeature(location)])}
                >
                  <Dice5 className="h-3 w-3 mr-1" />
                  Generate
                </Button>
              )}
              <Dialog open={showFeatureDialog} onOpenChange={setShowFeatureDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Physical Feature</DialogTitle>
                    <DialogDescription>
                      Add a significant geographical element
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={newFeature.name}
                        onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
                        placeholder="e.g., Jagged Cliffs"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={newFeature.description}
                        onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                        placeholder="Describe the physical appearance..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mechanical Effect</Label>
                      <Input
                        value={newFeature.mechanicalEffect}
                        onChange={(e) => setNewFeature({ ...newFeature, mechanicalEffect: e.target.value })}
                        placeholder="e.g., DC 12 Athletics to climb"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Impact on Gameplay (comma-separated)</Label>
                      <Input
                        placeholder="e.g., Limits movement, Provides cover"
                        onChange={(e) => setNewFeature({ ...newFeature, impactOnGameplay: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowFeatureDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddFeature}>Add Feature</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {physicalFeatures.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground text-sm">
              No physical features defined
            </p>
          ) : (
            <div className="space-y-2">
              {physicalFeatures.map((feature) => (
                <div key={feature.id} className="p-3 rounded-lg border bg-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{feature.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">{feature.mechanicalEffect}</Badge>
                      </div>
                      {feature.impactOnGameplay.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {feature.impactOnGameplay.map((impact, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{impact}</Badge>
                          ))}
                        </div>
                      )}
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
                          <AlertDialogTitle>Remove Physical Feature</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove "{feature.name}" from this scenario?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => setPhysicalFeatures(physicalFeatures.filter(f => f.id !== feature.id))}
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
          )}
        </CardContent>
      </Card>

      {/* Environmental Mechanics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CloudLightning className="h-5 w-5" />
              Environmental Mechanics ({environmentalMechanics.length})
            </CardTitle>
            <div className="flex gap-2">
              {location && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEnvironmentalMechanics(prev => [...prev, generateEnvironmentalMechanic(location)])}
                >
                  <Dice5 className="h-3 w-3 mr-1" />
                  Generate
                </Button>
              )}
              <Dialog open={showMechanicDialog} onOpenChange={setShowMechanicDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Environmental Mechanic</DialogTitle>
                    <DialogDescription>
                      Define triggers and their effects
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={newMechanic.name}
                        onChange={(e) => setNewMechanic({ ...newMechanic, name: e.target.value })}
                        placeholder="e.g., Geyser Eruption"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Trigger</Label>
                      <Input
                        value={newMechanic.trigger}
                        onChange={(e) => setNewMechanic({ ...newMechanic, trigger: e.target.value })}
                        placeholder="e.g., Every 1d4 rounds"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Effect Description</Label>
                      <Textarea
                        value={newMechanic.effect}
                        onChange={(e) => setNewMechanic({ ...newMechanic, effect: e.target.value })}
                        placeholder="Describe what happens..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Damage Type</Label>
                        <Select 
                          value={newMechanic.damageType} 
                          onValueChange={(v) => setNewMechanic({ ...newMechanic, damageType: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {['', 'Fire', 'Cold', 'Lightning', 'Thunder', 'Acid', 'Poison', 'Necrotic', 'Radiant'].map(t => (
                              <SelectItem key={t || 'none'} value={t || 'none'}>{t || 'None'}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Damage Dice</Label>
                        <Input
                          value={newMechanic.damageDice}
                          onChange={(e) => setNewMechanic({ ...newMechanic, damageDice: e.target.value })}
                          placeholder="e.g., 3d6"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Save Type</Label>
                        <Select 
                          value={newMechanic.saveType} 
                          onValueChange={(v) => setNewMechanic({ ...newMechanic, saveType: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(s => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Save DC</Label>
                        <Input
                          type="number"
                          value={newMechanic.saveDC}
                          onChange={(e) => setNewMechanic({ ...newMechanic, saveDC: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Area of Effect</Label>
                      <Input
                        value={newMechanic.areaOfEffect}
                        onChange={(e) => setNewMechanic({ ...newMechanic, areaOfEffect: e.target.value })}
                        placeholder="e.g., 10-foot radius"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowMechanicDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddMechanic}>Add Mechanic</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {environmentalMechanics.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground text-sm">
              No environmental mechanics defined
            </p>
          ) : (
            <div className="space-y-2">
              {environmentalMechanics.map((mechanic) => (
                <div key={mechanic.id} className="p-3 rounded-lg border bg-card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{mechanic.name}</h4>
                        {mechanic.damageDice && mechanic.damageType && (
                          <Badge variant="destructive" className="text-xs">
                            {mechanic.damageDice} {mechanic.damageType}
                          </Badge>
                        )}
                        {mechanic.saveType && mechanic.saveDC && (
                          <Badge variant="outline" className="text-xs">
                            DC {mechanic.saveDC} {mechanic.saveType}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        <span className="font-medium">Trigger:</span> {mechanic.trigger}
                      </p>
                      <p className="text-sm mt-1">{mechanic.effect}</p>
                      {mechanic.areaOfEffect && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Area: {mechanic.areaOfEffect}
                        </p>
                      )}
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
                          <AlertDialogTitle>Remove Environmental Mechanic</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove "{mechanic.name}" from this scenario?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => setEnvironmentalMechanics(environmentalMechanics.filter(m => m.id !== mechanic.id))}
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
          )}
        </CardContent>
      </Card>

      {/* Enemy Forces */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Enemy Forces ({enemyForces.reduce((sum, e) => sum + e.count, 0)} enemies)
            </CardTitle>
            <div className="flex gap-2">
              {location && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEnemyForces(prev => [...prev, generateEnemyForce(location, 'medium')])}
                >
                  <Dice5 className="h-3 w-3 mr-1" />
                  Generate
                </Button>
              )}
              <Dialog open={showEnemyDialog} onOpenChange={setShowEnemyDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Enemy Force</DialogTitle>
                    <DialogDescription>
                      Define enemy groups and their tactics
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Enemy Name</Label>
                        <Input
                          value={newEnemy.name}
                          onChange={(e) => setNewEnemy({ ...newEnemy, name: e.target.value })}
                          placeholder="e.g., Mountain Troll"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Input
                          value={newEnemy.type}
                          onChange={(e) => setNewEnemy({ ...newEnemy, type: e.target.value })}
                          placeholder="e.g., Giant"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Count</Label>
                        <Input
                          type="number"
                          min={1}
                          value={newEnemy.count}
                          onChange={(e) => setNewEnemy({ ...newEnemy, count: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Starting Location</Label>
                        <Input
                          value={newEnemy.startingLocation}
                          onChange={(e) => setNewEnemy({ ...newEnemy, startingLocation: e.target.value })}
                          placeholder="e.g., Cliff top"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Special Abilities (comma-separated)</Label>
                      <Input
                        placeholder="e.g., Keen smell, Regeneration"
                        onChange={(e) => setNewEnemy({ ...newEnemy, specialAbilities: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tactics (comma-separated)</Label>
                      <Input
                        placeholder="e.g., Throws boulders from height, Blocks paths"
                        onChange={(e) => setNewEnemy({ ...newEnemy, tactics: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowEnemyDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddEnemy}>Add Enemy</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {enemyForces.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground text-sm">
              No enemy forces defined
            </p>
          ) : (
            <div className="space-y-2">
              {enemyForces.map((enemy) => (
                <div key={enemy.id} className="p-3 rounded-lg border bg-card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{enemy.name}</h4>
                        <Badge variant="outline" className="text-xs">{enemy.type}</Badge>
                        <Badge variant="secondary" className="text-xs">x{enemy.count}</Badge>
                      </div>
                      {enemy.startingLocation && (
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">Starts:</span> {enemy.startingLocation}
                        </p>
                      )}
                      {enemy.specialAbilities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {enemy.specialAbilities.map((ability, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{ability}</Badge>
                          ))}
                        </div>
                      )}
                      {enemy.tactics.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Tactics:</p>
                          <ul className="text-xs text-muted-foreground list-disc list-inside">
                            {enemy.tactics.map((tactic, i) => (
                              <li key={i}>{tactic}</li>
                            ))}
                          </ul>
                        </div>
                      )}
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
                          <AlertDialogTitle>Remove Enemy Force</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {enemy.count}x {enemy.name} from this scenario?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => setEnemyForces(enemyForces.filter(e => e.id !== enemy.id))}
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
          )}
        </CardContent>
      </Card>

      {/* Dynamic Changes & Outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic Environmental Changes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="h-4 w-4" />
                Dynamic Changes ({dynamicChanges.length})
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDynamicChanges(prev => [...prev, generateDynamicChange()])}
                >
                  <Dice5 className="h-3 w-3 mr-1" />
                  Generate
                </Button>
                <Dialog open={showDynamicDialog} onOpenChange={setShowDynamicDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Dynamic Change</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Change Name</Label>
                        <Input
                          value={newDynamic.name}
                          onChange={(e) => setNewDynamic({ ...newDynamic, name: e.target.value })}
                          placeholder="e.g., Avalanche"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Trigger</Label>
                        <Input
                          value={newDynamic.trigger}
                          onChange={(e) => setNewDynamic({ ...newDynamic, trigger: e.target.value })}
                          placeholder="e.g., Loud noise or impact"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Timing</Label>
                        <Input
                          value={newDynamic.timing}
                          onChange={(e) => setNewDynamic({ ...newDynamic, timing: e.target.value })}
                          placeholder="e.g., Start of next round"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Effect</Label>
                        <Textarea
                          value={newDynamic.effect}
                          onChange={(e) => setNewDynamic({ ...newDynamic, effect: e.target.value })}
                          placeholder="Describe what changes..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tactical Implication</Label>
                        <Input
                          value={newDynamic.tacticalImplication}
                          onChange={(e) => setNewDynamic({ ...newDynamic, tacticalImplication: e.target.value })}
                          placeholder="e.g., Creates new cover, blocks path"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowDynamicDialog(false)}>Cancel</Button>
                      <Button onClick={handleAddDynamic}>Add</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {dynamicChanges.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground text-sm">
                No dynamic changes
              </p>
            ) : (
              <ScrollArea className="h-[200px]">
                <div className="space-y-2 pr-4">
                  {dynamicChanges.map((change) => (
                    <div key={change.id} className="flex items-start justify-between p-2 rounded border">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{change.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="font-medium">Trigger:</span> {change.trigger}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Timing:</span> {change.timing}
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Dynamic Change</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove "{change.name}" from this scenario?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => setDynamicChanges(dynamicChanges.filter(d => d.id !== change.id))}
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
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Encounter Outcomes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-4 w-4" />
                Outcomes ({outcomes.length})
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOutcomes(prev => [...prev, generateOutcome()])}
                >
                  <Dice5 className="h-3 w-3 mr-1" />
                  Generate
                </Button>
                <Dialog open={showOutcomeDialog} onOpenChange={setShowOutcomeDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Encounter Outcome</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Condition</Label>
                        <Input
                          value={newOutcome.condition}
                          onChange={(e) => setNewOutcome({ ...newOutcome, condition: e.target.value })}
                          placeholder="e.g., All enemies defeated"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Result</Label>
                        <Textarea
                          value={newOutcome.result}
                          onChange={(e) => setNewOutcome({ ...newOutcome, result: e.target.value })}
                          placeholder="Describe the result..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Consequences (comma-separated)</Label>
                        <Input
                          placeholder="e.g., Path clears, Find hidden cave"
                          onChange={(e) => setNewOutcome({ ...newOutcome, consequences: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowOutcomeDialog(false)}>Cancel</Button>
                      <Button onClick={handleAddOutcome}>Add</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {outcomes.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground text-sm">
                No outcomes defined
              </p>
            ) : (
              <ScrollArea className="h-[200px]">
                <div className="space-y-2 pr-4">
                  {outcomes.map((outcome) => (
                    <div key={outcome.id} className="flex items-start justify-between p-2 rounded border">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{outcome.condition}</p>
                        <p className="text-xs text-muted-foreground mt-1">{outcome.result}</p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Outcome</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove this outcome from the scenario?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => setOutcomes(outcomes.filter(o => o.id !== outcome.id))}
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
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transition Hooks & Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transition Hooks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <ArrowRight className="h-4 w-4" />
                Transition Hooks ({transitionHooks.length})
              </CardTitle>
              <div className="flex gap-2">
                {location && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTransitionHooks(prev => [...prev, generateTransitionHook(location)])}
                  >
                    <Dice5 className="h-3 w-3 mr-1" />
                    Generate
                  </Button>
                )}
                <Dialog open={showTransitionDialog} onOpenChange={setShowTransitionDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Transition Hook</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Hook Name</Label>
                        <Input
                          value={newTransition.name}
                          onChange={(e) => setNewTransition({ ...newTransition, name: e.target.value })}
                          placeholder="e.g., Hidden Cave Discovery"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={newTransition.description}
                          onChange={(e) => setNewTransition({ ...newTransition, description: e.target.value })}
                          placeholder="Describe the transition opportunity..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Prerequisites (comma-separated)</Label>
                        <Input
                          placeholder="e.g., DC 15 Investigation check"
                          onChange={(e) => setNewTransition({ ...newTransition, prerequisites: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowTransitionDialog(false)}>Cancel</Button>
                      <Button onClick={handleAddTransition}>Add</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {transitionHooks.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground text-sm">
                No transition hooks
              </p>
            ) : (
              <div className="space-y-2">
                {transitionHooks.map((hook) => (
                  <div key={hook.id} className="flex items-start justify-between p-2 rounded border">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{hook.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{hook.description}</p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Transition Hook</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove "{hook.name}" from this scenario?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => setTransitionHooks(transitionHooks.filter(h => h.id !== hook.id))}
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

        {/* Starting Conditions & Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Setup & Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Starting Conditions</Label>
              <Textarea
                value={startingConditions}
                onChange={(e) => setStartingConditions(e.target.value)}
                placeholder="Describe initial enemy positions, environmental states..."
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Interaction Mechanics</Label>
              <Textarea
                value={interactionMechanics}
                onChange={(e) => setInteractionMechanics(e.target.value)}
                placeholder="How can players interact with the environment? One per line..."
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label>DM Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Private notes for running this encounter..."
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-2">
        <ExportEncounterDialog
          name={scenarioName}
          location={location}
          difficulty="medium"
          partyLevel={5}
          playerCount={4}
          monsters={[]}
          tacticalElements={[]}
          rewards={[]}
          notes={notes}
          physicalFeatures={physicalFeatures}
          environmentalMechanics={environmentalMechanics}
          enemyForces={enemyForces}
          dynamicChanges={dynamicChanges}
          outcomes={outcomes}
          transitionHooks={transitionHooks}
          onImport={handleImportEncounter}
        />
        <Button onClick={handleSaveScenario} disabled={isSaving} size="lg">
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Environmental Scenario
        </Button>
      </div>
    </div>
  );
}
