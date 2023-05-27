const { Schema } = require('mongoose');

// Review 스키마
const ReviewSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    groundName: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

module.exports = ReviewSchema;
