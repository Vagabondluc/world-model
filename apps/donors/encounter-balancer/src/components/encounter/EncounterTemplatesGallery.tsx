'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Swords,
  Mountain,
  Skull,
  Users,
  Zap,
  Shield,
  Target,
  Crown,
  Flame,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export interface EncounterTemplate {
  id: string;
  name: string;
  description: string;
  type: 'balancer' | 'environmental';
  theme: 'ambush' | 'boss' | 'puzzle' | 'social' | 'defense' | 'chase';
  difficulty: 'easy' | 'medium' | 'hard' | 'deadly';
  partyLevel: string;
  terrain?: string;
  preview: {
    monsters?: { name: string; count: number }[];
    features?: string[];
    hazards?: string[];
  };
  config: Record<string, unknown>;
}

const TEMPLATE_THEMES = {
  ambush: { icon: Target, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/20' },
  boss: { icon: Crown, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/20' },
  puzzle: { icon: Zap, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
  social: { icon: Users, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' },
  defense: { icon: Shield, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/20' },
  chase: { icon: ArrowRight, color: 'text-cyan-500', bg: 'bg-cyan-100 dark:bg-cyan-900/20' },
};

const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  hard: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  deadly: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

// Predefined encounter templates
const ENCOUNTER_TEMPLATES: EncounterTemplate[] = [
  // Easy Encounters
  {
    id: 'goblin-ambush',
    name: 'Goblin Ambush',
    description: 'A classic ambush scenario with goblins hiding along a forest path.',
    type: 'balancer',
    theme: 'ambush',
    difficulty: 'easy',
    partyLevel: '1-4',
    terrain: 'Dense Forest',
    preview: {
      monsters: [
        { name: 'Goblin', count: 6 },
        { name: 'Goblin Boss', count: 1 },
      ],
      features: ['Fallen logs for cover', 'Hidden pit traps'],
    },
    config: {
      monsters: [
        { name: 'Goblin', cr: '1/4', xp: 50, count: 6 },
        { name: 'Goblin Boss', cr: '1', xp: 200, count: 1 },
      ],
      tacticalElements: [
        { name: 'Fallen Logs', type: 'cover', description: 'Half cover for goblins' },
        { name: 'Pit Trap', type: 'hazard', description: 'DC 13 DEX save or fall 10 feet' },
      ],
    },
  },
  {
    id: 'wolf-pack',
    name: 'Wolf Pack Territory',
    description: 'A pack of wolves defending their territory in the wilderness.',
    type: 'balancer',
    theme: 'ambush',
    difficulty: 'easy',
    partyLevel: '1-4',
    terrain: 'Frozen Tundra',
    preview: {
      monsters: [
        { name: 'Wolf', count: 4 },
        { name: 'Dire Wolf', count: 1 },
      ],
      features: ['Open terrain', 'Snow drifts'],
    },
    config: {
      monsters: [
        { name: 'Wolf', cr: '1/4', xp: 50, count: 4 },
        { name: 'Dire Wolf', cr: '1', xp: 200, count: 1 },
      ],
      notes: 'Wolves use pack tactics. Alpha howls for reinforcements if losing.',
    },
  },
  // Medium Encounters
  {
    id: 'orc-warband',
    name: 'Orc Warband',
    description: 'An organized orc raiding party with a war chief.',
    type: 'balancer',
    theme: 'ambush',
    difficulty: 'medium',
    partyLevel: '3-6',
    terrain: 'Mountain Pass',
    preview: {
      monsters: [
        { name: 'Orc', count: 8 },
        { name: 'Orc War Chief', count: 1 },
        { name: 'Orog', count: 2 },
      ],
      features: ['Rocky outcroppings', 'Chokepoints'],
    },
    config: {
      monsters: [
        { name: 'Orc', cr: '1/2', xp: 100, count: 8 },
        { name: 'Orc War Chief', cr: '4', xp: 1100, count: 1, isLegendary: false },
        { name: 'Orog', cr: '2', xp: 450, count: 2 },
      ],
    },
  },
  {
    id: 'undead-crypt',
    name: 'Haunted Crypt',
    description: 'Undead guardians protecting an ancient tomb.',
    type: 'balancer',
    theme: 'puzzle',
    difficulty: 'medium',
    partyLevel: '4-7',
    terrain: 'Temple Chamber',
    preview: {
      monsters: [
        { name: 'Skeleton', count: 6 },
        { name: 'Zombie', count: 4 },
        { name: 'Wight', count: 1 },
      ],
      features: ['Sarcophagi', 'Pressure plates'],
    },
    config: {
      monsters: [
        { name: 'Skeleton', cr: '1/4', xp: 50, count: 6 },
        { name: 'Zombie', cr: '1/4', xp: 50, count: 4 },
        { name: 'Wight', cr: '3', xp: 700, count: 1 },
      ],
      tacticalElements: [
        { name: 'Sarcophagi', type: 'cover', description: 'Full cover when opened' },
      ],
    },
  },
  // Hard Encounters
  {
    id: 'troll-bridge',
    name: 'Troll Bridge',
    description: 'A classic bridge guarded by trolls demanding tribute.',
    type: 'balancer',
    theme: 'social',
    difficulty: 'hard',
    partyLevel: '5-8',
    terrain: 'Ancient Bridge',
    preview: {
      monsters: [
        { name: 'Troll', count: 2 },
        { name: 'Dire Troll', count: 1 },
      ],
      features: ['Narrow bridge', 'River below'],
    },
    config: {
      monsters: [
        { name: 'Troll', cr: '5', xp: 1800, count: 2 },
        { name: 'Dire Troll', cr: '7', xp: 2900, count: 1 },
      ],
      notes: 'Trolls can be negotiated with or fought. Fire is key.',
    },
  },
  {
    id: 'dragon-lair',
    name: 'Young Dragon\'s Lair',
    description: 'A young dragon defending its treasure hoard.',
    type: 'balancer',
    theme: 'boss',
    difficulty: 'hard',
    partyLevel: '6-9',
    terrain: 'Underground Cave',
    preview: {
      monsters: [
        { name: 'Young Red Dragon', count: 1 },
        { name: 'Kobold', count: 8 },
      ],
      features: ['Lava pools', 'Treasure hoard'],
    },
    config: {
      monsters: [
        { name: 'Young Red Dragon', cr: '10', xp: 5900, count: 1, isLegendary: true },
        { name: 'Kobold', cr: '1/8', xp: 25, count: 8 },
      ],
      tacticalElements: [
        { name: 'Lava Pools', type: 'hazard', description: '3d6 fire damage if touched' },
        { name: 'Treasure Hoard', type: 'objective', description: 'Dragon fights to defend' },
      ],
    },
  },
  // Deadly Encounters
  {
    id: 'demon-summoning',
    name: 'Demonic Ritual',
    description: 'Cultists performing a summoning ritual as demons pour through.',
    type: 'balancer',
    theme: 'defense',
    difficulty: 'deadly',
    partyLevel: '8-12',
    terrain: 'Temple Chamber',
    preview: {
      monsters: [
        { name: 'Cult Fanatic', count: 4 },
        { name: 'Barlgura', count: 2 },
        { name: 'Glabrezu', count: 1 },
      ],
      features: ['Summoning circle', 'Blood altar'],
    },
    config: {
      monsters: [
        { name: 'Cult Fanatic', cr: '2', xp: 450, count: 4 },
        { name: 'Barlgura', cr: '5', xp: 1800, count: 2 },
        { name: 'Glabrezu', cr: '9', xp: 5000, count: 1, isLegendary: false },
      ],
      notes: 'Stop the ritual within 5 rounds or more demons arrive.',
    },
  },
  {
    id: 'ancient-dragon',
    name: 'Ancient Dragon Attack',
    description: 'An ancient dragon with its minions defending its domain.',
    type: 'balancer',
    theme: 'boss',
    difficulty: 'deadly',
    partyLevel: '14-18',
    terrain: 'Mountain Pass',
    preview: {
      monsters: [
        { name: 'Ancient Red Dragon', count: 1 },
        { name: 'Fire Elemental', count: 3 },
        { name: 'Salamander', count: 4 },
      ],
      features: ['Volcanic vents', 'Crumbling cliffs'],
    },
    config: {
      monsters: [
        { name: 'Ancient Red Dragon', cr: '24', xp: 62000, count: 1, isLegendary: true },
        { name: 'Fire Elemental', cr: '5', xp: 1800, count: 3 },
        { name: 'Salamander', cr: '5', xp: 1800, count: 4 },
      ],
      lairActions: [
        { name: 'Magma Eruption', description: 'Lava erupts in 20ft radius' },
        { name: 'Obsidian Shards', description: 'Ranged attack with volcanic glass' },
      ],
    },
  },
  // Environmental Templates
  {
    id: 'forest-hazards',
    name: 'Perilous Forest',
    description: 'A dense forest with numerous environmental hazards.',
    type: 'environmental',
    theme: 'chase',
    difficulty: 'medium',
    partyLevel: 'any',
    terrain: 'Dense Forest',
    preview: {
      features: ['Ancient oaks', 'Tangled undergrowth', 'Hidden clearings'],
      hazards: ['Poisonous spores', 'Falling branches', 'Quicksand'],
    },
    config: {
      physicalFeatures: [
        { name: 'Ancient Oaks', description: 'Massive trees provide cover' },
        { name: 'Tangled Undergrowth', description: 'Difficult terrain' },
      ],
      environmentalMechanics: [
        { name: 'Poisonous Spores', trigger: 'Disturbing fungi', damageDice: '2d4', damageType: 'poison' },
      ],
    },
  },
  {
    id: 'volcanic-battlefield',
    name: 'Volcanic Battlefield',
    description: 'Combat on the slopes of an active volcano.',
    type: 'environmental',
    theme: 'defense',
    difficulty: 'hard',
    partyLevel: 'any',
    terrain: 'Volcanic Field',
    preview: {
      features: ['Lava rivers', 'Obsidian shards', 'Cooling crust'],
      hazards: ['Geyser eruption', 'Lava surge', 'Toxic fumes'],
    },
    config: {
      physicalFeatures: [
        { name: 'Lava Rivers', description: 'Barriers of molten rock' },
        { name: 'Obsidian Shards', description: 'Sharp volcanic glass' },
      ],
      environmentalMechanics: [
        { name: 'Geyser Eruption', trigger: 'Every 1d4 rounds', damageDice: '3d6', damageType: 'fire' },
        { name: 'Lava Surge', trigger: '2d6 rounds', damageDice: '8d6', damageType: 'fire' },
      ],
    },
  },
];

interface EncounterTemplatesGalleryProps {
  onSelectTemplate: (template: EncounterTemplate) => void;
  selectedType?: 'balancer' | 'environmental';
}

export function EncounterTemplatesGallery({ 
  onSelectTemplate,
  selectedType 
}: EncounterTemplatesGalleryProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<EncounterTemplate | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  const [filterTheme, setFilterTheme] = useState<string | null>(null);

  const filteredTemplates = ENCOUNTER_TEMPLATES.filter(template => {
    if (selectedType && template.type !== selectedType) return false;
    if (filterDifficulty && template.difficulty !== filterDifficulty) return false;
    if (filterTheme && template.theme !== filterTheme) return false;
    return true;
  });

  const handleSelectTemplate = (template: EncounterTemplate) => {
    setSelectedTemplate(template);
  };

  const handleApplyTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      setSelectedTemplate(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filterDifficulty === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterDifficulty(null)}
        >
          All Difficulties
        </Button>
        {['easy', 'medium', 'hard', 'deadly'].map(diff => (
          <Button
            key={diff}
            variant={filterDifficulty === diff ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterDifficulty(diff)}
          >
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={filterTheme === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterTheme(null)}
        >
          All Themes
        </Button>
        {Object.keys(TEMPLATE_THEMES).map(theme => {
          const themeConfig = TEMPLATE_THEMES[theme as keyof typeof TEMPLATE_THEMES];
          const Icon = themeConfig.icon;
          return (
            <Button
              key={theme}
              variant={filterTheme === theme ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterTheme(theme)}
              className="flex items-center gap-1"
            >
              <Icon className="h-3 w-3" />
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </Button>
          );
        })}
      </div>

      {/* Template Grid */}
      <ScrollArea className="h-[400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
          {filteredTemplates.map(template => {
            const themeConfig = TEMPLATE_THEMES[template.theme];
            const ThemeIcon = themeConfig.icon;
            
            return (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTemplate?.id === template.id 
                    ? 'ring-2 ring-primary' 
                    : ''
                }`}
                onClick={() => handleSelectTemplate(template)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded ${themeConfig.bg}`}>
                        <ThemeIcon className={`h-4 w-4 ${themeConfig.color}`} />
                      </div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                    </div>
                    <Badge className={DIFFICULTY_COLORS[template.difficulty]}>
                      {template.difficulty}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs mt-1">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      Level: {template.partyLevel}
                    </Badge>
                    {template.terrain && (
                      <Badge variant="secondary" className="text-xs">
                        <Mountain className="h-3 w-3 mr-1" />
                        {template.terrain}
                      </Badge>
                    )}
                  </div>

                  {/* Preview */}
                  <div className="text-xs space-y-1">
                    {template.preview.monsters && (
                      <div className="flex flex-wrap gap-1">
                        <Skull className="h-3 w-3 text-muted-foreground" />
                        {template.preview.monsters.map((m, i) => (
                          <span key={i} className="text-muted-foreground">
                            {m.count}x {m.name}{i < template.preview.monsters!.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    )}
                    {template.preview.features && (
                      <div className="flex flex-wrap gap-1">
                        <Mountain className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {template.preview.features.slice(0, 3).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      {/* Selected Template Details Dialog */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTemplate && (
                <>
                  {(() => {
                    const themeConfig = TEMPLATE_THEMES[selectedTemplate.theme];
                    const Icon = themeConfig.icon;
                    return <Icon className={`h-5 w-5 ${themeConfig.color}`} />;
                  })()}
                  {selectedTemplate.name}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedTemplate?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="space-y-4 py-4">
              <div className="flex flex-wrap gap-2">
                <Badge className={DIFFICULTY_COLORS[selectedTemplate.difficulty]}>
                  {selectedTemplate.difficulty.charAt(0).toUpperCase() + selectedTemplate.difficulty.slice(1)}
                </Badge>
                <Badge variant="outline">Level: {selectedTemplate.partyLevel}</Badge>
                {selectedTemplate.terrain && (
                  <Badge variant="secondary">{selectedTemplate.terrain}</Badge>
                )}
              </div>

              {selectedTemplate.preview.monsters && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Skull className="h-4 w-4" />
                    Monsters
                  </h4>
                  <ul className="text-sm space-y-1">
                    {selectedTemplate.preview.monsters.map((m, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        {m.count}x {m.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedTemplate.preview.features && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Mountain className="h-4 w-4" />
                    Features
                  </h4>
                  <ul className="text-sm space-y-1">
                    {selectedTemplate.preview.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedTemplate.preview.hazards && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Flame className="h-4 w-4" />
                    Hazards
                  </h4>
                  <ul className="text-sm space-y-1">
                    {selectedTemplate.preview.hazards.map((h, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-orange-500" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
              Cancel
            </Button>
            <Button onClick={handleApplyTemplate}>
              <Swords className="h-4 w-4 mr-2" />
              Use Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EncounterTemplatesGallery;
