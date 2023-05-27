const { Schema } = require('mongoose');

const GroundSchema = new Schema({
  name: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  price: { type: Number, required: true },
  rating: { type: Number },
  usersFavorites: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = GroundSchema;
