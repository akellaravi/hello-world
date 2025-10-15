import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import EventList from '@/components/EventList';
import { createEventWithReminderAsync } from '@/services/calendar';

jest.mock('@/services/calendar');

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider>{children}</PaperProvider>
);

describe('EventList', () => {
  const events = [
    {
      id: '1',
      title: 'Morning Ritual',
      startDateTime: '2024-05-01T06:00:00Z',
      endDateTime: '2024-05-01T07:00:00Z',
      reminderMinutesBefore: 60,
      description: 'Daily meditation',
      tradition: 'Hindu'
    }
  ];

  let alertSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetAllMocks();
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('renders events with formatted dates', () => {
    const { getByText } = render(<EventList events={events} timezone="UTC" />, { wrapper });

    expect(getByText('Morning Ritual')).toBeTruthy();
    expect(getByText('Hindu')).toBeTruthy();
  });

  it('shows empty state when no events available', () => {
    const { getByText } = render(<EventList events={[]} timezone="UTC" />, { wrapper });

    expect(getByText('No events available for this month.')).toBeTruthy();
  });

  it('adds event to calendar on button press', async () => {
    (createEventWithReminderAsync as jest.Mock).mockResolvedValue('event-id');

    const { getByText } = render(<EventList events={events} timezone="UTC" />, { wrapper });

    fireEvent.press(getByText('Add to calendar'));

    await waitFor(() => {
      expect(createEventWithReminderAsync).toHaveBeenCalledWith(events[0]);
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Event added to calendar successfully');
    });
  });

  it('shows error alert when calendar creation fails', async () => {
    (createEventWithReminderAsync as jest.Mock).mockRejectedValue(new Error('denied'));

    const { getByText } = render(<EventList events={events} timezone="UTC" />, { wrapper });

    fireEvent.press(getByText('Add to calendar'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Permission required',
        'Unable to create calendar event. Please check permissions.'
      );
    });
  });
});
