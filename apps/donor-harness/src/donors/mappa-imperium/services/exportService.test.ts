import { exportElementToHtml, exportElementToMarkdown, exportChronicleFeed } from './exportService';
import { ElementCard } from '@mi/types';

describe('exportService', () => {
    const mockElement: ElementCard = {
        id: '1',
        name: 'Test Element',
        type: 'Resource',
        owner: 1,
        era: 1,
        // Mocking minimal data structure
        data: { id: '1', name: 'Test Element', type: 'mineral', properties: 'Props', symbol: 'S' } as any,
        isDebug: false
    };

    // The current implementation of export functions in exportService.ts (step 113) uses element.desc
    // But ElementCard interface (step 94) does not have 'desc'. It has 'data' which might have 'description'.
    // Or maybe ElementCard has specific fields. 
    // Step 113 showed: return `<div><h1>${element.name}</h1><p>${element.desc}</p></div>`;
    // So exportService.ts expects 'desc' on element, but types.ts says ElementCard has 'data'.
    // This implies exportService.ts might be using an outdated or loose type, or strict compilation is off/bypassed.
    // However, I need to test what IS there.

    // If I pass an object with desc, it should work at runtime.
    // For TS, I might need to cast or fix the service. 
    // Given my task is to add tests, testing the current behavior is priority.

    it('exportElementToHtml should return formatted HTML string', () => {
        const result = exportElementToHtml({ ...mockElement, desc: 'Description' } as any);
        expect(result).toContain('<h1>Test Element</h1>');
        expect(result).toContain('<p>Description</p>');
    });

    it('exportElementToMarkdown should return formatted Markdown string', () => {
        const result = exportElementToMarkdown({ ...mockElement, desc: 'Description' } as any);
        expect(result).toContain('# Test Element');
        expect(result).toContain('Description');
    });

    it('exportChronicleFeed should return JSON string', () => {
        const data = { foo: 'bar' };
        const result = exportChronicleFeed(data);
        expect(result).toBe(JSON.stringify(data, null, 2));
    });
});
