const dotenv = require('dotenv');
const Joi = require('joi');
const { get, isEqual, map } = require('lodash');
const path = require('path');

// Load environment variables from .env file
const envFilePath = path.join(__dirname, '../../.env');

dotenv.config({ path: envFilePath });

// Define the schema for the environment variables
const envVarsSchema = Joi.object({
  APP_VERSION: Joi.string().required().description('Application Version'),
  LOG_FILE_DAY: Joi.string().description('Log file day'),
  LOG_FILE_ENABLE: Joi.string().description('Log file enable'),
  LOG_FILE_NAME: Joi.string().description('Log file name'),
  LOG_FILE_SIZE: Joi.string().description('Log file size'),
  LOG_FILE_ZIP_ARCHIVE: Joi.string().description('Log file zip archive'),
  MONGODB_URL: Joi.string().required().description('Mongo DB url'),
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required().description('Application environment'),
  PORT: Joi.number().default(4000),
}).unknown();

// Validate and extract environment variables
const { value: envVars, error } = envVarsSchema.validate(process.env, {
  errors: { label: 'key' },
});

// Throw an error if validation fails
if (error) {
  const errorMessage = map(get(error, 'details'), 'message').join(', ');

  throw new Error(`Config validation error: ${errorMessage}`);
}

// Build the configuration object
module.exports = {
  appVersion: get(envVars, 'APP_VERSION'),
  env: get(envVars, 'NODE_ENV'),
  log: {
    day: get(envVars, 'LOG_FILE_DAY', '14d'),
    isEnable: isEqual(get(envVars, 'LOG_FILE_ENABLE', 'false'), 'true'),
    name: get(envVars, 'LOG_FILE_NAME', 'book.challenge'),
    size: get(envVars, 'LOG_FILE_SIZE', '20m'),
    zippedArchive: isEqual(get(envVars, 'LOG_FILE_ZIP_ARCHIVE', 'false'), 'true'),
  },
  mongoDB: {
    options: {
      autoIndex: true,
    },
    url: get(envVars, 'MONGODB_URL'),
  },
  port: get(envVars, 'PORT'),
};
