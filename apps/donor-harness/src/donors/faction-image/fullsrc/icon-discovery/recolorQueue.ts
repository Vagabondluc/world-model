export class RecolorQueue {
  private readonly maxConcurrent: number;
  private active = 0;
  private pending: Array<() => void> = [];

  constructor(maxConcurrent = 5) {
    this.maxConcurrent = Math.max(1, maxConcurrent);
  }

  async enqueue<T>(task: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await task();
    } finally {
      this.release();
    }
  }

  getActiveCount(): number {
    return this.active;
  }

  getPendingCount(): number {
    return this.pending.length;
  }

  private acquire(): Promise<void> {
    if (this.active < this.maxConcurrent) {
      this.active += 1;
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      this.pending.push(() => {
        this.active += 1;
        resolve();
      });
    });
  }

  private release(): void {
    this.active = Math.max(0, this.active - 1);
    const next = this.pending.shift();
    if (next) next();
  }
}
