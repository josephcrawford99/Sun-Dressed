class RateLimiter {
  private lastRequestTime = 0;
  private readonly minInterval: number;

  constructor(minIntervalMs: number) {
    this.minInterval = minIntervalMs;
  }

  async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }
}

export const geminiRateLimiter = new RateLimiter(5000); // 5 seconds
export const weatherRateLimiter = new RateLimiter(10000); // 10 seconds (OpenWeather best practice)
export const geocodingRateLimiter = new RateLimiter(1000); // 1 second (responsive validation)