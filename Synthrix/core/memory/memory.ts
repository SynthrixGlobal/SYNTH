export enum MemoryType {
  ShortTerm,
  LongTerm
}

export interface Memory {
  id: string;
  type: MemoryType;
  content: string;
  timestamp: number;
  importance: number; // 0-1 scale
  emotionalContext?: EmotionalContext;
}

export interface EmotionalContext {
  valence: number;
  intensity: number;
  tags: string[];
}