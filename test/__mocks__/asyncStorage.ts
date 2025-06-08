/**
 * AsyncStorage Mock - In-memory implementation for testing
 */

class MockAsyncStorage {
  private storage: Map<string, string> = new Map();

  async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }

  async getAllKeys(): Promise<string[]> {
    return Array.from(this.storage.keys());
  }

  async multiGet(keys: string[]): Promise<[string, string | null][]> {
    return keys.map(key => [key, this.storage.get(key) || null]);
  }

  async multiSet(keyValuePairs: [string, string][]): Promise<void> {
    keyValuePairs.forEach(([key, value]) => {
      this.storage.set(key, value);
    });
  }

  // Test utilities
  __reset(): void {
    this.storage.clear();
  }

  __getStorage(): Map<string, string> {
    return new Map(this.storage);
  }
}

export const mockAsyncStorage = new MockAsyncStorage();

// Export for Jest mock
export default mockAsyncStorage;