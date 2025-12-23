import { buildOutfitPrompt, UserPreferences } from '@/utils/prompt-generator';
import { WeatherData } from '@/types/weather';
import { createMockWeatherData } from '../../test-helpers';

describe('buildOutfitPrompt', () => {
  const completeWeatherData: WeatherData = createMockWeatherData();

  const defaultUserPrefs: UserPreferences = {
    style: 'neutral',
    activity: 'going to the office',
  };

  describe('Complete Weather Data', () => {
    it('should generate prompt with all weather information when data is complete', () => {
      const prompt = buildOutfitPrompt(defaultUserPrefs, completeWeatherData, 'imperial');

      expect(prompt).toContain('Current Temperature: 72°F');
      expect(prompt).toContain('Feels like: 68°F');
      expect(prompt).toContain("Today's High: 75°F");
      expect(prompt).toContain("Today's Low: 60°F");
      expect(prompt).toContain('Chance of Rain: 30%');
      expect(prompt).toContain('Conditions: clear sky');
    });

    it('should use metric temperature symbols when format is metric', () => {
      const prompt = buildOutfitPrompt(defaultUserPrefs, completeWeatherData, 'metric');

      expect(prompt).toContain('°C');
      expect(prompt).not.toContain('°F');
    });

    it('should use imperial temperature symbols when format is imperial', () => {
      const prompt = buildOutfitPrompt(defaultUserPrefs, completeWeatherData, 'imperial');

      expect(prompt).toContain('°F');
      expect(prompt).not.toContain('°C');
    });

    it('should include user style preference', () => {
      const prompt = buildOutfitPrompt(defaultUserPrefs, completeWeatherData, 'imperial');

      expect(prompt).toContain('neutral');
    });

    it('should include user activity', () => {
      const prompt = buildOutfitPrompt(defaultUserPrefs, completeWeatherData, 'imperial');

      expect(prompt).toContain('going to the office');
    });

    it('should include JSON format instructions', () => {
      const prompt = buildOutfitPrompt(defaultUserPrefs, completeWeatherData, 'imperial');

      expect(prompt).toContain('Required JSON format:');
      expect(prompt).toContain('"items"');
      expect(prompt).toContain('"overallDescription"');
      expect(prompt).toContain('"warmCoatRecommended"');
      expect(prompt).toContain('"rainGearRecommended"');
    });
  });

  describe('Wind Data', () => {
    it('should include wind speed', () => {
      const prompt = buildOutfitPrompt(defaultUserPrefs, completeWeatherData, 'imperial');

      expect(prompt).toContain('Wind Speed: 10 mph');
    });

    it('should include wind gust when available', () => {
      const prompt = buildOutfitPrompt(defaultUserPrefs, completeWeatherData, 'imperial');

      expect(prompt).toContain('Wind Gust: 15 mph');
    });

    it('should not include wind gust when undefined', () => {
      const weatherData = createMockWeatherData({
        wind: { speed: 10 },
      });

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain('Wind Speed: 10 mph');
      expect(prompt).not.toContain('Wind Gust');
    });

    it('should use m/s for wind speed in metric', () => {
      const prompt = buildOutfitPrompt(defaultUserPrefs, completeWeatherData, 'metric');

      expect(prompt).toContain('Wind Speed: 10 m/s');
    });
  });

  describe('User Preferences - Style', () => {
    it('should handle masculine style', () => {
      const userPrefs: UserPreferences = {
        style: 'masculine',
        activity: 'casual outing',
      };

      const prompt = buildOutfitPrompt(userPrefs, completeWeatherData, 'imperial');

      expect(prompt).toContain('masculine');
    });

    it('should handle feminine style', () => {
      const userPrefs: UserPreferences = {
        style: 'feminine',
        activity: 'casual outing',
      };

      const prompt = buildOutfitPrompt(userPrefs, completeWeatherData, 'imperial');

      expect(prompt).toContain('feminine');
    });

    it('should handle neutral style', () => {
      const userPrefs: UserPreferences = {
        style: 'neutral',
        activity: 'casual outing',
      };

      const prompt = buildOutfitPrompt(userPrefs, completeWeatherData, 'imperial');

      expect(prompt).toContain('neutral');
    });

    it('should default to neutral when style is null', () => {
      const userPrefs: UserPreferences = {
        style: null,
        activity: 'casual outing',
      };

      const prompt = buildOutfitPrompt(userPrefs, completeWeatherData, 'imperial');

      expect(prompt).toContain('neutral');
    });
  });

  describe('User Preferences - Activity', () => {
    it('should include specific activity when provided', () => {
      const userPrefs: UserPreferences = {
        style: 'neutral',
        activity: 'hiking in the mountains',
      };

      const prompt = buildOutfitPrompt(userPrefs, completeWeatherData, 'imperial');

      expect(prompt).toContain('hiking in the mountains');
    });

    it('should use default activity text when activity is empty string', () => {
      const userPrefs: UserPreferences = {
        style: 'neutral',
        activity: '',
      };

      const prompt = buildOutfitPrompt(userPrefs, completeWeatherData, 'imperial');

      expect(prompt).toContain('general daily activities');
    });

    it('should handle long activity descriptions', () => {
      const userPrefs: UserPreferences = {
        style: 'neutral',
        activity: 'attending a formal business conference with outdoor networking sessions',
      };

      const prompt = buildOutfitPrompt(userPrefs, completeWeatherData, 'imperial');

      expect(prompt).toContain('attending a formal business conference with outdoor networking sessions');
    });
  });

  describe('Temperature Rounding', () => {
    it('should round current temperature to nearest integer', () => {
      const weatherData = createMockWeatherData({
        temp: {
          current: 72.7,
          feels_like: 68.3,
          min: 60,
          max: 75,
        },
      });

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain('Current Temperature: 73°F');
      expect(prompt).toContain('Feels like: 68°F');
    });

    it('should round high and low temperatures to nearest integer', () => {
      const weatherData = createMockWeatherData({
        temp: {
          current: 72,
          feels_like: 68,
          min: 60.2,
          max: 75.8,
        },
      });

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain("Today's High: 76°F");
      expect(prompt).toContain("Today's Low: 60°F");
    });
  });

  describe('Precipitation', () => {
    it('should handle zero pop (0% chance of rain)', () => {
      const weatherData = createMockWeatherData({ pop: 0 });

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain('Chance of Rain: 0%');
    });

    it('should round pop to nearest percent', () => {
      const weatherData = createMockWeatherData({ pop: 0.456 });

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain('Chance of Rain: 46%');
    });

    it('should handle 100% chance of rain', () => {
      const weatherData = createMockWeatherData({ pop: 1.0 });

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain('Chance of Rain: 100%');
    });
  });

  describe('Prompt Structure', () => {
    it('should include time of day', () => {
      const prompt = buildOutfitPrompt(defaultUserPrefs, completeWeatherData, 'imperial');

      expect(prompt).toContain('Time of day:');
    });

    it('should include weather conditions section', () => {
      const prompt = buildOutfitPrompt(defaultUserPrefs, completeWeatherData, 'imperial');

      expect(prompt).toContain('WEATHER CONDITIONS:');
    });

    it('should include user preferences section', () => {
      const prompt = buildOutfitPrompt(defaultUserPrefs, completeWeatherData, 'imperial');

      expect(prompt).toContain('USER PREFERENCES:');
    });

    it('should include JSON format requirements', () => {
      const prompt = buildOutfitPrompt(defaultUserPrefs, completeWeatherData, 'imperial');

      expect(prompt).toContain('IMPORTANT: You MUST respond with ONLY valid JSON');
      expect(prompt).toContain('Required JSON format:');
    });

    it('should include item schema with name, description, and blurb', () => {
      const prompt = buildOutfitPrompt(defaultUserPrefs, completeWeatherData, 'imperial');

      expect(prompt).toContain('"name"');
      expect(prompt).toContain('"description"');
      expect(prompt).toContain('"blurb"');
    });

    it('should return a non-empty string', () => {
      const prompt = buildOutfitPrompt(defaultUserPrefs, completeWeatherData, 'imperial');

      expect(prompt).toBeTruthy();
      expect(prompt.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative temperatures', () => {
      const weatherData = createMockWeatherData({
        temp: {
          current: -5,
          feels_like: -10,
          min: -15,
          max: 0,
        },
      });

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain('Current Temperature: -5°F');
      expect(prompt).toContain('Feels like: -10°F');
    });

    it('should handle very high temperatures', () => {
      const weatherData = createMockWeatherData({
        temp: {
          current: 110,
          feels_like: 115,
          min: 95,
          max: 115,
        },
      });

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain('Current Temperature: 110°F');
      expect(prompt).toContain("Today's High: 115°F");
    });

    it('should handle special characters in activity', () => {
      const userPrefs: UserPreferences = {
        style: 'neutral',
        activity: "going to a friend's birthday party @ 6pm",
      };

      const prompt = buildOutfitPrompt(userPrefs, completeWeatherData, 'imperial');

      expect(prompt).toContain("going to a friend's birthday party @ 6pm");
    });

    it('should include location name when available', () => {
      const weatherData = createMockWeatherData({ name: 'San Francisco' });

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain('Location: San Francisco');
    });
  });
});
