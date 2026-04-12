import { parseEntityFile, type ShadowCopyEntity } from './file-format';

export async function importFileToEntity(markdown: string): Promise<ShadowCopyEntity> {
  return parseEntityFile(markdown);
}
