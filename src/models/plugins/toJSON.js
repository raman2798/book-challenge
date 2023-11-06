const { get, set, unset } = require('lodash');

/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, and any path that has private: true
 *  - replaces _id with id
 */
const toJSON = (schema) => {
  schema.set('toJSON', {
    transform: (doc, ret) => {
      // Remove any paths with private: true
      for (const path in schema.paths) {
        if (Object.prototype.hasOwnProperty.call(schema.paths, path)) {
          if (get(schema.paths, `${path}.options.private`)) {
            unset(ret, path);
          }
        }
      }

      // Remove the __v field
      unset(ret, '__v');

      // Replace _id with id
      set(ret, 'id', get(ret, '_id'));

      unset(ret, '_id');
    },
  });
};

module.exports = toJSON;
