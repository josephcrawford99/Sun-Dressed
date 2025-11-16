import { buildOutfitPrompt, UserPreferences } from '@/utils/prompt-generator';
import { WeatherData, TempFormat } from '@/services/openweathermap-service';

describe('buildOutfitPrompt', () => {
  // Mock weather data with all fields present
  const completeWeatherData: WeatherData = {
    lat: 40.7128,
    lon: -74.006,
    timezone: 'America/New_York',
    current: {
      dt: 1699000000,
      temp: 72,
      feels_like: 68,
      humidity: 65,
      uvi: 5,
      wind_speed: 10,
      weather: [
        {
          id: 800,
          main: 'Clear',
          description: 'clear sky',
          icon: '01d',
        },
      ],
    },
    daily: [
      {
        dt: 1699000000,
        sunrise: 1698998000,
        sunset: 1699038000,
        temp: {
          min: 60,
          max: 75,
          day: 70,
          night: 62,
          eve: 68,
          morn: 61,
        },
        feels_like: {
          day: 68,
          night: 60,
          eve: 66,
          morn: 59,
        },
        humidity: 65,
        wind_speed: 10,
        weather: [
          {
            id: 800,
            main: 'Clear',
            description: 'clear sky',
            icon: '01d',
          },
        ],
        pop: 0.3,
        uvi: 6,
      },
    ],
  };

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
      expect(prompt).toContain('UV Index: 6');
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

  describe('Missing Weather Data - Current Temperature', () => {
    it('should handle missing current temperature', () => {
      const weatherData: WeatherData = {
        ...completeWeatherData,
        current: {
          ...completeWeatherData.current,
          temp: undefined as any,
        },
      };

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain('Current Temperature: N/A');
    });

    it('should handle missing feels_like temperature', () => {
      const weatherData: WeatherData = {
        ...completeWeatherData,
        current: {
          ...completeWeatherData.current,
          feels_like: undefined as any,
        },
      };

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain('Feels like: N/A');
    });

    it('should handle missing entire current object', () => {
      const weatherData: WeatherData = {
        ...completeWeatherData,
        current: undefined as any,
      };

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain('Current Temperature: N/A');
      expect(prompt).toContain('Feels like: N/A');
    });
  });

  describe('Missing Weather Data - Daily Forecast', () => {
    it('should handle missing daily forecast', () => {
      const weatherData: WeatherData = {
        ...completeWeatherData,
        daily: undefined as any,
      };

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain("Today's High: N/A");
      expect(prompt).toContain("Today's Low: N/A");
      expect(prompt).toContain('Chance of Rain: 0%');
    });

    it('should handle empty daily forecast array', () => {
      const weatherData: WeatherData = {
        ...completeWeatherData,
        daily: [],
      };

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain("Today's High: N/A");
      expect(prompt).toContain("Today's Low: N/A");
      expect(prompt).toContain('Chance of Rain: 0%');
    });

    it('should handle missing temp.max in daily forecast', () => {
      const weatherData: WeatherData = {
        ...completeWeatherData,
        daily: [
          {
            ...completeWeatherData.daily[0],
            temp: {
              ...completeWeatherData.daily[0].temp,
              max: undefined as any,
            },
          },
        ],
      };

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain("Today's High: N/A");
    });

    it('should handle missing temp.min in daily forecast', () => {
      const weatherData: WeatherData = {
        ...completeWeatherData,
        daily: [
          {
            ...completeWeatherData.daily[0],
            temp: {
              ...completeWeatherData.daily[0].temp,
              min: undefined as any,
            },
          },
        ],
      };

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain("Today's Low: N/A");
    });

    it('should handle missing temp object in daily forecast', () => {
      const weatherData: WeatherData = {
        ...completeWeatherData,
        daily: [
          {
            ...completeWeatherData.daily[0],
            temp: undefined as any,
          },
        ],
      };

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain("Today's High: N/A");
      expect(prompt).toContain("Today's Low: N/A");
    });
  });

  describe('Missing Weather Data - Precipitation', () => {
    it('should handle missing pop (probability of precipitation)', () => {
      const weatherData: WeatherData = {
        ...completeWeatherData,
        daily: [
          {
            ...completeWeatherData.daily[0],
            pop: undefined as any,
          },
        ],
      };

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain('Chance of Rain: 0%');
    });

    it('should handle zero pop (0% chance of rain)', () => {
      const weatherData: WeatherData = {
        ...completeWeatherData,
        daily: [
          {
            ...completeWeatherData.daily[0],
            pop: 0,
          },
        ],
      };

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain('Chance of Rain: 0%');
    });

    it('should round pop to nearest percent', () => {
      const weatherData: WeatherData = {
        ...completeWeatherData,
        daily: [
          {
            ...completeWeatherData.daily[0],
            pop: 0.456,
          },
        ],
      };

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain('Chance of Rain: 46%');
    });

    it('should handle 100% chance of rain', () => {
      const weatherData: WeatherData = {
        ...completeWeatherData,
        daily: [
          {
            ...completeWeatherData.daily[0],
            pop: 1.0,
          },
        ],
      };

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain('Chance of Rain: 100%');
    });
  });

  describe('Missing Weather Data - UV Index', () => {
    it('should use daily UV index when available', () => {
      const prompt = buildOutfitPrompt(defaultUserPrefs, completeWeatherData, 'imperial');

      expect(prompt).toContain('UV Index: 6');
    });

    it('should fall back to current UV index when daily is missing', () => {
      const weatherData: WeatherData = {
        ...completeWeatherData,
        daily: [
          {
            ...completeWeatherData.daily[0],
            uvi: undefined as any,
          },
        ],
      };

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain('UV Index: 5');
    });

    it('should default to 0 when both UV indices are missing', () => {
      const weatherData: WeatherData = {
        ...completeWeatherData,
        current: {
          ...completeWeatherData.current,
          uvi: undefined as any,
        },
        daily: [
          {
            ...completeWeatherData.daily[0],
            uvi: undefined as any,
          },
        ],
      };

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain('UV Index: 0');
    });
  });

  describe('Missing Weather Data - Description', () => {
    it('should handle missing weather description', () => {
      const weatherData: WeatherData = {
        ...completeWeatherData,
        current: {
          ...completeWeatherData.current,
          weather: undefined as any,
        },
      };

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain('Conditions: unknown conditions');
    });

    it('should handle empty weather array', () => {
      const weatherData: WeatherData = {
        ...completeWeatherData,
        current: {
          ...completeWeatherData.current,
          weather: [],
        },
      };

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain('Conditions: unknown conditions');
    });

    it('should use weather description when available', () => {
      const weatherData: WeatherData = {
        ...completeWeatherData,
        current: {
          ...completeWeatherData.current,
          weather: [
            {
              id: 500,
              main: 'Rain',
              description: 'light rain',
              icon: '10d',
            },
          ],
        },
      };

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain('Conditions: light rain');
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
      const weatherData: WeatherData = {
        ...completeWeatherData,
        current: {
          ...completeWeatherData.current,
          temp: 72.7,
          feels_like: 68.3,
        },
      };

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain('Current Temperature: 73°F');
      expect(prompt).toContain('Feels like: 68°F');
    });

    it('should round high and low temperatures to nearest integer', () => {
      const weatherData: WeatherData = {
        ...completeWeatherData,
        daily: [
          {
            ...completeWeatherData.daily[0],
            temp: {
              ...completeWeatherData.daily[0].temp,
              max: 75.8,
              min: 60.2,
            },
          },
        ],
      };

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain("Today's High: 76°F");
      expect(prompt).toContain("Today's Low: 60°F");
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
      const weatherData: WeatherData = {
        ...completeWeatherData,
        current: {
          ...completeWeatherData.current,
          temp: -5,
          feels_like: -10,
        },
      };

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain('Current Temperature: -5°F');
      expect(prompt).toContain('Feels like: -10°F');
    });

    it('should handle very high temperatures', () => {
      const weatherData: WeatherData = {
        ...completeWeatherData,
        current: {
          ...completeWeatherData.current,
          temp: 110,
        },
        daily: [
          {
            ...completeWeatherData.daily[0],
            temp: {
              ...completeWeatherData.daily[0].temp,
              max: 115,
            },
          },
        ],
      };

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

    it('should handle all weather data missing', () => {
      const weatherData: WeatherData = {
        lat: 0,
        lon: 0,
        timezone: 'UTC',
        current: {} as any,
        daily: [],
      };

      const prompt = buildOutfitPrompt(defaultUserPrefs, weatherData, 'imperial');

      expect(prompt).toContain('Current Temperature: N/A');
      expect(prompt).toContain('Feels like: N/A');
      expect(prompt).toContain("Today's High: N/A");
      expect(prompt).toContain("Today's Low: N/A");
      expect(prompt).toContain('Chance of Rain: 0%');
      expect(prompt).toContain('UV Index: 0');
      expect(prompt).toContain('Conditions: unknown conditions');
    });
  });
});
