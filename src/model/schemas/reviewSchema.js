const { Schema } = require('mongoose');

// Review 스키마
const ReviewSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ground_id: {
      type: Schema.Types.ObjectId,
      ref: 'Ground',
      required: true,
    },
    name: {
      type: String,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = ReviewSchema;
