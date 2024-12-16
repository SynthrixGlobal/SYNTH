import { Context } from '../../types';
import { PipelineStage } from '../types';

export class ValidationStage implements PipelineStage {
  async process(context: Context): Promise<Context> {
    this.validateRequired(context);
    this.validateMetadata(context);
    this.validateContent(context);
    return context;
  }

  private validateRequired(context: Context): void {
    if (!context.id) {
      throw new Error('Context ID is required');
    }
    if (!context.timestamp) {
      throw new Error('Context timestamp is required');
    }
  }

  private validateMetadata(context: Context): void {
    const { metadata } = context.content;
    if (!metadata.type) {
      throw new Error('Context type is required');
    }
    if (!Array.isArray(metadata.tags)) {
      throw new Error('Context tags must be an array');
    }
    if (typeof metadata.priority !== 'number' || metadata.priority < 0 || metadata.priority > 1) {
      throw new Error('Context priority must be a number between 0 and 1');
    }
  }

  private validateContent(context: Context): void {
    if (typeof context.content.text !== 'string') {
      throw new Error('Context text must be a string');
    }
    if (context.content.text.length === 0) {
      throw new Error('Context text cannot be empty');
    }
  }
}