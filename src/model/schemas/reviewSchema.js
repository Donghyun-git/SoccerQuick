const { Schema } = require('mongoose');

// Review 스키마
const ReviewSchema = new Schema(
  {
    review_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dom_id: {
      type: Schema.Types.ObjectId,
      ref: 'Dom',
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
    userslikes:[
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
);

module.exports = ReviewSchema;
