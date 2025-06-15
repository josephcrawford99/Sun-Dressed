import { Weather } from '@/types/weather';
import { OpenWeatherOneCallResponse } from './WeatherApiClient';

export type WeatherCondition = Weather['condition'];

export class WeatherTransformer {
  private conditionMap: Record<string, WeatherCondition> = {
    'clear': 'sunny',
    'rain': 'rainy',
    'drizzle': 'rainy',
    'thunderstorm': 'stormy',
    'snow': 'snowy',
    'mist': 'foggy',
    'fog': 'foggy',
    'haze': 'foggy',
  };

  transformCurrentWeather(data: OpenWeatherOneCallResponse): Weather {
    const current = data.current;
    const today = data.daily[0];
    
    const condition = this.getWeatherCondition(
      current.weather[0]?.main,
      today.clouds
    );
    
    const sunniness = Math.max(0, 100 - today.clouds);

    return {
      dailyHighTemp: Math.round(today.temp.max),
      dailyLowTemp: Math.round(today.temp.min),
      highestChanceOfRain: Math.round(today.pop * 100),
      windiness: Math.round(current.wind_speed),
      sunniness,
      feelsLikeTemp: Math.round(current.feels_like),
      humidity: current.humidity,
      uvIndex: Math.round(current.uvi),
      condition,
      icon: current.weather[0]?.icon
    };
  }

  transformForecast(data: OpenWeatherOneCallResponse, days: number): Weather[] {
    const forecasts: Weather[] = [];
    const dailyForecasts = data.daily.slice(0, days);
    
    dailyForecasts.forEach((dailyData, index) => {
      const current = index === 0 ? data.current : null;
      const weatherCondition = dailyData.weather?.[0] || current?.weather?.[0];
      
      const condition = this.getWeatherCondition(
        weatherCondition?.main,
        dailyData.clouds
      );
      
      const sunniness = Math.max(0, 100 - (dailyData.clouds || 0));

      forecasts.push({
        dailyHighTemp: Math.round(dailyData.temp.max),
        dailyLowTemp: Math.round(dailyData.temp.min),
        highestChanceOfRain: Math.round(dailyData.pop * 100),
        windiness: Math.round(dailyData.wind_speed || current?.wind_speed || 0),
        sunniness,
        feelsLikeTemp: Math.round(dailyData.feels_like.day || current?.feels_like || dailyData.temp.day),
        humidity: dailyData.humidity || current?.humidity || 0,
        uvIndex: Math.round(dailyData.uvi || current?.uvi || 0),
        condition,
        icon: weatherCondition?.icon
      });
    });
    
    return forecasts;
  }

  private getWeatherCondition(
    mainCondition?: string,
    cloudiness?: number
  ): WeatherCondition {
    const condition = mainCondition?.toLowerCase() || 'unknown';
    
    // Check direct mapping first
    if (this.conditionMap[condition]) {
      return this.conditionMap[condition];
    }
    
    // Special case for clouds based on cloudiness percentage
    if (condition === 'clouds') {
      return cloudiness && cloudiness > 70 ? 'cloudy' : 'partly-cloudy';
    }
    
    // Default fallback
    return 'partly-cloudy';
  }
}