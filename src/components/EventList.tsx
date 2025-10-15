import React from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import type { ReligiousEvent } from '@/types/events';
import { formatDateTime } from '@/utils/time';
import { createEventWithReminderAsync } from '@/services/calendar';

interface Props {
  events: ReligiousEvent[];
  timezone: string;
}

const EventList: React.FC<Props> = ({ events, timezone }) => {
  const handleAddToCalendar = async (event: ReligiousEvent) => {
    try {
      await createEventWithReminderAsync(event);
      Alert.alert('Success', 'Event added to calendar successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Permission required', 'Unable to create calendar event. Please check permissions.');
    }
  };

  const renderItem = ({ item }: { item: ReligiousEvent }) => (
    <Card style={styles.card}>
      <Card.Title title={item.title} subtitle={item.tradition} />
      <Card.Content>
        <Text variant="bodyMedium">{formatDateTime(item.startDateTime, timezone)}</Text>
        {item.description ? <Text variant="bodySmall">{item.description}</Text> : null}
        {item.location ? <Text variant="bodySmall">Location: {item.location}</Text> : null}
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => handleAddToCalendar(item)}>Add to calendar</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <FlatList
      data={events}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text>No events available for this month.</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16
  },
  emptyState: {
    padding: 16,
    alignItems: 'center'
  }
});

export default EventList;
