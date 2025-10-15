import { act, renderHook, waitFor } from '@testing-library/react-native';
import * as Location from 'expo-location';
import { fetchSunEvents } from '@/services/sunriseSunset';
import { fetchReligiousEvents } from '@/services/vignanam';
import { getTimezone } from '@/utils/time';
import { useSunEvents } from '@/hooks/useSunEvents';

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn()
}));

jest.mock('@/services/sunriseSunset');
jest.mock('@/services/vignanam');
jest.mock('@/utils/time');

describe('useSunEvents', () => {
  const coordinates = { latitude: 10, longitude: 20 };
  const sunEvent = {
    sunrise: '2024-05-01T05:30:00Z',
    sunset: '2024-05-01T18:45:00Z',
    solarNoon: '2024-05-01T12:05:00Z',
    dayLength: 43200,
    civilTwilightBegin: '2024-05-01T05:00:00Z',
    civilTwilightEnd: '2024-05-01T19:15:00Z'
  };
  const events = [
    {
      id: '1',
      title: 'Festival',
      startDateTime: '2024-05-01T06:00:00Z',
      endDateTime: '2024-05-01T07:00:00Z',
      reminderMinutesBefore: 60
    }
  ];

  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetAllMocks();
    (getTimezone as jest.Mock).mockReturnValue('Asia/Kolkata');
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({ coords: coordinates });
    (fetchSunEvents as jest.Mock).mockResolvedValue(sunEvent);
    (fetchReligiousEvents as jest.Mock).mockResolvedValue(events);
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('loads sun events and religious events', async () => {
    const { result } = renderHook(() => useSunEvents());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeUndefined();
    expect(result.current.location).toEqual(coordinates);
    expect(result.current.sunEvent).toEqual(sunEvent);
    expect(result.current.events).toEqual(events);
    expect(result.current.timezone).toBe('Asia/Kolkata');
  });

  it('exposes a refresh function that reloads data', async () => {
    const { result } = renderHook(() => useSunEvents());
    await waitFor(() => expect(result.current.loading).toBe(false));

    (fetchSunEvents as jest.Mock).mockResolvedValueOnce({ ...sunEvent, sunrise: '2024-05-02T05:20:00Z' });

    await act(async () => {
      await result.current.refresh();
    });

    expect(fetchSunEvents).toHaveBeenCalledTimes(2);
    expect(result.current.sunEvent?.sunrise).toBe('2024-05-02T05:20:00Z');
  });

  it('sets error state when permissions are denied', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValueOnce({ status: 'denied' });

    const { result } = renderHook(() => useSunEvents());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Location permission not granted');
    expect(result.current.sunEvent).toBeUndefined();
  });

  it('captures service errors', async () => {
    (fetchSunEvents as jest.Mock).mockRejectedValueOnce(new Error('API down'));

    const { result } = renderHook(() => useSunEvents());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('API down');
    expect(result.current.sunEvent).toBeUndefined();
  });
});
