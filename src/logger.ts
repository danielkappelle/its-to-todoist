import * as winston from 'winston';

export const logger = winston.createLogger({
  level: process.env['LOG_DEBUG'] ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});
