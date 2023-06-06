const { Schema } = require('mongoose');
const playerSchema = require('./playerSchema');

const GroupSchema = new Schema(
  {
    group_id: {
      type: String,
      required: true,
    },
    leader: {
      leader_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      leader_name: {
        type: String,
        required: true,
      },
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['모집중', '모집 완료'],
      required: true,
      default: '모집중',
    },
    play_date: {
      type: String,
      required: true,
    },
    recruitment_count: {
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
      current_count: {
        type: Number,
        default: 0,
        required: true,
      },
    },
    applicant: {
      type: [playerSchema],
      default: [],
    },
    accept: {
      type: [playerSchema],
      default: [],
    },
    contents: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = GroupSchema;