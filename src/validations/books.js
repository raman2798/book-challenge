const Joi = require('joi');
const { merge } = require('lodash');
const { objectId } = require('./custom');

const mongodbObjectId = Joi.custom(objectId);

const baseSchema = {
  title: Joi.string(),
  author: Joi.string(),
  summary: Joi.string(),
};

const create = {
  body: Joi.object().keys(
    merge({}, baseSchema, {
      title: baseSchema.title.required(),
      author: baseSchema.author.required(),
      summary: baseSchema.summary.required(),
    }),
  ),
};

const deleteById = {
  params: Joi.object().keys({
    bookId: mongodbObjectId.required(),
  }),
};

const readById = {
  params: Joi.object().keys({
    bookId: mongodbObjectId.required(),
  }),
};

const updateById = {
  body: Joi.object().keys(baseSchema),
  params: Joi.object().keys({
    bookId: mongodbObjectId.required(),
  }),
};

module.exports = {
  create,
  deleteById,
  readById,
  updateById,
};
