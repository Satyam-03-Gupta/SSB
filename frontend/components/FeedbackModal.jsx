import React, { useState } from 'react';
import './FeedbackModal.css';

const FeedbackModal = ({ isOpen, onClose, orderData, onFeedbackSubmitted }) => {
  const [ratings, setRatings] = useState({
    food: 0,
    delivery: 0,
    website: 0
  });
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !orderData) return null;

  const handleRatingClick = (category, rating) => {
    setRatings(prev => ({ ...prev, [category]: rating }));
  };

  const handleSubmit = async () => {
    if (ratings.food === 0 || ratings.delivery === 0 || ratings.website === 0) {
      alert('Please rate all categories');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:3001/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.orderId,
          userEmail: orderData.userEmail,
          ratings,
          comment,
          orderDate: orderData.orderDate
        })
      });

      if (response.ok) {
        alert('Thank you for your feedback!');
        if (onFeedbackSubmitted) {
          onFeedbackSubmitted(orderData._id);
        }
        onClose();
      } else {
        alert('Failed to submit feedback');
      }
    } catch (error) {
      alert('Error submitting feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ category, rating, onRate }) => (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={`star ${star <= rating ? 'filled' : ''}`}
          onClick={() => onRate(category, star)}
        >
          ★
        </span>
      ))}
    </div>
  );

  return (
    <div className="feedback-modal-overlay">
      <div className="feedback-modal">
        <div className="feedback-header">
          <h2>🍽️ How was your experience?</h2>
          <p>Order #{orderData.orderId} delivered successfully!</p>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="feedback-body">
          <div className="rating-section">
            <div className="rating-item">
              <label>Food Quality</label>
              <StarRating 
                category="food" 
                rating={ratings.food} 
                onRate={handleRatingClick} 
              />
            </div>
            
            <div className="rating-item">
              <label>Delivery Service</label>
              <StarRating 
                category="delivery" 
                rating={ratings.delivery} 
                onRate={handleRatingClick} 
              />
            </div>
            
            <div className="rating-item">
              <label>Website Experience</label>
              <StarRating 
                category="website" 
                rating={ratings.website} 
                onRate={handleRatingClick} 
              />
            </div>
          </div>

          <div className="comment-section">
            <label>Additional Comments (Optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us more about your experience..."
              rows={4}
            />
          </div>
        </div>

        <div className="feedback-footer">
          <button className="skip-btn" onClick={onClose}>
            Skip for now
          </button>
          <button 
            className="submit-btn" 
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;