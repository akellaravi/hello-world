import axios from 'axios';
import { Platform } from 'react-native';
import sampleEvents from '../../../assets/sampleEvents.json';
import { fetchReligiousEvents } from '@/services/vignanam';

jest.mock('axios');

describe('fetchReligiousEvents', () => {
  beforeEach(() => {
    jest.spyOn(Platform, 'select').mockImplementation((map: any) => map.default);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('normalizes events returned by the API', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: [
        {
          id: 1,
          title: { rendered: 'Morning Puja' },
          acf: {
            start_time: '2024-05-01T06:00:00Z',
            end_time: '2024-05-01T07:00:00Z',
            tradition: 'Hindu',
            reminder_minutes_before: 90
          },
          meta: {
            description: 'Daily prayer'
          }
        }
      ]
    });

    const events = await fetchReligiousEvents({ month: 5, year: 2024 });

    expect(axios.get).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
      params: expect.objectContaining({
        per_page: 100,
        monthnum: 5,
        year: 2024,
        lang: 'en'
      })
    }));

    expect(events).toEqual([
      {
        id: '1',
        title: 'Morning Puja',
        description: 'Daily prayer',
        startDateTime: '2024-05-01T06:00:00Z',
        endDateTime: '2024-05-01T07:00:00Z',
        location: undefined,
        tradition: 'Hindu',
        reminderMinutesBefore: 90
      }
    ]);
  });

  it('filters events by tradition when specified', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: [
        {
          id: 1,
          title: { rendered: 'Hindu Event' },
          acf: {
            start_time: '2024-05-02T06:00:00Z',
            end_time: '2024-05-02T07:00:00Z',
            tradition: 'Hindu'
          }
        },
        {
          id: 2,
          title: { rendered: 'Buddhist Event' },
          acf: {
            start_time: '2024-05-03T06:00:00Z',
            end_time: '2024-05-03T07:00:00Z',
            tradition: 'Buddhist'
          }
        }
      ]
    });

    const events = await fetchReligiousEvents({ month: 5, year: 2024, tradition: 'Buddhist' });

    expect(events).toHaveLength(1);
    expect(events[0].title).toBe('Buddhist Event');
  });

  it('falls back to bundled sample events on error', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    (axios.get as jest.Mock).mockRejectedValue(new Error('network error'));

    const events = await fetchReligiousEvents({ month: 5, year: 2024 });

    expect(events).toEqual(sampleEvents);
    expect(warnSpy).toHaveBeenCalled();
  });
});
