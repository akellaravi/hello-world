const Calendar = {
  requestCalendarPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  requestRemindersPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  getCalendarsAsync: jest.fn(async () => []),
  getDefaultCalendarAsync: jest.fn(async () => ({
    sourceId: 'default-source',
    source: {},
    ownerAccount: 'owner@example.com'
  })),
  createCalendarAsync: jest.fn(async () => 'calendar-id'),
  createEventAsync: jest.fn(async () => 'event-id'),
  deleteEventAsync: jest.fn(async () => undefined),
  EntityTypes: { EVENT: 'event' },
  CalendarAccessLevel: { OWNER: 'owner' }
};

module.exports = Calendar;
