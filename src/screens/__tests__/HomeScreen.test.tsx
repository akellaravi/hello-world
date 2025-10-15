import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import HomeScreen from '@/screens/HomeScreen';
import { useSunEvents } from '@/hooks/useSunEvents';

jest.mock('@/hooks/useSunEvents');

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider>{children}</PaperProvider>
);

describe('HomeScreen', () => {
  const baseState = {
    loading: false,
    error: undefined,
    sunEvent: {
      sunrise: '2024-05-01T05:30:00Z',
      sunset: '2024-05-01T18:45:00Z',
      solarNoon: '2024-05-01T12:05:00Z',
      dayLength: 43200,
      civilTwilightBegin: '2024-05-01T05:00:00Z',
      civilTwilightEnd: '2024-05-01T19:15:00Z'
    },
    events: [],
    timezone: 'UTC',
    refresh: jest.fn()
  };

  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    (useSunEvents as jest.Mock).mockReturnValue(baseState);
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders loading indicator when loading', () => {
    (useSunEvents as jest.Mock).mockReturnValue({ ...baseState, loading: true });

    const { getByTestId } = render(<HomeScreen />, { wrapper });

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders error state with retry button', () => {
    const refresh = jest.fn();
    (useSunEvents as jest.Mock).mockReturnValue({ ...baseState, error: 'Oops', refresh });

    const { getByText } = render(<HomeScreen />, { wrapper });

    expect(getByText('Oops')).toBeTruthy();
    fireEvent.press(getByText('Retry'));
    expect(refresh).toHaveBeenCalled();
  });

  it('renders sun card and event list when data loaded', () => {
    const { getByText } = render(<HomeScreen />, { wrapper });

    expect(getByText('Sunrise Sadhana')).toBeTruthy();
    expect(getByText('Upcoming Events')).toBeTruthy();
  });
});
