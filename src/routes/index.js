const { Router } = require('express');
const bookRoute = require('./books');

const router = Router();

router.use('/books', bookRoute);

module.exports = router;
