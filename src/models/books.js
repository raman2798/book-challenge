const { model, Schema } = require('mongoose');
const { paginationAndDownload, toJSON } = require('./plugins');

const bookSchema = Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// add plugin pagination and download
bookSchema.plugin(paginationAndDownload);

// add plugin that converts mongoose to json
bookSchema.plugin(toJSON);

/**
 * Check if title is taken
 * @param {string} title - title
 * @param {ObjectId} [excludeId] - The id of the book to be excluded
 * @returns {Promise<boolean>}
 */
bookSchema.statics.isTitleTaken = async function (title, excludeId) {
  const book = await this.findOne({ title, _id: { $ne: excludeId } });

  return !!book;
};

/**
 * Soft delete by id
 * @param {ObjectId} id - id
 * @returns {Promise<Book>}
 */
bookSchema.statics.softDelete = async function (id) {
  const now = new Date();

  const result = await this.findByIdAndUpdate(id, { deletedAt: now });

  return {
    data: result._doc,
    page: 1,
    limit: 1,
    totalPages: 1,
    totalResults: 1,
  };
};

module.exports = model('books', bookSchema);
