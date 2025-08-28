import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

/**
 * Performance monitoring configuration for HRthis
 * Tracks Core Web Vitals and custom performance metrics
 */

interface PerformanceThresholds {
  LCP: { good: number; needsImprovement: number };
  INP: { good: number; needsImprovement: number };
  CLS: { good: number; needsImprovement: number };
  FCP: { good: number; needsImprovement: number };
  TTFB: { good: number; needsImprovement: number };
}

// Performance thresholds based on Web Vitals standards
const THRESHOLDS: PerformanceThresholds = {
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
  INP: { good: 200, needsImprovement: 500 },    // Interaction to Next Paint
  CLS: { good: 0.1, needsImprovement: 0.25 },   // Cumulative Layout Shift
  FCP: { good: 1800, needsImprovement: 3000 },  // First Contentful Paint
  TTFB: { good: 800, needsImprovement: 1800 },  // Time to First Byte
};

interface PerformanceData {
  metric: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceData[] = [];
  private reportCallback?: (data: PerformanceData) => void;
  private batchTimer?: ReturnType<typeof setInterval>;
  private batchSize = 10;
  private batchInterval = 30000; // 30 seconds

  /**
   * Initialize performance monitoring
   */
  init(options?: {
    reportCallback?: (data: PerformanceData) => void;
    batchSize?: number;
    batchInterval?: number;
    enableLogging?: boolean;
  }) {
    if (options?.reportCallback) {
      this.reportCallback = options.reportCallback;
    }
    if (options?.batchSize) {
      this.batchSize = options.batchSize;
    }
    if (options?.batchInterval) {
      this.batchInterval = options.batchInterval;
    }

    // Register Web Vitals handlers
    this.registerWebVitals(options?.enableLogging);

    // Monitor custom metrics
    this.monitorCustomMetrics();

    // Set up batch reporting
    this.setupBatchReporting();

    // Monitor navigation timing
    this.monitorNavigationTiming();
  }

  /**
   * Register Web Vitals handlers
   */
  private registerWebVitals(enableLogging = false) {
    // Largest Contentful Paint
    onLCP((metric) => {
      this.handleMetric(metric, 'LCP', enableLogging);
    });

    // Interaction to Next Paint
    onINP((metric) => {
      this.handleMetric(metric, 'INP', enableLogging);
    });

    // Cumulative Layout Shift
    onCLS((metric) => {
      this.handleMetric(metric, 'CLS', enableLogging);
    });

    // First Contentful Paint
    onFCP((metric) => {
      this.handleMetric(metric, 'FCP', enableLogging);
    });

    // Time to First Byte
    onTTFB((metric) => {
      this.handleMetric(metric, 'TTFB', enableLogging);
    });
  }

  /**
   * Handle individual metric
   */
  private handleMetric(metric: Metric, name: keyof PerformanceThresholds, enableLogging: boolean) {
    const rating = this.getRating(name, metric.value);
    
    const data: PerformanceData = {
      metric: name,
      value: Math.round(metric.value),
      rating,
      timestamp: Date.now(),
      metadata: {
        id: metric.id,
        navigationType: metric.navigationType,
        delta: metric.delta,
      },
    };

    this.metrics.push(data);

    if (enableLogging) {
      const emoji = rating === 'good' ? '✅' : rating === 'needs-improvement' ? '⚠️' : '❌';
      console.log(`${emoji} ${name}: ${Math.round(metric.value)}ms [${rating}]`);
    }

    // Report immediately if callback is set and metric is poor
    if (this.reportCallback && rating === 'poor') {
      this.reportCallback(data);
    }

    // Check if batch is ready
    if (this.metrics.length >= this.batchSize) {
      this.sendBatch();
    }
  }

  /**
   * Get performance rating based on thresholds
   */
  private getRating(metric: keyof PerformanceThresholds, value: number): 'good' | 'needs-improvement' | 'poor' {
    const threshold = THRESHOLDS[metric];
    
    if (value <= threshold.good) {
      return 'good';
    } else if (value <= threshold.needsImprovement) {
      return 'needs-improvement';
    } else {
      return 'poor';
    }
  }

  /**
   * Monitor custom application metrics
   */
  private monitorCustomMetrics() {
    // Monitor React render performance
    if (window.performance && window.performance.measure) {
      // Measure initial app load
      window.addEventListener('load', () => {
        const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigationEntry) {
          const appLoadTime = navigationEntry.loadEventEnd - navigationEntry.fetchStart;
          
          this.metrics.push({
            metric: 'APP_LOAD',
            value: Math.round(appLoadTime),
            rating: appLoadTime < 3000 ? 'good' : appLoadTime < 5000 ? 'needs-improvement' : 'poor',
            timestamp: Date.now(),
          });
        }
      });

      // Monitor API response times
      this.monitorAPIPerformance();
    }

    // Monitor memory usage
    this.monitorMemoryUsage();

