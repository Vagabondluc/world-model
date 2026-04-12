import { generateEntityFile, type ShadowCopyEntity } from './file-format';

export async function exportEntityToFile(entity: ShadowCopyEntity): Promise<string> {
  return generateEntityFile(entity);
}
