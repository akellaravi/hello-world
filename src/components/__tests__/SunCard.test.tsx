import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import SunCard from '@/components/SunCard';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider>{children}</PaperProvider>
);

describe('SunCard', () => {
  const sunEvent = {
    sunrise: '2024-05-01T05:30:00Z',
    sunset: '2024-05-01T18:45:00Z',
    solarNoon: '2024-05-01T12:05:00Z',
    dayLength: 43200,
    civilTwilightBegin: '2024-05-01T05:00:00Z',
    civilTwilightEnd: '2024-05-01T19:15:00Z'
  };

  it('renders sunrise and sunset times when available', () => {
    const { getByText } = render(
      <SunCard sunEvent={sunEvent} timezone="Asia/Kolkata" onRefresh={jest.fn()} />,
      { wrapper }
    );

    expect(getByText(/Sunrise:/)).toBeTruthy();
    expect(getByText(/Sunset:/)).toBeTruthy();
  });

  it('shows empty state when sun data missing', () => {
    const { getByText } = render(<SunCard timezone="Asia/Kolkata" onRefresh={jest.fn()} />, { wrapper });

    expect(getByText('Sun data unavailable.')).toBeTruthy();
  });

  it('triggers refresh handler on button press', () => {
    const onRefresh = jest.fn();
    const { getByText } = render(
      <SunCard sunEvent={sunEvent} timezone="Asia/Kolkata" onRefresh={onRefresh} />,
      { wrapper }
    );

    fireEvent.press(getByText('Refresh'));
    expect(onRefresh).toHaveBeenCalled();
  });
});
