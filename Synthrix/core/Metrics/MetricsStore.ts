import { MetricValue, MetricName, MetricDimensions } from './types';

interface MetricEntry {
  value: MetricValue;
  dimensions: MetricDimensions;
}

export class MetricsStore {
  private metrics: Map<string, MetricEntry[]>;
  private readonly retentionPeriod: number;

  constructor(retentionHours: number = 24) {
    this.metrics = new Map();
    this.retentionPeriod = retentionHours * 60 * 60 * 1000;
  }

  add(
    name: MetricName,
    value: MetricValue,
    dimensions: MetricDimensions
  ): void {
    const key = this.getMetricKey(name, dimensions);
    
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }
    
    this.metrics.get(key)!.push({ value, dimensions });
    this.cleanup();
  }

  query(
    name: MetricName,
    dimensions: Partial<MetricDimensions>,
    timeRange: { start: number; end: number }
  ): MetricEntry[] {
    const results: MetricEntry[] = [];
    const dimensionKeys = Object.keys(dimensions);

    for (const [key, entries] of this.metrics.entries()) {
      if (!key.startsWith(name)) continue;

      for (const entry of entries) {
        if (
          this.matchDimensions(entry.dimensions, dimensions, dimensionKeys) &&
          entry.value.timestamp >= timeRange.start &&
          entry.value.timestamp <= timeRange.end
        ) {
          results.push(entry);
        }
      }
    }

    return results;
  }

  private getMetricKey(
    name: MetricName,
    dimensions: MetricDimensions
  ): string {
    const sortedDimensions = Object.entries(dimensions)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join(',');
    
    return `${name}:${sortedDimensions}`;
  }

  private matchDimensions(
    actual: MetricDimensions,
    filter: Partial<MetricDimensions>,
    filterKeys: string[]
  ): boolean {
    return filterKeys.every(key => 
      !filter[key] || actual[key] === filter[key]
    );
  }

  private cleanup(): void {
    const cutoff = Date.now() - this.retentionPeriod;
    
    for (const [key, entries] of this.metrics.entries()) {
      const filtered = entries.filter(
        entry => entry.value.timestamp >= cutoff
      );
      
      if (filtered.length === 0) {
        this.metrics.delete(key);
      } else {
        this.metrics.set(key, filtered);
      }
    }
  }
}