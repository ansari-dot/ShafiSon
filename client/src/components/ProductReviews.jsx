import { useState, useEffect } from 'react';
import { apiGet, apiPost, apiPut } from '../util/api';

const StarRating = ({ rating, size = 16, interactive = false, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hoverRating || rating) ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
          style={{ fontSize: `${size}px`, cursor: interactive ? 'pointer' : 'default' }}
          onClick={() => handleClick(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const ReviewModal = ({ isOpen, onClose, productId, customerEmail, customerName, orderId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || !reviewText.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await apiPost('/api/reviews', {
        productId,
        orderId,
        customerName,
        customerEmail,
        rating,
        reviewText: reviewText.trim()
      });
      
      setRating(0);
      setReviewText('');
      onReviewAdded(response);
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal" onClick={(e) => e.stopPropagation()}>
        <div className="review-modal-header">
          <h3>Write a Review</h3>
          <button className="review-modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="review-modal-form">
          <div className="review-modal-rating">
            <label>Your Rating *</label>
            <StarRating rating={rating} size={32} interactive onRatingChange={setRating} />
            <span className="rating-text">
              {rating === 0 ? 'Select a rating' : 
               rating === 1 ? 'Poor' :
               rating === 2 ? 'Fair' :
               rating === 3 ? 'Good' :
               rating === 4 ? 'Very Good' : 'Excellent'}
            </span>
          </div>
          
          <div className="review-modal-text">
            <label>Your Review *</label>
            <textarea
              placeholder="Share your experience with this product..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              maxLength="1000"
              rows="5"
              required
            />
            <div className="char-count">{reviewText.length}/1000 characters</div>
          </div>
          
          <div className="review-modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={isSubmitting || rating === 0 || !reviewText.trim()}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ReviewItem = ({ review }) => {
  const [helpful, setHelpful] = useState(review.helpful || 0);
  const [hasMarkedHelpful, setHasMarkedHelpful] = useState(false);

  const handleMarkHelpful = async () => {
    if (hasMarkedHelpful) return;
    
    try {
      const response = await apiPut(`/api/reviews/${review._id}/helpful`);
      setHelpful(response.helpful);
      setHasMarkedHelpful(true);
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="review-card">
      <div className="review-card-header">
        <div className="reviewer-avatar">
          {review.customerName.charAt(0).toUpperCase()}
        </div>
        <div className="reviewer-info">
          <div className="reviewer-name">
            {review.customerName}
            {review.isVerifiedPurchase && (
              <span className="verified-badge">✓ Verified Purchase</span>
            )}
          </div>
          <div className="review-meta">
            <StarRating rating={review.rating} size={14} />
            <span className="review-date">{formatDate(review.createdAt)}</span>
          </div>
        </div>
      </div>
      
      <div className="review-content">
        <p>{review.reviewText}</p>
      </div>
      
      <div className="review-actions">
        <button 
          className={`helpful-btn ${hasMarkedHelpful ? 'marked' : ''}`}
          onClick={handleMarkHelpful}
          disabled={hasMarkedHelpful}
        >
          <span className="helpful-icon">👍</span>
          Helpful ({helpful})
        </button>
      </div>
    </div>
  );
};

const ProductReviews = ({ productId, onProductUpdate }) => {
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [canReview, setCanReview] = useState(false);
  const [reviewEligibility, setReviewEligibility] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      const data = await apiGet(`/api/reviews/product/${productId}?page=1&limit=20`);
      console.log('Loaded reviews data:', data); // Debug
      setReviews(data.reviews);
      setReviewStats({
        totalReviews: data.totalReviews,
        averageRating: data.averageRating,
        ratingStats: data.ratingStats
      });
      
      // Also update parent component with current stats
      if (onProductUpdate) {
        onProductUpdate({
          averageRating: data.averageRating || 0,
          totalReviews: data.totalReviews || 0
        });
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkReviewEligibility = async () => {
    if (!customerEmail) return;
    
    setCheckingEligibility(true);
    try {
      const data = await apiGet(`/api/reviews/can-review?productId=${productId}&customerEmail=${customerEmail}`);
      setCanReview(data.canReview);
      setReviewEligibility(data);
      
      if (data.canReview) {
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error checking review eligibility:', error);
    } finally {
      setCheckingEligibility(false);
    }
  };

  const handleReviewAdded = (response) => {
    console.log('Review added response:', response); // Debug
    setCanReview(false);
    setReviewEligibility(null);
    setCustomerEmail('');
    loadReviews();
    
    if (onProductUpdate && response.productStats) {
      console.log('Updating product stats:', response.productStats); // Debug
      onProductUpdate(response.productStats);
    }
  };

  if (loading) {
    return <div className="reviews-loading">Loading reviews...</div>;
  }

  return (
    <div className="product-reviews-modern">
      <div className="reviews-header">
        <div className="reviews-summary">
          <h3>Customer Reviews</h3>
          {reviewStats && reviewStats.totalReviews > 0 && (
            <div className="rating-summary">
              <div className="rating-score">
                <span className="score-number">{reviewStats.averageRating.toFixed(1)}</span>
                <div className="score-stars">
                  <StarRating rating={Math.round(reviewStats.averageRating)} size={20} />
                  <span className="score-text">({reviewStats.totalReviews} reviews)</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="add-review-section">
          <div className="email-check">
            <input
              type="email"
              placeholder="Enter your email to write a review"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="email-input"
            />
            <button 
              className="add-review-btn"
              onClick={checkReviewEligibility}
              disabled={!customerEmail || checkingEligibility}
            >
              {checkingEligibility ? 'Checking...' : 'Add Review'}
            </button>
          </div>
          
          {reviewEligibility && !canReview && (
            <div className="eligibility-message error">
              {reviewEligibility.message}
            </div>
          )}
        </div>
      </div>

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <div className="no-reviews-icon">💬</div>
            <h4>No reviews yet</h4>
            <p>Be the first to share your experience with this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewItem key={review._id} review={review} />
          ))
        )}
      </div>

      <ReviewModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        productId={productId}
        customerEmail={customerEmail}
        customerName={reviewEligibility?.customerName || 'Customer'}
        orderId={reviewEligibility?.orderId}
        onReviewAdded={handleReviewAdded}
      />
    </div>
  );
};

export default ProductReviews;