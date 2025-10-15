# Sunrise Sadhana

A cross-platform (Android & iOS) Expo / React Native application that surfaces daily sunrise & sunset times, fetches Indian religious observances from [Vignanam.org](https://www.vignanam.org), and lets devotees create calendar reminders with alarms.

## Features

- 🌅 **Automatic sunrise/sunset** lookup using the user's GPS coordinates (with permission prompts).
- 🗓️ **Religious calendar integration** powered by Vignanam.org (with local fallback data for offline testing).
- 🔔 **Calendar events + notifications** created directly in the device calendar with configurable reminder offsets.
- 🎨 **Material 3 UI** via React Native Paper and Safe Area handling.
- ♿ **Permissions aware** for Location, Calendar, Reminders, Notifications.

## Project structure

```
├── App.tsx
├── app.json
├── assets/
│   ├── sampleEvents.json      # bundled fallback data
│   └── (no bundled binaries)
├── src/
│   ├── components/
│   │   ├── EventList.tsx
│   │   └── SunCard.tsx
│   ├── hooks/
│   │   └── useSunEvents.ts
│   ├── screens/
│   │   └── HomeScreen.tsx
│   ├── services/
│   │   ├── calendar.ts
│   │   ├── sunriseSunset.ts
│   │   └── vignanam.ts
│   ├── theme/
│   │   ├── colors.ts
│   │   └── theme.ts
│   ├── types/
│   │   └── events.ts
│   └── utils/
│       └── time.ts
├── package.json
├── tsconfig.json
└── babel.config.js
```

## Getting started

### 1. Install prerequisites

Make sure you have the following on your machine:

- [Node.js 18+](https://nodejs.org/en/download) (ships with `npm`)
- Expo tooling (`npx` will download on demand, but installing globally speeds things up)
- Optional: Android Studio (for an Android emulator) and Xcode (for an iOS simulator)

Install the project dependencies:

```bash
npm install --global expo-cli   # optional; enables the `expo` binary
npm install                     # install app dependencies listed in package.json
```

### 2. Run the development server

Start Metro (the React Native bundler) from the project root:

```bash
npx expo start
```

The command prints a QR code. Choose one of the following:

- **Physical device:** Install the [Expo Go](https://expo.dev/client) app, scan the QR code, and wait for the bundle to load.
- **Android emulator:** Launch an Android Virtual Device, then press `a` in the terminal to install and run the app.
- **iOS simulator (macOS only):** Make sure an iOS simulator is open, then press `i` to run the app.

When the app launches it will ask for **Location**, **Calendar**, **Reminder**, and **Notification** permissions. Accepting them enables sunrise lookups and calendar reminders.

### 3. Environment variables (optional)

For production you may wish to proxy or cache Vignanam data. Create a `.env` and inject the URL via [`expo-constants`](https://docs.expo.dev/versions/latest/sdk/constants/) if necessary. Right now the app hits `https://www.vignanam.org/wp-json/wp/v2/events` directly and gracefully falls back to bundled events when blocked.

## Fetching and curating Vignanam data

The site does not expose a documented API. The helper in [`src/services/vignanam.ts`](src/services/vignanam.ts) queries the WordPress `wp-json` endpoint and normalises fields. In restricted networks you can pre-generate JSON using a Node script and serve from your own endpoint. Replace `VIGNANAM_API` accordingly or hydrate `assets/sampleEvents.json` with updated entries.

> ⚠️ When running inside the OpenAI execution environment, outbound requests to Vignanam.org may be blocked (403). This is expected; on-device the request succeeds. Always test on physical hardware/emulators connected to the public internet.

## Calendar permissions & alarms

- **Android 13+** requires `SCHEDULE_EXACT_ALARM`. Expo automatically handles the manifest via `app.json`.
- The helper `createEventWithReminderAsync` creates a dedicated "Sunrise Sadhana" calendar, adds an alarm (relative offset in minutes), and schedules a push notification (Android only in this example).
- Modify `reminderMinutesBefore` on each event to tune reminders.

## Publishing workflow

### Google Play Store

1. Configure [EAS Build](https://docs.expo.dev/build/introduction/) with your Expo account and project ID.
2. Run `eas build -p android --profile production` to generate an AAB package.
3. Upload to the Google Play Console, configure store listing, privacy policy, and content rating.
4. Add location/calendar/alarms permission justifications in the console.

### Apple App Store

1. Configure `bundleIdentifier` in `app.json` and register the app in App Store Connect.
2. Run `eas build -p ios --profile production` (requires an Apple Developer account & credentials).
3. Use Transporter or EAS Submit to upload the build.
4. Provide permission usage descriptions in `app.json` (Expo automatically maps to `Info.plist`).

## Next steps

- Add user preferences for specific traditions/regions.
- Persist favourite observances and custom reminders.
- Provide widgets and complications for quick glance information.
- Translate the UI for Telugu/Hindi audiences in line with Vignanam content.

Happy building! ☀️📿