    // Monitor long tasks
    this.monitorLongTasks();
  }

  /**
   * Monitor API performance
   */
  private monitorAPIPerformance() {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
      
      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - startTime;
        
        // Only track API calls (not static resources)
        if (url.includes('/api/')) {
          this.metrics.push({
            metric: 'API_RESPONSE',
            value: Math.round(duration),
            rating: duration < 200 ? 'good' : duration < 1000 ? 'needs-improvement' : 'poor',
            timestamp: Date.now(),
            metadata: {
              url,
              status: response.status,
              method: args[1]?.method || 'GET',
            },
          });
        }
        
        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        
        this.metrics.push({
          metric: 'API_ERROR',
          value: Math.round(duration),
          rating: 'poor',
          timestamp: Date.now(),
          metadata: {
            url,
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });
        
        throw error;
      }
    };
  }

  /**
   * Monitor memory usage
   */
  private monitorMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usedMemoryMB = Math.round(memory.usedJSHeapSize / 1048576);
        const limitMemoryMB = Math.round(memory.jsHeapSizeLimit / 1048576);
        const percentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        
        if (percentage > 90) {
          this.metrics.push({
            metric: 'MEMORY_WARNING',
            value: Math.round(percentage),
            rating: 'poor',
            timestamp: Date.now(),
            metadata: {
              usedMB: usedMemoryMB,
              limitMB: limitMemoryMB,
            },
          });
        }
      }, 60000); // Check every minute
    }
  }

  /**
   * Monitor long tasks
   */
  private monitorLongTasks() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) { // Tasks longer than 50ms
              this.metrics.push({
                metric: 'LONG_TASK',
                value: Math.round(entry.duration),
                rating: entry.duration < 100 ? 'needs-improvement' : 'poor',
                timestamp: Date.now(),
                metadata: {
                  name: entry.name,
                  startTime: entry.startTime,
                },
              });
            }
          }
        });
        
        observer.observe({ entryTypes: ['longtask'] });
      } catch (error) {
        // PerformanceObserver not supported
      }
    }
  }

  /**
   * Monitor navigation timing
   */
  private monitorNavigationTiming() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          // DNS lookup time
          const dnsTime = navigation.domainLookupEnd - navigation.domainLookupStart;
          if (dnsTime > 0) {
            this.metrics.push({
              metric: 'DNS_LOOKUP',
              value: Math.round(dnsTime),
              rating: dnsTime < 50 ? 'good' : dnsTime < 100 ? 'needs-improvement' : 'poor',
              timestamp: Date.now(),
            });
          }

          // TCP connection time
          const tcpTime = navigation.connectEnd - navigation.connectStart;
          if (tcpTime > 0) {
            this.metrics.push({
              metric: 'TCP_CONNECT',
              value: Math.round(tcpTime),
              rating: tcpTime < 100 ? 'good' : tcpTime < 200 ? 'needs-improvement' : 'poor',
              timestamp: Date.now(),
            });
          }

          // DOM processing time
          const domTime = navigation.domComplete - navigation.domInteractive;
          this.metrics.push({
            metric: 'DOM_PROCESSING',
            value: Math.round(domTime),
            rating: domTime < 500 ? 'good' : domTime < 1000 ? 'needs-improvement' : 'poor',
            timestamp: Date.now(),
          });
        }
      }, 0);
    });
  }

  /**
   * Set up batch reporting
   */
  private setupBatchReporting() {
    this.batchTimer = setInterval(() => {
      if (this.metrics.length > 0) {
        this.sendBatch();
      }
    }, this.batchInterval);

    // Send batch on page unload
    window.addEventListener('beforeunload', () => {
      if (this.metrics.length > 0) {
        this.sendBatch();
      }
    });
  }

  /**
   * Send metrics batch
   */
  private sendBatch() {
    if (this.metrics.length === 0) return;

    const batch = [...this.metrics];
    this.metrics = [];

    // Calculate summary
    const summary = this.calculateSummary(batch);

    // Log summary in development
    if (process.env.NODE_ENV === 'development') {
      console.group('📊 Performance Metrics Summary');
      console.table(summary);
      console.groupEnd();
    }

    // Send to reporting endpoint
    if (this.reportCallback) {
      batch.forEach(metric => this.reportCallback!(metric));
    }

    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_ANALYTICS_URL) {
      fetch(process.env.REACT_APP_ANALYTICS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics: batch, summary }),
      }).catch(error => {
        console.error('Failed to send performance metrics:', error);
      });
    }
  }

  /**
   * Calculate metrics summary
   */
  private calculateSummary(metrics: PerformanceData[]) {
    const summary: Record<string, any> = {};
    
    const metricGroups: Record<string, number[]> = {};
    metrics.forEach((metric) => {
      const key = metric.metric;
      (metricGroups[key] ??= []).push(metric.value);
    });

    for (const [metric, values] of Object.entries(metricGroups)) {
      const sorted = values.sort((a, b) => a - b);
      summary[metric] = {
        count: values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
        p50: sorted[Math.floor(sorted.length * 0.5)],
        p75: sorted[Math.floor(sorted.length * 0.75)],
        p95: sorted[Math.floor(sorted.length * 0.95)],
      };
    }

    return summary;
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceData[] {
    return [...this.metrics];
  }

  /**
   * Clear metrics
   */
  clearMetrics() {
    this.metrics = [];
  }

  /**
   * Destroy performance monitor
   */
  destroy() {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
    }
    this.sendBatch();
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export types
export type { PerformanceData, PerformanceThresholds };

// Convenience function to start monitoring
export const startPerformanceMonitoring = (options?: Parameters<PerformanceMonitor['init']>[0]) => {
  performanceMonitor.init(options);
};

// Export for testing
export { PerformanceMonitor };