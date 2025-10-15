import React from 'react';
import { Card, Text, Button } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import type { SunEvent } from '@/types/events';
import { formatTime } from '@/utils/time';

interface Props {
  sunEvent?: SunEvent;
  timezone: string;
  onRefresh: () => void;
}

const SunCard: React.FC<Props> = ({ sunEvent, timezone, onRefresh }) => (
  <Card style={styles.card}>
    <Card.Title title="Sunrise & Sunset" subtitle={timezone} />
    <Card.Content>
      {sunEvent ? (
        <View>
          <Text variant="titleMedium">Sunrise: {formatTime(sunEvent.sunrise, timezone)}</Text>
          <Text variant="titleMedium">Sunset: {formatTime(sunEvent.sunset, timezone)}</Text>
          <Text variant="bodyMedium">Solar noon: {formatTime(sunEvent.solarNoon, timezone)}</Text>
          <Text variant="bodyMedium">
            Civil twilight: {formatTime(sunEvent.civilTwilightBegin, timezone)} →{' '}
            {formatTime(sunEvent.civilTwilightEnd, timezone)}
          </Text>
        </View>
      ) : (
        <Text variant="bodyMedium">Sun data unavailable.</Text>
      )}
    </Card.Content>
    <Card.Actions>
      <Button onPress={onRefresh}>Refresh</Button>
    </Card.Actions>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    marginBottom: 16
  }
});

export default SunCard;
