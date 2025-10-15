const Notifications = {
  requestPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  scheduleNotificationAsync: jest.fn(async () => undefined)
};

module.exports = Notifications;
