import '@testing-library/jest-native/extend-expect';

jest.mock('expo-calendar');
jest.mock('expo-notifications');
jest.mock('expo-location');

const originalConsoleError = console.error;

console.error = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) {
    return;
  }

  originalConsoleError(...args);
};
