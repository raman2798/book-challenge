const { Router } = require('express');
const { bookController } = require('../controllers');
const { validate } = require('../middlewares');
const { bookValidation } = require('../validations');

const router = Router();

const { create, deleteById, readById, updateById } = bookValidation;

const { createBook, deleteBookById, readAllBook, readBookById, updateBookById } = bookController;

router.post('/', validate(create), createBook);

router.put('/:bookId', validate(updateById), updateBookById);

router.get('/all', readAllBook);

router.get('/:bookId', validate(readById), readBookById);

router.delete('/:bookId', validate(deleteById), deleteBookById);

module.exports = router;
