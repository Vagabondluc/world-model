type Commit = { id: string; message: string };

const history: Commit[] = [
  { id: 'c1', message: 'Initial snapshot' },
  { id: 'c2', message: 'Second snapshot' },
];

export async function getHistory(): Promise<Commit[]> {
  return [...history];
}

export async function diff(from: string, to: string): Promise<string> {
  return `diff ${from}..${to}`;
}
