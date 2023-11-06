const { defaultTo, floor, get, isEqual, toNumber } = require('lodash');
const {
  bookService: { create, deleteBook, getAllBooks, getBookById, updateBook },
} = require('../services');
const { transformErrorUtils, transformResponseUtils } = require('../utils');

const createBook = async (req, res, next) => {
  try {
    const { body } = req;

    const book = await create(body);

    res.json(
      transformResponseUtils({
        result: {
          ...book,
        },
      }),
    );
  } catch (error) {
    next(transformErrorUtils(error));
  }
};

const deleteBookById = async (req, res, next) => {
  try {
    const {
      params: { bookId },
    } = req;

    const book = await deleteBook(bookId);

    res.json(
      transformResponseUtils({
        result: {
          ...book,
        },
      }),
    );
  } catch (error) {
    next(transformErrorUtils(error));
  }
};

const readAllBook = async (req, res, next) => {
  try {
    const { query } = req;

    const options = {
      limit: defaultTo(floor(toNumber(get(query, 'limit', 10))), 10),
      page: defaultTo(floor(toNumber(get(query, 'page', 1))), 1),
      isDownload: isEqual(get(query, 'isDownload', false), true),
    };

    const books = await getAllBooks(options);

    res.json(
      transformResponseUtils({
        result: {
          ...books,
        },
      }),
    );
  } catch (error) {
    next(transformErrorUtils(error));
  }
};

const readBookById = async (req, res, next) => {
  try {
    const {
      params: { bookId },
    } = req;

    const book = await getBookById(bookId);

    res.json(
      transformResponseUtils({
        result: {
          ...book,
        },
      }),
    );
  } catch (error) {
    next(transformErrorUtils(error));
  }
};

const updateBookById = async (req, res, next) => {
  try {
    const {
      params: { bookId },
      body,
    } = req;

    const book = await updateBook(bookId, body);

    res.json(
      transformResponseUtils({
        result: {
          ...book,
        },
      }),
    );
  } catch (error) {
    next(transformErrorUtils(error));
  }
};

module.exports = {
  createBook,
  deleteBookById,
  readAllBook,
  readBookById,
  updateBookById,
};
