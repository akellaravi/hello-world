export interface SunEvent {
  sunrise: string;
  sunset: string;
  solarNoon: string;
  dayLength: number;
  civilTwilightBegin: string;
  civilTwilightEnd: string;
}

export interface ReligiousEvent {
  id: string;
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  location?: string;
  tradition: string;
  reminderMinutesBefore?: number;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}
