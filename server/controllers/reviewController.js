import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';
import { invalidateCache } from '../middlewares/cache.js';

// Add review (only for customers who bought the product)
const addReview = async (req, res) => {
  try {
    const { productId, orderId, customerName, customerEmail, rating, reviewText } = req.body;

    // Verify the order exists and contains this product
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if customer email matches order email
    if (order.customer.email !== customerEmail) {
      return res.status(403).json({ message: 'You can only review products you purchased' });
    }

    // Check if product exists in the order
    const productInOrder = order.items.some(item => item.productId.toString() === productId);
    if (!productInOrder) {
      return res.status(403).json({ message: 'You can only review products you purchased' });
    }

    // Check if customer already reviewed this product
    const existingReview = await Review.findOne({ productId, orderId, customerEmail });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = new Review({
      productId,
      orderId,
      customerName,
      customerEmail,
      rating,
      reviewText,
      isVerifiedPurchase: true
    });

    await review.save();

    // Update product average rating
    const updatedStats = await updateProductRating(productId);

    // Invalidate product cache so shop page shows updated rating immediately
    invalidateCache('/api/products');
    invalidateCache('/api/home');

    res.status(201).json({ 
      message: 'Review added successfully', 
      review,
      productStats: updatedStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
};

// Get reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ 
      productId, 
      status: 'approved' 
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const totalReviews = await Review.countDocuments({ productId, status: 'approved' });
    
    // Get rating distribution
    const ratingStats = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId), status: 'approved' } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    const avgRating = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId), status: 'approved' } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    console.log('Get reviews - Total reviews:', totalReviews, 'Avg rating:', avgRating[0]?.avgRating); // Debug

    res.json({
      reviews,
      totalReviews,
      currentPage: page,
      totalPages: Math.ceil(totalReviews / limit),
      ratingStats,
      averageRating: avgRating[0]?.avgRating || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// Check if customer can review product
const canReviewProduct = async (req, res) => {
  try {
    const { productId, customerEmail } = req.query;

    // Find orders by this customer that contain this product
    const orders = await Order.find({ 
      'customer.email': customerEmail,
      'items.productId': productId
      // Allow reviews for any order, regardless of status
    });

    if (orders.length === 0) {
      return res.json({ canReview: false, message: 'You must purchase this product to review it' });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ productId, customerEmail });
    if (existingReview) {
      return res.json({ canReview: false, message: 'You have already reviewed this product' });
    }

    // Get customer name from the order
    const customerName = `${orders[0].customer.firstName || ''} ${orders[0].customer.lastName || ''}`.trim() || 'Customer';

    res.json({ 
      canReview: true, 
      orderId: orders[0]._id,
      customerName: customerName,
      message: 'You can review this product' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking review eligibility', error: error.message });
  }
};

// Mark review as helpful
const markHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review marked as helpful', helpful: review.helpful });
  } catch (error) {
    res.status(500).json({ message: 'Error marking review as helpful', error: error.message });
  }
};

// Helper function to update product average rating
const updateProductRating = async (productId) => {
  try {
    console.log('Updating product rating for:', productId);
    
    // Convert string to ObjectId if needed
    const objectId = typeof productId === 'string' ? new mongoose.Types.ObjectId(productId) : productId;
    
    const stats = await Review.aggregate([
      { $match: { productId: objectId, status: 'approved' } },
      { 
        $group: { 
          _id: null, 
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        } 
      }
    ]);

    console.log('Review stats:', stats);

    if (stats.length > 0) {
      const avgRating = stats[0].avgRating;
      const totalReviews = stats[0].totalReviews;
      
      const updateResult = await Product.findByIdAndUpdate(productId, {
        averageRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
        totalReviews: totalReviews,
        rating: Math.round(avgRating), // Also update old rating field for compatibility
        reviews: totalReviews // Also update old reviews field for compatibility
      }, { new: true });
      
      console.log('Product updated:', {
        averageRating: updateResult?.averageRating,
        totalReviews: updateResult?.totalReviews,
        rating: updateResult?.rating,
        reviews: updateResult?.reviews
      });
      
      return {
        averageRating: updateResult?.averageRating || 0,
        totalReviews: updateResult?.totalReviews || 0
      };
    } else {
      console.log('No approved reviews found for product');
      // Reset to zero if no reviews
      const updateResult = await Product.findByIdAndUpdate(productId, {
        averageRating: 0,
        totalReviews: 0,
        rating: 0,
        reviews: 0
      }, { new: true });
      
      return {
        averageRating: 0,
        totalReviews: 0
      };
    }
  } catch (error) {
    console.error('Error updating product rating:', error);
    return {
      averageRating: 0,
      totalReviews: 0
    };
  }
};

export {
  addReview,
  getProductReviews,
  canReviewProduct,
  markHelpful
};