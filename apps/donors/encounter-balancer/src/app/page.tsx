'use client';

import { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Mountain, 
  Calculator, 
  Swords,
  Sparkles,
  LayoutTemplate
} from 'lucide-react';
import { EncounterBalancerTab } from '@/components/encounter/EncounterBalancerTab';
import { EnvironmentalScenarioTab } from '@/components/encounter/EnvironmentalScenarioTab';
import { SavedElementsPanel } from '@/components/encounter/SavedElementsPanel';
import { EncounterTemplatesGallery } from '@/components/encounter/EncounterTemplatesGallery';
import type { EncounterTemplate } from '@/components/encounter/EncounterTemplatesGallery';

export default function Home() {
  const [activeTab, setActiveTab] = useState('balancer');
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);
  
  // Template data to pass to tabs
  const [balancerTemplate, setBalancerTemplate] = useState<EncounterTemplate | null>(null);
  const [environmentalTemplate, setEnvironmentalTemplate] = useState<EncounterTemplate | null>(null);

  const handleSelectTemplate = useCallback((template: EncounterTemplate) => {
    setShowTemplatesDialog(false);
    
    // Switch to appropriate tab and set template
    if (template.type === 'balancer') {
      setActiveTab('balancer');
      setBalancerTemplate(template);
    } else {
      setActiveTab('environmental');
      setEnvironmentalTemplate(template);
    }
  }, []);

  const handleBalancerTemplateApplied = useCallback(() => {
    setBalancerTemplate(null);
  }, []);

  const handleEnvironmentalTemplateApplied = useCallback(() => {
    setEnvironmentalTemplate(null);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Swords className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">D&D Encounter Builder</h1>
                <p className="text-sm text-muted-foreground">
                  Create balanced encounters & dynamic scenarios
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Templates Button */}
              <Dialog open={showTemplatesDialog} onOpenChange={setShowTemplatesDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <LayoutTemplate className="h-4 w-4 mr-2" />
                    Templates
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <LayoutTemplate className="h-5 w-5" />
                      Encounter Templates
                    </DialogTitle>
                    <DialogDescription>
                      Choose a pre-built encounter template to get started quickly
                    </DialogDescription>
                  </DialogHeader>
                  <div className="overflow-auto">
                    <EncounterTemplatesGallery
                      onSelectTemplate={handleSelectTemplate}
                      selectedType={activeTab === 'balancer' ? 'balancer' : 'environmental'}
                    />
                  </div>
                </DialogContent>
              </Dialog>
              
              <SavedElementsPanel />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="balancer" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Balancer
            </TabsTrigger>
            <TabsTrigger value="environmental" className="flex items-center gap-2">
              <Mountain className="h-4 w-4" />
              Environmental
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Combat Encounter Balancer */}
          <TabsContent value="balancer" className="space-y-6">
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="px-0 pt-0">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-emerald-500" />
                  <CardTitle>Combat Encounter Balancer</CardTitle>
                </div>
                <CardDescription>
                  Design balanced encounters based on party level, difficulty, and XP thresholds
                </CardDescription>
              </CardHeader>
            </Card>
            
            <EncounterBalancerTab 
              template={balancerTemplate}
              onTemplateApplied={handleBalancerTemplateApplied}
            />
          </TabsContent>

          {/* Tab 2: Environmental Combat Scenario */}
          <TabsContent value="environmental" className="space-y-6">
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="px-0 pt-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  <CardTitle>Environmental Combat Scenario</CardTitle>
                </div>
                <CardDescription>
                  Create dynamic encounters that leverage geography, hazards, and environmental mechanics
                </CardDescription>
              </CardHeader>
            </Card>
            
            <EnvironmentalScenarioTab 
              template={environmentalTemplate}
              onTemplateApplied={handleEnvironmentalTemplateApplied}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto bg-card/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>D&D Encounter Builder</p>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">
                v1.0.0
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
