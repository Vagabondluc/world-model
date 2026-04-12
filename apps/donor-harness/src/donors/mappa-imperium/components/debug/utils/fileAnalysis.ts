// Mock file references - in a real implementation, this would parse actual files
export const getFileReferences = (filePath: string): string[] => {
    const referenceMap: Record<string, string[]> = {
      'src/stores/gameStore.ts': ['src/types.ts'],
      'src/App.tsx': ['src/stores/gameStore.ts', 'src/components/debug/UnifiedDebugSystem.tsx'],
    };
    return referenceMap[filePath] || [];
};

export const getReferencedBy = (filePath: string): string[] => {
    const referencedByMap: Record<string, string[]> = {
      'src/types.ts': ['src/stores/gameStore.ts'],
    };
    return referencedByMap[filePath] || [];
};