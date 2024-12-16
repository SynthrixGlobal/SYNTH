import { Context, ContextType } from './types';
import { ContextStore } from './ContextStore';
import { ContextRetriever } from './retrieval/ContextRetriever';
import { ContextProcessor } from './processing/ContextProcessor';
import { generateContextId } from '../utils/ids';

export class ContextManager {
  private store: ContextStore;
  private retriever: ContextRetriever;
  private processor: ContextProcessor;

  constructor() {
    this.store = new ContextStore();
    this.retriever = new ContextRetriever();
    this.processor = new ContextProcessor();
  }

  async addContext(content: string, type: ContextType, metadata: any): Promise<Context> {
    const context: Context = {
      id: generateContextId(),
      timestamp: Date.now(),
      relevanceScore: 1.0,
      content: {
        text: content,
        metadata: {
          ...metadata,
          type,
          tags: [],
          priority: this.calculatePriority(type)
        }
      }
    };

    const processedContext = await this.processor.process(context);
    this.store.add(processedContext);
    return processedContext;
  }

  private calculatePriority(type: ContextType): number {
    const priorities: Record<ContextType, number> = {
      [ContextType.Conversation]: 0.8,
      [ContextType.Memory]: 0.6,
      [ContextType.Knowledge]: 0.4,
      [ContextType.Personality]: 1.0
    };
    return priorities[type] || 0.5;
  }
}