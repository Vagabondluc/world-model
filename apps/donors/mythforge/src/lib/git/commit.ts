type Commit = { id: string; message: string };

const commits: Commit[] = [];

export async function commit(message: string): Promise<Commit> {
  const entry = { id: `commit-${commits.length + 1}`, message };
  commits.unshift(entry);
  return entry;
}
