import { Context, ContextType } from './types';

export class ContextStore {
  private contexts: Map<string, Context>;
  private readonly maxSize: number;

  constructor(maxSize: number = 1000) {
    this.contexts = new Map();
    this.maxSize = maxSize;
  }

  add(context: Context): void {
    if (this.contexts.size >= this.maxSize) {
      this.removeOldestLowPriority();
    }
    this.contexts.set(context.id, context);
  }

  get(id: string): Context | undefined {
    return this.contexts.get(id);
  }

  private removeOldestLowPriority(): void {
    let oldestLowPriority: Context | null = null;
    
    for (const context of this.contexts.values()) {
      if (!oldestLowPriority || (
        context.content.metadata.priority < oldestLowPriority.content.metadata.priority &&
        context.timestamp < oldestLowPriority.timestamp
      )) {
        oldestLowPriority = context;
      }
    }

    if (oldestLowPriority) {
      this.contexts.delete(oldestLowPriority.id);
    }
  }
}