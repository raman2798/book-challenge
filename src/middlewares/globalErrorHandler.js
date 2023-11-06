/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const { get } = require('lodash');
const {
  appConfiguration: { env },
  loggerConfiguration,
} = require('../config');
const { transformResponseUtils } = require('../utils');

// Define the shape of the error response
module.exports = (error, req, res, next) => {
  // Initialize variables statusCode and message with error properties
  let statusCode = get(error, 'statusCode', httpStatus.INTERNAL_SERVER_ERROR);

  let message = get(error, 'message', 'Internal Server Error');

  // Check if the environment is production and if the error is not operational
  if (env === 'production' && !error.isOperational) {
    // If so, set statusCode to INTERNAL_SERVER_ERROR and message to the corresponding HTTP status message
    statusCode = get(httpStatus, 'INTERNAL_SERVER_ERROR');

    message = 'Internal Server Error';
  }

  loggerConfiguration.error('Error:', error);

  // Set the response status code and send the message as response
  res.status(statusCode).json(
    transformResponseUtils({
      statusCode,
      message,
    }),
  );
};
