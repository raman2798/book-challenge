/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const pick = (object, keys) => {
  const pickedObject = {};

  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      pickedObject[`${key}`] = object[`${key}`];
    }
  });

  return pickedObject;
};

module.exports = pick;
