const { Schema } = require('mongoose');

const StadiumSchema ={
  id: { type: Number, required: true },
  name: { type: String, required: true },
  size_x: { type: Number, required: true },
  size_y: { type: Number, required: true },
  rental: { type: Boolean, required: true },
  inout_door: { type: String, required: true },
  inout_door_nm: { type: String, required: true },
  stadium_type: { type: String, required: true },
  stadium_type_nm: { type: String, required: true },
  images: [
    {
      id: { type: Number, required: true },
      image: { type: String, required: true },
      is_thumbnail: { type: Boolean, required: true },
      is_ad: { type: Boolean, required: true },
      stadium: { type: Number, required: true },
    },
  ],
  info: { type: String, required: true },
};

const GroundSchema = new Schema(
  {
    ground_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    source: { type: String, required: true },
    message: { type: String, required: true },
    title: { type: String, required: true },
    address: {
      area: { type: String, required: true },
      fullAddress: { type: String, required: true },
    },
    stadiums: [StadiumSchema],
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    parking: { type: Boolean, required: true },
    parking_free: { type: Boolean, required: true },
    shower: { type: Boolean, required: true },
    shoes: { type: Boolean, required: true },
    wear: { type: Boolean, required: true },
    ball: { type: Boolean, required: true },
    toilet: { type: Number, required: true },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = { GroundSchema, StadiumSchema };
