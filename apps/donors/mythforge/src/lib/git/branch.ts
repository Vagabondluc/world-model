type Branch = { name: string };

const branches: Branch[] = [{ name: 'main' }];

export async function createBranch(name: string): Promise<Branch> {
  const branch = { name };
  if (!branches.some((entry) => entry.name === name)) {
    branches.push(branch);
  }
  return branch;
}

export async function listBranches(): Promise<Branch[]> {
  return [...branches];
}
