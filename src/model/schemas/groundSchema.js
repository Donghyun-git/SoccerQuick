const { Schema } = require('mongoose');

const GroundSchema = new Schema(
  {
    groundId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    price: { type: Number, required: true },
    rating: { type: Number },
    usersFavorites: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamp: true }
);

module.exports = GroundSchema;
