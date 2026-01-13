/**
 * Weather Service
 * 
 * This module provides functions to fetch real-time weather data using OpenWeather API.
 * Includes in-memory caching to minimize API calls.
 */

export interface WeatherData {
  temp: number;
  condition: string;
  description: string;
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  icon: string;
  cityName: string;
}

// In-memory cache for weather data
const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * Fetch weather data for a city from OpenWeather API
 * @param city - City name (e.g., "Paris", "New York", "Tokyo")
 * @returns Weather data or null if API key is not configured or request fails
 */
export async function getWeatherByCity(city: string): Promise<WeatherData | null> {
  if (!city || city.trim() === '') {
    return null;
  }

  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  
  // Return null if API key is not configured (graceful degradation)
  if (!apiKey) {
    console.warn('OpenWeather API key not configured. Weather features will be unavailable.');
    return null;
  }

  const cacheKey = city.toLowerCase().trim();
  
  // Check cache first
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.error(`City not found: ${city}`);
      } else if (response.status === 401) {
        console.error('Invalid OpenWeather API key');
      } else {
        console.error(`Weather API error: ${response.status}`);
      }
      return null;
    }

    const data = await response.json();
    
    const weatherData: WeatherData = {
      temp: Math.round(data.main.temp),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      high: Math.round(data.main.temp_max),
      low: Math.round(data.main.temp_min),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      icon: data.weather[0].icon,
      cityName: data.name,
    };

    // Cache the result
    weatherCache.set(cacheKey, {
      data: weatherData,
      timestamp: Date.now(),
    });

    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

/**
 * Get weather icon URL from OpenWeather
 * @param iconCode - Icon code from weather data
 * @returns URL to weather icon image
 */
export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

/**
 * Clear the weather cache (useful for testing)
 */
export function clearWeatherCache(): void {
  weatherCache.clear();
}
