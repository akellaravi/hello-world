import * as Calendar from 'expo-calendar';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { ReligiousEvent } from '@/types/events';
import { computeReminderTime } from '@/utils/time';

const CALENDAR_NAME = 'Sunrise Sadhana';

const ensurePermissionsAsync = async () => {
  const calendarPermission = await Calendar.requestCalendarPermissionsAsync();
  if (calendarPermission.status !== 'granted') {
    throw new Error('Calendar permission not granted');
  }

  const reminderPermission = await Calendar.requestRemindersPermissionsAsync();
  if (reminderPermission.status !== 'granted') {
    throw new Error('Reminder permission not granted');
  }

  if (Platform.OS === 'android') {
    const notificationPermission = await Notifications.requestPermissionsAsync();
    if (notificationPermission.status !== 'granted') {
      throw new Error('Notification permission not granted');
    }
  }
};

const ensureCalendarAsync = async (): Promise<string> => {
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const existingCalendar = calendars.find((calendar) => calendar.title === CALENDAR_NAME);

  if (existingCalendar) {
    return existingCalendar.id;
  }

  const defaultCalendarSource = await Calendar.getDefaultCalendarAsync();

  const newCalendarId = await Calendar.createCalendarAsync({
    title: CALENDAR_NAME,
    color: '#ff9800',
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: defaultCalendarSource.sourceId,
    source: defaultCalendarSource.source,
    name: CALENDAR_NAME,
    ownerAccount: defaultCalendarSource.ownerAccount,
    accessLevel: Calendar.CalendarAccessLevel.OWNER
  });

  return newCalendarId;
};

export const createEventWithReminderAsync = async (event: ReligiousEvent) => {
  await ensurePermissionsAsync();
  const calendarId = await ensureCalendarAsync();

  const eventId = await Calendar.createEventAsync(calendarId, {
    title: event.title,
    startDate: new Date(event.startDateTime),
    endDate: new Date(event.endDateTime),
    location: event.location,
    notes: event.description,
    alarms: [
      {
        relativeOffset: -(event.reminderMinutesBefore ?? 30)
      }
    ]
  });

  if (Platform.OS === 'android') {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: event.title,
        body: event.description ?? 'Upcoming spiritual event',
        sound: 'default'
      },
      trigger: {
        date: new Date(computeReminderTime(event.startDateTime, event.reminderMinutesBefore ?? 30))
      }
    });
  }

  return eventId;
};

export const removeEventAsync = async (eventId: string) => {
  await ensurePermissionsAsync();
  await Calendar.deleteEventAsync(eventId);
};
