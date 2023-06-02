const { Schema } = require('mongoose');

const playerSchema = {
  id: { type: Schema.Types.ObjectId, ref: 'User' },
  gender: { type: String, ref: 'User.gender' },
  position: { type: String, required: true },
  skill: { type: String, required: true },
  body: { type: String, required: true },
  status: { type: String, enum: ['추가 가능', '추가 불가능'] },
};

const TeamSchema = new Schema({
  team_id: {
    type: String,
    required: true,
  },
  leader: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['모집중', '모집 완료'],
    required: true,
  },
  play_date: {
    type: Date,
    required: true,
  },
  gk_count: {
    type: Number,
    default: 0,
    required: true,
  },
  player_count: {
    type: Number,
    default: 0,
    required: true,
  },
  applicant: [playerSchema],
  keepers: [playerSchema],
  players: [playerSchema],
});

module.exports = { TeamSchema };
