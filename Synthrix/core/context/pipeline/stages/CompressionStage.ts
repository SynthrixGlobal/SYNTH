import { Context } from '../../types';
import { PipelineStage } from '../types';

export class CompressionStage implements PipelineStage {
  private readonly maxLength: number;

  constructor(maxLength: number = 1000) {
    this.maxLength = maxLength;
  }

  async process(context: Context): Promise<Context> {
    if (context.content.text.length <= this.maxLength) {
      return context;
    }

    return {
      ...context,
      content: {
        ...context.content,
        text: await this.compressText(context.content.text),
        metadata: {
          ...context.content.metadata,
          compressed: true,
          originalLength: context.content.text.length
        }
      }
    };
  }

  private async compressText(text: string): Promise<string> {
    // In a real implementation, this would:
    // - Use text summarization
    // - Preserve key information
    // - Maintain semantic meaning
    return text.substring(0, this.maxLength);
  }
}