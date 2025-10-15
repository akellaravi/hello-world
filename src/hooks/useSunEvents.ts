import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import type { ReligiousEvent, SunEvent, LocationCoordinates } from '@/types/events';
import { fetchSunEvents } from '@/services/sunriseSunset';
import { fetchReligiousEvents } from '@/services/vignanam';
import { getTimezone } from '@/utils/time';

interface UseSunEventsResult {
  loading: boolean;
  error?: string;
  location?: LocationCoordinates;
  sunEvent?: SunEvent;
  events: ReligiousEvent[];
  timezone: string;
  refresh: () => Promise<void>;
}

const today = () => new Date();

const getMonthAndYear = (date: Date) => ({
  month: date.getMonth() + 1,
  year: date.getFullYear()
});

export const useSunEvents = (): UseSunEventsResult => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [location, setLocation] = useState<LocationCoordinates | undefined>();
  const [sunEvent, setSunEvent] = useState<SunEvent | undefined>();
  const [events, setEvents] = useState<ReligiousEvent[]>([]);
  const timezone = getTimezone();

  const load = async () => {
    try {
      setLoading(true);
      setError(undefined);

      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        throw new Error('Location permission not granted');
      }

      const locationResult = await Location.getCurrentPositionAsync({});
      const coordinates = {
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude
      };
      setLocation(coordinates);

      const sunData = await fetchSunEvents(coordinates);
      setSunEvent(sunData);

      const current = today();
      const calendarEvents = await fetchReligiousEvents({
        ...getMonthAndYear(current)
      });
      setEvents(calendarEvents);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    error,
    location,
    sunEvent,
    events,
    timezone,
    refresh: load
  };
};
