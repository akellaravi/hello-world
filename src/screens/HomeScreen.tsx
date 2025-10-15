import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import SunCard from '@/components/SunCard';
import EventList from '@/components/EventList';
import { useSunEvents } from '@/hooks/useSunEvents';

const HomeScreen: React.FC = () => {
  const { loading, error, sunEvent, events, timezone, refresh } = useSunEvents();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Sunrise Sadhana
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Track your daily sun times and upcoming religious observances.
      </Text>

      {loading ? <ActivityIndicator testID="loading-indicator" style={styles.loader} size="large" /> : null}
      {error ? (
        <View style={styles.errorContainer}>
          <Text variant="bodyMedium" style={styles.errorText}>
            {error}
          </Text>
          <Button mode="outlined" onPress={refresh}>
            Retry
          </Button>
        </View>
      ) : null}

      <SunCard sunEvent={sunEvent} timezone={timezone} onRefresh={refresh} />
      <Text variant="titleLarge" style={styles.sectionTitle}>
        Upcoming Events
      </Text>
      <EventList events={events} timezone={timezone} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f7f4ed'
  },
  title: {
    marginBottom: 4,
    textAlign: 'center'
  },
  subtitle: {
    marginBottom: 16,
    textAlign: 'center'
  },
  loader: {
    marginVertical: 16
  },
  errorContainer: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fdecea'
  },
  errorText: {
    marginBottom: 8
  },
  sectionTitle: {
    marginBottom: 8,
    marginTop: 16
  }
});

export default HomeScreen;
