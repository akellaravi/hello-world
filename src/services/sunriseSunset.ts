import axios from 'axios';
import type { LocationCoordinates, SunEvent } from '@/types/events';

interface SunriseSunsetApiResponse {
  results: {
    sunrise: string;
    sunset: string;
    solar_noon: string;
    day_length: string;
    civil_twilight_begin: string;
    civil_twilight_end: string;
  };
  status: string;
}

const API_URL = 'https://api.sunrise-sunset.org/json';

export const fetchSunEvents = async (
  coordinates: LocationCoordinates,
  date: string = 'today'
): Promise<SunEvent> => {
  const { latitude, longitude } = coordinates;
  const response = await axios.get<SunriseSunsetApiResponse>(API_URL, {
    params: {
      lat: latitude,
      lng: longitude,
      formatted: 0,
      date
    }
  });

  if (response.data.status !== 'OK') {
    throw new Error(`Failed to fetch sun events: ${response.data.status}`);
  }

  const { results } = response.data;

  return {
    sunrise: results.sunrise,
    sunset: results.sunset,
    solarNoon: results.solar_noon,
    dayLength: Number(results.day_length),
    civilTwilightBegin: results.civil_twilight_begin,
    civilTwilightEnd: results.civil_twilight_end
  };
};
