jest.mock('dayjs', () => {
  const actual = jest.requireActual('dayjs');
  const mockDayjs = jest.fn((...args: Parameters<typeof actual>) => actual(...args));
  mockDayjs.mockImplementation((...args: Parameters<typeof actual>) => actual(...args));
  Object.assign(mockDayjs, actual);
  mockDayjs.extend = actual.extend.bind(actual);
  return mockDayjs;
});

import dayjs from 'dayjs';
import { computeReminderTime, formatDateTime, formatTime, getTimezone } from '@/utils/time';

describe('time utilities', () => {
  const iso = '2024-05-01T06:30:00.000Z';

  it('formats time in provided timezone', () => {
    const result = formatTime(iso, 'America/New_York');
    expect(result).toBe('02:30 AM');
  });

  it('formats time when timezone not provided', () => {
    const result = formatTime(iso);
    expect(result).toBe('06:30 AM');
  });

  it('falls back to default formatting when tz conversion throws', () => {
    const actual = dayjs as unknown as jest.Mock;
    const originalImplementation = actual.getMockImplementation();
    actual.mockImplementationOnce(() => {
      throw new Error('boom');
    });

    const formatted = formatTime(iso, 'America/New_York');
    expect(formatted).toBe('06:30 AM');

    actual.mockImplementation(originalImplementation ?? ((value: string) => dayjs(value)));
  });

  it('formats date time string', () => {
    const result = formatDateTime(iso, 'America/New_York');
    expect(result).toBe('Wed, May 1 2024 • 02:30 AM');
  });

  it('falls back for formatDateTime errors', () => {
    const actual = dayjs as unknown as jest.Mock;
    const originalImplementation = actual.getMockImplementation();
    actual.mockImplementationOnce(() => {
      throw new Error('boom');
    });

    const formatted = formatDateTime(iso, 'America/New_York');
    expect(formatted).toBe('Wed, May 1 2024 • 06:30 AM');

    actual.mockImplementation(originalImplementation ?? ((value: string) => dayjs(value)));
  });

  it('computes reminder time minutes before start', () => {
    const reminder = computeReminderTime(iso, 45);
    expect(reminder).toBe('2024-05-01T05:45:00.000Z');
  });

  it('guesses timezone via dayjs.tz.guess', () => {
    const originalTz = (dayjs as any).tz;
    const guessMock = jest.fn().mockReturnValue('Asia/Kolkata');
    (dayjs as any).tz = { ...(originalTz ?? {}), guess: guessMock };

    expect(getTimezone()).toBe('Asia/Kolkata');
    expect(guessMock).toHaveBeenCalled();

    (dayjs as any).tz = originalTz;
  });
});
