import { MetricValue, MetricName, MetricDimensions } from './types';
import { MetricsStore } from './MetricsStore';
import { MetricsAggregator } from './MetricsAggregator';

export class MetricsCollector {
  private store: MetricsStore;
  private aggregator: MetricsAggregator;

  constructor() {
    this.store = new MetricsStore();
    this.aggregator = new MetricsAggregator();
  }

  record(
    name: MetricName,
    value: number,
    dimensions: MetricDimensions
  ): void {
    const metric: MetricValue = {
      value,
      timestamp: Date.now()
    };

    this.store.add(name, metric, dimensions);
    this.aggregator.update(name, metric, dimensions);
  }

  startTimer(
    name: MetricName,
    dimensions: MetricDimensions
  ): () => void {
    const startTime = Date.now();
    
    return () => {
      const duration = Date.now() - startTime;
      this.record(name, duration, dimensions);
    };
  }

  incrementCounter(
    name: MetricName,
    dimensions: MetricDimensions
  ): void {
    this.record(name, 1, dimensions);
  }

  recordError(
    component: string,
    operation: string,
    error: Error
  ): void {
    this.record('error_rate', 1, {
      component,
      operation,
      status: 'failure',
      error_type: error.name,
      error_message: error.message
    });
  }
}