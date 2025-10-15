import * as Calendar from 'expo-calendar';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { createEventWithReminderAsync, removeEventAsync } from '@/services/calendar';
import { computeReminderTime } from '@/utils/time';

jest.mock('expo-calendar', () => ({
  requestCalendarPermissionsAsync: jest.fn(),
  requestRemindersPermissionsAsync: jest.fn(),
  getCalendarsAsync: jest.fn(),
  getDefaultCalendarAsync: jest.fn(),
  createCalendarAsync: jest.fn(),
  createEventAsync: jest.fn(),
  deleteEventAsync: jest.fn(),
  EntityTypes: { EVENT: 'event' },
  CalendarAccessLevel: { OWNER: 'owner' }
}));

jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn()
}));

jest.mock('react-native', () => ({
  Platform: { OS: 'ios', select: jest.fn(() => ({})) }
}));

describe('calendar service', () => {
  const baseEvent = {
    id: '1',
    title: 'Morning Meditation',
    startDateTime: '2024-05-01T06:00:00.000Z',
    endDateTime: '2024-05-01T07:00:00.000Z',
    reminderMinutesBefore: 45,
    description: 'Centering practice',
    location: 'Home',
    tradition: 'Hindu'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (Calendar.requestCalendarPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Calendar.requestRemindersPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Calendar.getDefaultCalendarAsync as jest.Mock).mockResolvedValue({
      sourceId: 'source-id',
      source: {},
      ownerAccount: 'user@example.com'
    });
    (Calendar.createCalendarAsync as jest.Mock).mockResolvedValue('new-calendar');
    (Calendar.createEventAsync as jest.Mock).mockResolvedValue('event-id');
  });

  it('creates event and schedules android notification', async () => {
    (Calendar.getCalendarsAsync as jest.Mock).mockResolvedValue([]);
    Platform.OS = 'android';

    const eventId = await createEventWithReminderAsync(baseEvent);

    expect(Calendar.createCalendarAsync).toHaveBeenCalled();
    expect(Calendar.createEventAsync).toHaveBeenCalledWith('new-calendar', expect.objectContaining({
      title: baseEvent.title,
      location: baseEvent.location,
      notes: baseEvent.description
    }));
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
      content: expect.objectContaining({ title: baseEvent.title }),
      trigger: {
        date: new Date(computeReminderTime(baseEvent.startDateTime, baseEvent.reminderMinutesBefore!))
      }
    });
    expect(eventId).toBe('event-id');
  });

  it('reuses existing calendar when available and skips android notification on iOS', async () => {
    (Calendar.getCalendarsAsync as jest.Mock).mockResolvedValue([{ id: 'existing', title: 'Sunrise Sadhana' }]);
    Platform.OS = 'ios';

    await createEventWithReminderAsync(baseEvent);

    expect(Calendar.createCalendarAsync).not.toHaveBeenCalled();
    expect(Calendar.createEventAsync).toHaveBeenCalledWith('existing', expect.any(Object));
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('throws when calendar permission denied', async () => {
    (Calendar.requestCalendarPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });

    await expect(createEventWithReminderAsync(baseEvent)).rejects.toThrow('Calendar permission not granted');
  });

  it('removes events after ensuring permissions', async () => {
    (Calendar.getCalendarsAsync as jest.Mock).mockResolvedValue([{ id: 'existing', title: 'Sunrise Sadhana' }]);

    await removeEventAsync('event-id');

    expect(Calendar.requestCalendarPermissionsAsync).toHaveBeenCalled();
    expect(Calendar.deleteEventAsync).toHaveBeenCalledWith('event-id');
  });
});
