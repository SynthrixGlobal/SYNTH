import { PipelineConfig, ErrorHandlingStrategy } from './types';
import { ValidationStage } from './stages/ValidationStage';
import { EnrichmentStage } from './stages/EnrichmentStage';
import { RelevanceStage } from './stages/RelevanceStage';
import { CompressionStage } from './stages/CompressionStage';
import { ContextPipeline } from './ContextPipeline';

export class PipelineFactory {
  static createDefault(): ContextPipeline {
    const config: PipelineConfig = {
      stages: [
        new ValidationStage(),
        new EnrichmentStage(),
        new RelevanceStage(),
        new CompressionStage()
      ],
      errorHandling: ErrorHandlingStrategy.CONTINUE,
      maxProcessingTime: 5000 // 5 seconds
    };

    return new ContextPipeline(config);
  }

  static createCustom(config: Partial<PipelineConfig>): ContextPipeline {
    const defaultConfig = this.getDefaultConfig();
    return new ContextPipeline({
      ...defaultConfig,
      ...config
    });
  }

  private static getDefaultConfig(): PipelineConfig {
    return {
      stages: [
        new ValidationStage(),
        new EnrichmentStage(),
        new RelevanceStage(),
        new CompressionStage()
      ],
      errorHandling: ErrorHandlingStrategy.CONTINUE,
      maxProcessingTime: 5000
    };
  }
}