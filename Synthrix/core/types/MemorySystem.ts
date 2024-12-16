import { Memory, MemoryType } from '../types/memory';

export class MemorySystem {
  private readonly shortTerm: Memory[];
  private readonly longTerm: Memory[];
  private readonly capacity: number;

  constructor(capacity: number = 1000) {
    this.shortTerm = [];
    this.longTerm = [];
    this.capacity = capacity;
  }

  async store(memory: Memory): Promise<void> {
    if (memory.type === MemoryType.ShortTerm) {
      this.shortTerm.push(memory);
      await this.consolidate();
    } else {
      this.longTerm.push(memory);
      if (this.longTerm.length > this.capacity) {
        this.longTerm.shift();
      }
    }
  }

  private async consolidate(): Promise<void> {
    // Convert important short-term memories to long-term
    const important = this.shortTerm.filter(
      m => this.isSignificant(m)
    );
    
    for (const memory of important) {
      await this.store({
        ...memory,
        type: MemoryType.LongTerm
      });
    }
  }

  private isSignificant(memory: Memory): boolean {
    // Implementation would evaluate memory significance
    return memory.importance > 0.8;
  }
}