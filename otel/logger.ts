import { Logger } from 'winston';
import { NewRelicTransport } from 'winston-nr';

// Sending Logs directly to New Relic
const newRelicTransport = new NewRelicTransport({
  apiUrl: 'https://log-api.newrelic.com/log/v1',
  apiKey: process.env.NEW_RELIC_LICENSE_KEY || '',
  compression: true,
  retries: 3,
  batchSize: 10,
  batchTimeout: 5000,
});

export const serverLogger = new Logger({
  level: 'info',
  defaultMeta: { serviceName: process.env.NEW_RELIC_APP_NAME },
  transports: [newRelicTransport],
});
