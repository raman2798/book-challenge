const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message({
      custom: `"{#label}" must be a valid id`,
    });
  }

  return value;
};

module.exports = { objectId };
