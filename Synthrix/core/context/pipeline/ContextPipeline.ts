import { Context } from '../types';
import { PipelineConfig, ProcessingMetrics, StageMetric } from './types';

export class ContextPipeline {
  private readonly config: PipelineConfig;
  private metrics: ProcessingMetrics;

  constructor(config: PipelineConfig) {
    this.config = config;
    this.metrics = this.initializeMetrics();
  }

  private initializeMetrics(): ProcessingMetrics {
    return {
      startTime: 0,
      endTime: 0,
      stageMetrics: []
    };
  }

  async process(context: Context): Promise<Context> {
    this.metrics = this.initializeMetrics();
    this.metrics.startTime = Date.now();

    let processedContext = { ...context };

    for (const stage of this.config.stages) {
      const stageMetric: StageMetric = {
        stageName: stage.constructor.name,
        duration: 0,
        success: false
      };

      const stageStart = Date.now();

      try {
        processedContext = await Promise.race([
          stage.process(processedContext),
          this.timeoutPromise(this.config.maxProcessingTime)
        ]);

        stageMetric.success = true;
      } catch (error) {
        stageMetric.error = error as Error;
        
        if (this.config.errorHandling === 'abort') {
          throw error;
        }
      } finally {
        stageMetric.duration = Date.now() - stageStart;
        this.metrics.stageMetrics.push(stageMetric);
      }
    }

    this.metrics.endTime = Date.now();
    return processedContext;
  }

  private timeoutPromise(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Processing timeout after ${ms}ms`));
      }, ms);
    });
  }

  getMetrics(): ProcessingMetrics {
    return this.metrics;
  }
}