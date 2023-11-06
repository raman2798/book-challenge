const { OK } = require('http-status');
const { v4 } = require('uuid');
const {
  appConfiguration: { appVersion },
} = require('../config');

module.exports = (payload) => {
  const { message = '', statusCode = OK, result = {} } = payload;

  return {
    error: message ? { message } : {},
    ets: Date.now(),
    resmsgid: `${v4()}`,
    result,
    statusCode,
    version: appVersion,
  };
};
