const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/search', bookController.searchBooks);
router.get('/featured', bookController.getFeaturedBooks);
router.get('/genres', bookController.getGenres);
router.get('/:id', bookController.getBookById);

// Protected admin routes
router.post('/', protect, admin, bookController.createBook);
router.put('/:id', protect, admin, bookController.updateBook);
router.delete('/:id', protect, admin, bookController.deleteBook);
router.post('/:id/reviews', protect, bookController.addReview);

module.exports = router;