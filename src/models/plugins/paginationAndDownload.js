/* eslint-disable no-param-reassign */
const { NOT_FOUND } = require('http-status');
const { concat, defaultTo, floor, get, isEmpty, isEqual, map, size, startCase, toLower, toNumber } = require('lodash');

const isEmptyCheck = (results, modelName) => {
  if (isEmpty(results)) {
    throw { statusCode: NOT_FOUND, message: `No data found in ${startCase(toLower(modelName))}` };
  }
};

const paginationAndDownload = (schema) => {
  schema.statics.paginationAndDownload = async function (options, query = {}) {
    const model = this;

    // Default to isDownload of false if not provided
    const isDownload = get(options, 'isDownload', false);

    // Default to limit of 10 if not provided
    const limit = defaultTo(floor(toNumber(get(options, 'limit', 10))), 10);

    // Default to page 1 if not provided
    const page = defaultTo(floor(toNumber(get(options, 'page', 1))), 1);

    // Calculate the skip value based on the page and limit
    const skip = (page - 1) * limit;

    // Include specific fields
    const includedFields = map(get(options, 'includedFields', []), (field) => `+${field}`);

    // Exclude specific fields
    const excludedFields = map(get(options, 'excludedFields', []), (field) => `-${field}`);

    // Concatenate both include and exclude fields
    const selectedFields = concat(includedFields, excludedFields);

    // Populate
    const populateFields = get(options, 'populateFields', []);

    const count = await model.countDocuments({ ...query, deletedAt: null });

    const totalPages = Math.ceil(count / limit);

    let resultsQuery = model
      .find({ ...query, deletedAt: null })
      .select(selectedFields)
      .populate(populateFields);

    if (isDownload) {
      const results = await resultsQuery;

      isEmptyCheck(results, model.modelName);

      return {
        data: results,
        totalResults: count,
      };
    }
    resultsQuery = resultsQuery.skip(skip).limit(limit);

    const results = await resultsQuery;

    isEmptyCheck(results, model.modelName);

    const data = isEqual(size(results), 1) ? results[0] : results;

    return {
      data,
      page,
      limit,
      totalPages,
      totalResults: count,
    };
  };
};

module.exports = paginationAndDownload;
