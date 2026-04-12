export type MockEntity = {
  id: string;
  title?: string;
  category?: string;
  content?: string;
};

export function createMockEntity(overrides: Partial<MockEntity> = {}): MockEntity {
  return {
    id: `ent-${Math.random().toString(36).slice(2, 8)}`,
    title: 'Mock Entity',
    category: 'default',
    content: 'Mock content',
    ...overrides,
  };
}

export function createMockSchema(name = 'default') {
  return {
    name,
    fields: [{ name: 'title', type: 'string' }],
  };
}

export function buildEntityFile(entity: Partial<MockEntity>) {
  const e = createMockEntity(entity);
  return `---\nid: ${e.id}\ntitle: ${e.title}\ncategory: ${e.category}\n---\n${e.content || ''}`;
}
