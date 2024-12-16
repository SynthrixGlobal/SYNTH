import { Context } from '../types';

export class RelevanceScorer {
  async score(
    context: Context,
    queryEmbedding: Float32Array
  ): Promise<number> {
    const timeDecay = this.calculateTimeDecay(context.timestamp);
    const semanticScore = await this.calculateSemanticScore(
      context,
      queryEmbedding
    );
    const priorityBoost = context.content.metadata.priority;

    return (semanticScore * 0.6 + timeDecay * 0.2 + priorityBoost * 0.2);
  }

  private calculateTimeDecay(timestamp: number): number {
    const age = Date.now() - timestamp;
    const halfLife = 24 * 60 * 60 * 1000; // 24 hours
    return Math.exp(-age / halfLife);
  }

  private async calculateSemanticScore(
    context: Context,
    queryEmbedding: Float32Array
  ): Promise<number> {
    if (!context.content.embeddings) return 0.5;
    
    // Simplified similarity calculation
    let similarity = 0;
    for (let i = 0; i < queryEmbedding.length; i++) {
      similarity += context.content.embeddings[i] * queryEmbedding[i];
    }
    return similarity;
  }
}