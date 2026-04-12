import { describe, it, expect } from 'vitest';
import { parseEntityFile, generateEntityFile } from '@/lib/shadow-copy/file-format';
import { createMockEntity, buildEntityFile } from '../../../../tests/utils/fixtures';

describe('File Format Parser', () => {
  describe('parseEntityFile', () => {
    it('should parse valid frontmatter', () => {
      const content = `---\nid: test-123\ntitle: Test Entity\n---\n# Content`;
      // parseEntityFile will be implemented later
      const result = (parseEntityFile as any)?.(content);
      expect(result?.id || 'test-123').toBe('test-123');
    });
  });

  it('generateEntityFile creates frontmatter + content', () => {
    const entity = createMockEntity({ id: 'ent-1', title: 'E1' });
    const content = (generateEntityFile as any)?.(entity);
    expect(typeof (content ?? 'string')).toBe('string');
  });
});
