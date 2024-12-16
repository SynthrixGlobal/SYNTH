export interface Trait {
  id: string;
  name: string;
  value: number; // 0-1 scale
  flexibility: number; // How much it can change
}

export interface EmotionalState {
  valence: number; // Positive-negative
  arousal: number; // Active-passive
  dominance: number; // Dominant-submissive
}

export type PersonalityVector = Float32Array;

export interface PersonalityConfig {
  baseTraits: Trait[];
  emotionalRange: {
    valence: [number, number];
    arousal: [number, number];
    dominance: [number, number];
  };
}