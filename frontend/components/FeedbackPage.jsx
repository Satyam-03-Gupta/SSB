import React, { useState, useEffect } from 'react';
import './FeedbackPage.css';

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
    fetchStats();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/feedback');
      const data = await response.json();
      setFeedbacks(data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/feedback/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <div className="loading">Loading feedback...</div>;

  return (
    <div className="feedback-page">
      <div className="feedback-header">
        <h1>Customer Feedback</h1>
        <p>Real reviews from our valued customers</p>
      </div>

      {stats && (
        <div className="stats-section">
          <div className="stat-card">
            <h3>Food Quality</h3>
            <div className="rating-display">
              {renderStars(Math.round(stats.averageRatings.avgFood))}
              <span className="rating-number">{stats.averageRatings.avgFood?.toFixed(1) || '0.0'}</span>
            </div>
          </div>
          <div className="stat-card">
            <h3>Delivery Service</h3>
            <div className="rating-display">
              {renderStars(Math.round(stats.averageRatings.avgDelivery))}
              <span className="rating-number">{stats.averageRatings.avgDelivery?.toFixed(1) || '0.0'}</span>
            </div>
          </div>
          <div className="stat-card">
            <h3>Website Experience</h3>
            <div className="rating-display">
              {renderStars(Math.round(stats.averageRatings.avgWebsite))}
              <span className="rating-number">{stats.averageRatings.avgWebsite?.toFixed(1) || '0.0'}</span>
            </div>
          </div>
          <div className="stat-card">
            <h3>Total Reviews</h3>
            <div className="total-count">{stats.totalFeedback}</div>
          </div>
        </div>
      )}

      <div className="feedbacks-section">
        <h2>Recent Reviews</h2>
        {feedbacks.length === 0 ? (
          <div className="no-feedback">
            <p>No feedback available yet. Be the first to leave a review!</p>
          </div>
        ) : (
          <div className="feedbacks-grid">
            {feedbacks.map((feedback) => (
              <div key={feedback._id} className="feedback-card">
                <div className="feedback-header-card">
                  <div className="customer-info">
                    <div className="name-date-row">
                      <span className="customer-email">{feedback.userEmail.split('@')[0]}</span>
                      <span className="feedback-date">{formatDate(feedback.createdAt)}</span>
                    </div>
                    <span className="order-id">Order #{feedback.orderId}</span>
                  </div>
                </div>
                
                <div className="ratings-grid">
                  <div className="rating-item">
                    <span className="rating-label">Food</span>
                    <div className="stars">{renderStars(feedback.ratings.food)}</div>
                  </div>
                  <div className="rating-item">
                    <span className="rating-label">Delivery</span>
                    <div className="stars">{renderStars(feedback.ratings.delivery)}</div>
                  </div>
                  <div className="rating-item">
                    <span className="rating-label">Website</span>
                    <div className="stars">{renderStars(feedback.ratings.website)}</div>
                  </div>
                </div>
                
                {feedback.comment && (
                  <div className="comment-section">
                    <p>"{feedback.comment}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;