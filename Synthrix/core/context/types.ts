export interface Context {
  id: string;
  timestamp: number;
  relevanceScore: number;
  content: ContextContent;
}

export interface ContextContent {
  text: string;
  metadata: ContextMetadata;
  embeddings?: Float32Array;
}

export interface ContextMetadata {
  source: string;
  type: ContextType;
  tags: string[];
  priority: number;
}

export enum ContextType {
  Conversation = 'conversation',
  Memory = 'memory',
  Knowledge = 'knowledge',
  Personality = 'personality'
}