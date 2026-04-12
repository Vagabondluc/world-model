// Mock file references - in a real implementation, this would parse actual files
export const getFileReferences = (filePath: string): string[] => {
    const referenceMap: Record<string, string[]> = {
      '/rules/era-1-rules.html': ['useStaticContent.ts', 'RulesContainer.tsx'],
      '/rules/era-2-rules.html': ['useStaticContent.ts', 'RulesContainer.tsx'],
      '/rules/era-3-rules.html': ['useStaticContent.ts', 'RulesContainer.tsx', 'FactionCreator.tsx'],
      '/rules/era-4-rules.html': ['useStaticContent.ts', 'RulesContainer.tsx', 'EventSystem.tsx'],
      'useStaticContent.ts': ['referenceTables.ts', 'GameContext.tsx'],
      'GameContext.tsx': ['types.ts', 'localStorage', 'prepopulationData.ts'],
      'AppLayout.tsx': ['NavigationHeader.tsx', 'UnifiedDebugSystem.tsx'],
    };
    return referenceMap[filePath] || [];
};

export const getReferencedBy = (filePath: string): string[] => {
    const referencedByMap: Record<string, string[]> = {
      'useStaticContent.ts': ['/rules/era-1-rules.html', '/rules/era-2-rules.html', '/rules/era-3-rules.html'],
      'types.ts': ['GameContext.tsx', 'ElementManager.tsx', 'all components'],
      'referenceTables.ts': ['useStaticContent.ts'],
    };
    return referencedByMap[filePath] || [];
};