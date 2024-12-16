import { MetricValue, MetricName, MetricDimensions, MetricSummary } from './types';

interface AggregationWindow {
  values: number[];
  timeRange: {
    start: number;
    end: number;
  };
}

export class MetricsAggregator {
  private windows: Map<string, AggregationWindow>;
  private readonly windowSize: number;

  constructor(windowSizeMinutes: number = 5) {
    this.windows = new Map();
    this.windowSize = windowSizeMinutes * 60 * 1000;
  }

  update(
    name: MetricName,
    metric: MetricValue,
    dimensions: MetricDimensions
  ): void {
    const key = this.getWindowKey(name, dimensions);
    const window = this.getOrCreateWindow(key, metric.timestamp);

    window.values.push(metric.value);
  }

  getSummary(
    name: MetricName,
    dimensions: MetricDimensions
  ): MetricSummary {
    const key = this.getWindowKey(name, dimensions);
    const window = this.windows.get(key);

    if (!window || window.values.length === 0) {
      return this.getEmptySummary();
    }

    const sorted = [...window.values].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);

    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: sum / sorted.length,
      p95: this.getPercentile(sorted, 0.95),
      p99: this.getPercentile(sorted, 0.99),
      count: sorted.length,
      timeRange: window.timeRange
    };
  }

  private getWindowKey(
    name: MetricName,
    dimensions: MetricDimensions
  ): string {
    return `${name}:${JSON.stringify(dimensions)}`;
  }

  private getOrCreateWindow(
    key: string,
    timestamp: number
  ): AggregationWindow {
    const windowStart = timestamp - (timestamp % this.windowSize);
    const windowEnd = windowStart + this.windowSize;

    let window = this.windows.get(key);

    if (!window || window.timeRange.end <= timestamp) {
      window = {
        values: [],
        timeRange: { start: windowStart, end: windowEnd }
      };
      this.windows.set(key, window);
    }

    return window;
  }

  private getPercentile(
    sorted: number[],
    percentile: number
  ): number {
    const index = Math.ceil(sorted.length * percentile) - 1;
    return sorted[index];
  }

  private getEmptySummary(): MetricSummary {
    return {
      min: 0,
      max: 0,
      avg: 0,
      p95: 0,
      p99: 0,
      count: 0,
      timeRange: {
        start: Date.now(),
        end: Date.now()
      }
    };
  }
}