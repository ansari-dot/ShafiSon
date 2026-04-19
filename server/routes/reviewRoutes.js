import express from 'express';
import {
  addReview,
  getProductReviews,
  canReviewProduct,
  markHelpful
} from '../controllers/reviewController.js';

const router = express.Router();

// Add a new review
router.post('/', addReview);

// Get reviews for a product
router.get('/product/:productId', getProductReviews);

// Check if customer can review product
router.get('/can-review', canReviewProduct);

// Mark review as helpful
router.put('/:reviewId/helpful', markHelpful);

export default router;