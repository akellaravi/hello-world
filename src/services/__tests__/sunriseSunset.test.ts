import axios from 'axios';
import { fetchSunEvents } from '@/services/sunriseSunset';

jest.mock('axios');

describe('fetchSunEvents', () => {
  const coordinates = { latitude: 12.34, longitude: 56.78 };

  it('requests sunrise and sunset data with default date', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        status: 'OK',
        results: {
          sunrise: '2024-05-01T05:30:00+00:00',
          sunset: '2024-05-01T18:45:00+00:00',
          solar_noon: '2024-05-01T12:05:00+00:00',
          day_length: '48000',
          civil_twilight_begin: '2024-05-01T05:00:00+00:00',
          civil_twilight_end: '2024-05-01T19:15:00+00:00'
        }
      }
    });

    const result = await fetchSunEvents(coordinates);

    expect(axios.get).toHaveBeenCalledWith(expect.any(String), {
      params: expect.objectContaining({
        lat: coordinates.latitude,
        lng: coordinates.longitude,
        date: 'today',
        formatted: 0
      })
    });

    expect(result).toEqual({
      sunrise: '2024-05-01T05:30:00+00:00',
      sunset: '2024-05-01T18:45:00+00:00',
      solarNoon: '2024-05-01T12:05:00+00:00',
      dayLength: 48000,
      civilTwilightBegin: '2024-05-01T05:00:00+00:00',
      civilTwilightEnd: '2024-05-01T19:15:00+00:00'
    });
  });

  it('throws when API responds with non-OK status', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        status: 'INVALID_REQUEST',
        results: {}
      }
    });

    await expect(fetchSunEvents(coordinates)).rejects.toThrow('Failed to fetch sun events: INVALID_REQUEST');
  });
});
