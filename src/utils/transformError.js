const { BAD_REQUEST } = require('http-status');
const { get, isString } = require('lodash');

module.exports = (error) => {
  let err;
  let statusCode;

  // Use optional chaining to safely access the 'message' property.
  if (get(error, 'response.data')) {
    err = {
      message: get(error, 'response.data.message'),
    };

    statusCode = get(error, 'response.status', BAD_REQUEST);
  } else if (get(error, 'message')) {
    err = error;

    statusCode = get(error, 'statusCode', BAD_REQUEST);
  } else {
    err = new Error(JSON.stringify(error));

    statusCode = get(error, 'statusCode', BAD_REQUEST);
  }

  return {
    statusCode,
    message: isString(err.message) ? err.message : JSON.stringify(err.message),
  };
};
