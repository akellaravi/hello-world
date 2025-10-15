# Vignanam data ingestion

The production app relies on the WordPress JSON endpoints published by https://www.vignanam.org. When the upstream service is unreachable you can materialise observances offline and ship them with the client or host them on your own CDN.

## Quickstart script

Create `scripts/fetch-vignanam.ts` with the following snippet and run it using `npx ts-node` or compile with `tsc`:

```ts
import axios from 'axios';
import fs from 'node:fs/promises';

const API_URL = 'https://www.vignanam.org/wp-json/wp/v2/events';

async function fetchMonth(month: number, year: number) {
  const response = await axios.get(API_URL, {
    params: {
      per_page: 100,
      monthnum: month,
      year
    },
    headers: {
      'User-Agent': 'SunriseSadhanaBot/0.1 (+https://yourdomain.example)'
    }
  });

  const events = response.data.map((event: any) => ({
    id: event.id,
    title: event.title?.rendered,
    description: event.meta?.description,
    startDateTime: event.acf?.start_time,
    endDateTime: event.acf?.end_time,
    location: event.acf?.location,
    tradition: event.acf?.tradition ?? 'Hindu',
    reminderMinutesBefore: event.acf?.reminder_minutes_before ?? 120
  }));

  await fs.writeFile(`assets/vignanam-${year}-${month}.json`, JSON.stringify(events, null, 2));
}

fetchMonth(9, 2024).catch(console.error);
```

Replace the month/year arguments or loop through the year. Afterwards, update `assets/sampleEvents.json` or host the generated JSON and point `VIGNANAM_API` to your endpoint.
