import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  ratings: {
    food: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    delivery: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    website: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  },
  comment: {
    type: String,
    default: ''
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Feedback', feedbackSchema);