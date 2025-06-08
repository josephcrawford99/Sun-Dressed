import axios from 'axios';
import { Outfit } from '../types/Outfit';
import { Weather } from '../types/weather';
import { geminiRateLimiter } from './rateLimiter';

export const generateOutfitLLM = async (weather?: Weather, activity?: string): Promise<Outfit> => {
  console.log('🔄 Starting outfit generation...');
  console.log('📊 Input params:', { weather, activity });
  
  await geminiRateLimiter.checkRateLimit();
  console.log('✅ Rate limit check passed');
  
  const weatherDescription = weather 
    ? `${weather.condition} weather with high of ${weather.dailyHighTemp}°F, low of ${weather.dailyLowTemp}°F, feels like ${weather.feelsLikeTemp}°F, ${weather.highestChanceOfRain}% chance of rain, wind at ${weather.windiness}mph, ${weather.sunniness}% sunny`
    : 'any weather';
  
  const prompt = `Generate a clothing outfit recommendation for ${weatherDescription} and ${activity || 'daily activities'}. Return only a JSON object with: top, bottom, outerwear (array), accessories (array), shoes.`;
  
  console.log('📝 Generated prompt:', prompt);
  
  const requestPayload = {
    contents: [{ parts: [{ text: prompt }] }]
  };
  
  console.log('🚀 Sending API request to Gemini...');
  console.log('📦 Request payload:', JSON.stringify(requestPayload, null, 2));

  try {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_GEMINI_API_URL}?key=${process.env.EXPO_PUBLIC_GEMINI_API_KEY}`,
      requestPayload,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000 // 10 second timeout
      }
    );
    
    console.log('✅ API response received');
    console.log('📨 Full response:', JSON.stringify(response.data, null, 2));
    
    if (!response.data.candidates || !response.data.candidates[0]) {
      throw new Error('No candidates in API response');
    }
    
    const rawText = response.data.candidates[0].content.parts[0].text;
    console.log('🔤 Raw text from API:', rawText);
    
    // Clean the text before parsing - remove markdown code blocks if present
    const cleanedText = rawText.replace(/```json\s*|\s*```/g, '').trim();
    console.log('🧹 Cleaned text for parsing:', cleanedText);
    
    try {
      const parsedOutfit = JSON.parse(cleanedText);
      console.log('👕 Parsed outfit:', parsedOutfit);
      return parsedOutfit;
    } catch (parseError) {
      console.error('❌ JSON parsing failed:', parseError);
      console.error('🔤 Failed to parse text:', cleanedText);
      throw new Error(`Failed to parse outfit JSON: ${parseError}`);
    }
  } catch (error) {
    console.error('❌ Error in outfit generation:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.log('🔍 Error response:', error.response);
      console.error('📨 Error response data:', error.response.data);
      console.error('📊 Error response status:', error.response.status);
    }
    throw error;
  }
};