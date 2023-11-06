const { NOT_FOUND } = require('http-status');
const { assign, get } = require('lodash');
const { BookModel } = require('../models');

/**
 * Create a book
 * @param {Object} createBody
 * @returns {Promise<Book>}
 */
const create = async (createBody) => {
  const title = get(createBody, 'title');

  const isTitleTaken = await BookModel.isTitleTaken(title);

  if (isTitleTaken) {
    throw { message: 'Title already taken' };
  }

  const book = await BookModel.create(createBody);

  return  {
    data: book._doc,
    page: 1,
    limit: 1,
    totalPages: 1,
    totalResults: 1,
  };;
};

/**
 * Get book by id
 * @param {ObjectId} bookId
 * @returns {Promise<Book>}
 */
const getBookById = async (bookId, isUpdate = false) => {
  const book = await BookModel.findOne({ _id: bookId, deletedAt: null });

  if (!book) {
    throw { statusCode: NOT_FOUND, message: 'No data found in Book' };
  }

  return isUpdate
    ? book
    : {
        data: book._doc,
        page: 1,
        limit: 1,
        totalPages: 1,
        totalResults: 1,
      };
};

/**
 * Delete book by bookId
 * @param {ObjectId} bookId
 * @returns {Promise<Book>}
 */
const deleteBook = async (bookId) => {
  await getBookById(bookId);

  const book = await BookModel.softDelete(bookId);

  return book;
};

/**
 * Get all books
 * @param {Object} options
 * @returns {Promise<Book>}
 */
const getAllBooks = async (options) => {
  const books = await BookModel.paginationAndDownload(options);

  return books;
};

/**
 * Update book by bookId
 * @param {ObjectId} bookId
 * @param {Object} updateBody
 * @returns {Promise<Book>}
 */
const updateBook = async (bookId, updateBody) => {
  const book = await getBookById(bookId, true);

  const title = get(updateBody, 'title');

  if (title) {
    const isTitleTaken = await BookModel.isTitleTaken(title, bookId);

    if (title && isTitleTaken) {
      throw { message: 'Title already taken' };
    }
  }

  assign(book, updateBody);

  await book.save();

  return {
    data: book._doc,
    page: 1,
    limit: 1,
    totalPages: 1,
    totalResults: 1,
  };
};

module.exports = {
  create,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
};
