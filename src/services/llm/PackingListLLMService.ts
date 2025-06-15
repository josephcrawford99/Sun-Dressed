import { LLMApiClient } from './LLMApiClient';
import { Weather } from '../../types/weather';
import { StylePreference } from '../../types/settings';

export class PackingListLLMService {
  private llmClient: LLMApiClient;

  constructor() {
    this.llmClient = new LLMApiClient();
  }

  async generatePackingList(
    location: string,
    startDate: Date,
    endDate: Date,
    weatherData?: Weather[],
    stylePreference?: StylePreference
  ): Promise<string[]> {
    const prompt = this.buildPackingListPrompt(
      location,
      startDate,
      endDate,
      weatherData,
      stylePreference
    );

    const rawResponse = await this.llmClient.makeRequest(prompt);
    const parsedList = this.llmClient.parseJsonResponse<string[]>(rawResponse);
    
    return Array.isArray(parsedList) ? parsedList : [];
  }

  private buildPackingListPrompt(
    location: string,
    startDate: Date,
    endDate: Date,
    weatherData?: Weather[],
    stylePreference?: StylePreference
  ): string {
    const tripDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const weatherDescription = weatherData && weatherData.length > 0
      ? `Weather forecast: ${weatherData.map(w => 
          `${w.condition}, high ${w.dailyHighTemp}°F, low ${w.dailyLowTemp}°F`
        ).join('; ')}`
      : 'no specific weather data available';
    
    const styleInstruction = stylePreference && stylePreference !== 'neutral'
      ? ` Focus on ${stylePreference} style clothing options.`
      : '';
    
    return `Generate a packing list for a ${tripDays}-day trip to ${location} from ${startDate.toDateString()} to ${endDate.toDateString()}. ${weatherDescription}.${styleInstruction} Return only a JSON array of clothing items needed, like ["item1", "item2", "item3"].`;
  }
}