import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  transports: [new transports.Console({ level: 'debug' })],
  format: format.combine(
    format.colorize(),
    format.splat(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
});

export default logger;