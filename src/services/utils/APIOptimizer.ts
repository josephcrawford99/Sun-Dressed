/**
 * API optimization utilities for debouncing and coalescing requests
 */
export class APIOptimizer {
  private pendingRequests: Map<string, Promise<any>> = new Map();
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  
  /**
   * Debounce a request - delays execution until no new calls for specified duration
   */
  async debounceRequest<T>(
    key: string,
    fn: () => Promise<T>,
    delay: number = 500
  ): Promise<T> {
    console.log(`⏱️ Debouncing request for key: ${key}`);
    
    // Clear existing timer if any
    const existingTimer = this.debounceTimers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    
    return new Promise((resolve, reject) => {
      const timer = setTimeout(async () => {
        try {
          console.log(`🚀 Executing debounced request: ${key}`);
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.debounceTimers.delete(key);
        }
      }, delay);
      
      this.debounceTimers.set(key, timer);
    });
  }
  
  /**
   * Coalesce requests - multiple calls with same key share the same promise
   */
  async coalesceRequest<T>(
    key: string,
    fn: () => Promise<T>
  ): Promise<T> {
    // Check if request is already pending
    const pending = this.pendingRequests.get(key);
    if (pending) {
      console.log(`🔄 Reusing pending request for key: ${key}`);
      return pending as Promise<T>;
    }
    
    console.log(`🆕 Creating new request for key: ${key}`);
    
    // Create new request
    const request = fn().finally(() => {
      // Clean up after completion
      this.pendingRequests.delete(key);
    });
    
    this.pendingRequests.set(key, request);
    return request;
  }
  
  /**
   * Cancel a debounced request if pending
   */
  cancelDebounce(key: string): void {
    const timer = this.debounceTimers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.debounceTimers.delete(key);
      console.log(`❌ Cancelled debounced request: ${key}`);
    }
  }
  
  /**
   * Clear all pending operations
   */
  clearAll(): void {
    // Clear all debounce timers
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();
    
    // Note: We don't clear pending requests as they're already in-flight
    console.log('🧹 Cleared all debounce timers');
  }
  
  /**
   * Get statistics about pending operations
   */
  getStats(): { pendingRequests: number; pendingDebounces: number } {
    return {
      pendingRequests: this.pendingRequests.size,
      pendingDebounces: this.debounceTimers.size
    };
  }
}