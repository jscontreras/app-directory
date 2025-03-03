import { createLogger } from 'winston';
import WinstonNewrelicLogsTransport from 'winston-newrelic-logs-transport';
export const serverLogger = createLogger({
  transports: [
    new WinstonNewrelicLogsTransport({
      licenseKey: process.env.NEW_RELIC_LICENSE_KEY || '',
      apiUrl: process.env.NEW_RELIC_API_URL || '',
    }),
  ],
});
