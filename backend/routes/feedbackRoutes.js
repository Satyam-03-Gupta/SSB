import express from 'express';
import Feedback from '../models/Feedback.js';
const router = express.Router();

// Submit feedback
router.post('/', async (req, res) => {
  try {
    const { orderId, userEmail, ratings, comment, orderDate } = req.body;
    
    const feedback = new Feedback({
      orderId,
      userEmail,
      ratings,
      comment,
      orderDate
    });
    
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting feedback', error: error.message });
  }
});

// Get all feedback (public)
router.get('/', async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback', error: error.message });
  }
});

// Get feedback stats
router.get('/stats', async (req, res) => {
  try {
    const totalFeedback = await Feedback.countDocuments();
    const avgRatings = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          avgFood: { $avg: '$ratings.food' },
          avgDelivery: { $avg: '$ratings.delivery' },
          avgWebsite: { $avg: '$ratings.website' }
        }
      }
    ]);
    
    res.json({
      totalFeedback,
      averageRatings: avgRatings[0] || { avgFood: 0, avgDelivery: 0, avgWebsite: 0 }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

export default router;