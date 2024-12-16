import { Context, ContextType } from '../types';

export interface PipelineStage {
  process(context: Context): Promise<Context>;
}

export interface PipelineConfig {
  stages: PipelineStage[];
  errorHandling: ErrorHandlingStrategy;
  maxProcessingTime: number; // milliseconds
}

export enum ErrorHandlingStrategy {
  CONTINUE = 'continue',
  ABORT = 'abort',
  RETRY = 'retry'
}

export interface ProcessingMetrics {
  startTime: number;
  endTime: number;
  stageMetrics: StageMetric[];
}

export interface StageMetric {
  stageName: string;
  duration: number;
  success: boolean;
  error?: Error;
}