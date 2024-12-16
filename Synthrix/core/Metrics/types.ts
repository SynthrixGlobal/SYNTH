export interface MetricValue {
  value: number;
  timestamp: number;
}

export interface MetricSummary {
  min: number;
  max: number;
  avg: number;
  p95: number;
  p99: number;
  count: number;
  timeRange: {
    start: number;
    end: number;
  };
}

export interface MetricDimensions {
  component: string;
  operation: string;
  status: 'success' | 'failure';
  [key: string]: string;
}

export type MetricName = 
  | 'latency'
  | 'throughput'
  | 'error_rate'
  | 'memory_usage'
  | 'cpu_usage'
  | 'context_size'
  | 'token_count';