import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatTime = (isoDate: string, tz?: string): string => {
  try {
    return tz ? dayjs(isoDate).tz(tz).format('hh:mm A') : dayjs(isoDate).format('hh:mm A');
  } catch (error) {
    return dayjs(isoDate).format('hh:mm A');
  }
};

export const formatDateTime = (isoDate: string, tz?: string): string => {
  try {
    return tz
      ? dayjs(isoDate).tz(tz).format('ddd, MMM D YYYY • hh:mm A')
      : dayjs(isoDate).format('ddd, MMM D YYYY • hh:mm A');
  } catch (error) {
    return dayjs(isoDate).format('ddd, MMM D YYYY • hh:mm A');
  }
};

export const computeReminderTime = (isoDate: string, minutesBefore = 30): string =>
  dayjs(isoDate).subtract(minutesBefore, 'minute').toISOString();

export const getTimezone = (): string => dayjs.tz.guess();
