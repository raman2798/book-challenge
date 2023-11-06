const { get, isEqual } = require('lodash');
const path = require('path');
const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const {
  appConfiguration: {
    env,
    log: { day, isEnable, name, size, zippedArchive },
  },
} = require('./index');

// Define a function to enumerate error formats
const enumerateErrorFormat = format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: get(info, 'stack') });
  }

  return info;
});

const logLevel = isEqual(env, 'development') ? 'debug' : 'info';

// Define log format for transport
const logFormat = format.combine(
  enumerateErrorFormat(),
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  format.splat(),
  format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`),
);

// Create an empty array for transports
const loggerTransports = [];

// Push the console transport
loggerTransports.push(
  new transports.Console({
    stderrLevels: ['error'],
    format: format.combine(isEqual(env, 'development') ? format.colorize() : format.uncolorize(), logFormat),
  }),
);

// Conditionally push the file transport if isEnable is true
if (isEnable) {
  loggerTransports.push(
    new DailyRotateFile({
      filename: path.join(__dirname, `../../logs/${name}`),
      zippedArchive, // A boolean to define whether or not to gzip archived log files
      maxSize: size, // Adjust the maximum log file size
      maxFiles: day, // Adjust the maximum number of log files to retain
    }),
  );
}

// Create a Winston logger instance
module.exports = createLogger({
  level: logLevel,
  format: logFormat,
  transports: loggerTransports,
});
