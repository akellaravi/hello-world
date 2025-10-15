import axios from 'axios';
import { Platform } from 'react-native';
import type { ReligiousEvent } from '@/types/events';
import sampleEvents from '../../assets/sampleEvents.json';

export interface VignanamEventOptions {
  month: number;
  year: number;
  language?: 'en' | 'te' | 'hi';
  tradition?: string;
}

interface VignanamApiEvent {
  id: number | string;
  title: { rendered: string } | string;
  acf?: {
    start_time?: string;
    end_time?: string;
    location?: string;
    tradition?: string;
    reminder_minutes_before?: number;
  };
  meta?: Record<string, unknown>;
}

const VIGNANAM_API = 'https://www.vignanam.org/wp-json/wp/v2/events';

const normalizeEvent = (event: VignanamApiEvent): ReligiousEvent | null => {
  const title = typeof event.title === 'string' ? event.title : event.title?.rendered;
  const start = event.acf?.start_time ?? (event.meta?.start_time as string | undefined);
  const end = event.acf?.end_time ?? (event.meta?.end_time as string | undefined);

  if (!title || !start || !end) {
    return null;
  }

  return {
    id: String(event.id),
    title: title.replace(/(<([^>]+)>)/gi, ''),
    description: event.meta?.description as string | undefined,
    startDateTime: start,
    endDateTime: end,
    location: event.acf?.location as string | undefined,
    tradition: (event.acf?.tradition as string | undefined) ?? 'Hindu',
    reminderMinutesBefore:
      typeof event.acf?.reminder_minutes_before === 'number'
        ? event.acf?.reminder_minutes_before
        : 120
  };
};

export const fetchReligiousEvents = async (
  options: VignanamEventOptions
): Promise<ReligiousEvent[]> => {
  try {
    const response = await axios.get<VignanamApiEvent[]>(VIGNANAM_API, {
      params: {
        per_page: 100,
        monthnum: options.month,
        year: options.year,
        lang: options.language ?? 'en'
      },
      headers: Platform.select({
        web: undefined,
        default: {
          'User-Agent': 'SunriseSadhana/0.1 (https://github.com/)'
        }
      })
    });

    const events = response.data
      .map((event) => normalizeEvent(event))
      .filter((event): event is ReligiousEvent => Boolean(event));

    if (options.tradition) {
      return events.filter((event) => event.tradition?.toLowerCase() === options.tradition?.toLowerCase());
    }

    return events;
  } catch (error) {
    console.warn('Falling back to bundled events due to fetch error', error);
    return sampleEvents as ReligiousEvent[];
  }
};
