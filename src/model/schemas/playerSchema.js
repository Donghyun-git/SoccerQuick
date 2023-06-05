const { Schema } = require('mongoose');

const playerSchema = {
  id: { type: Schema.Types.ObjectId, ref: 'User' },
  gender: { type: String, ref: 'User.gender' },
  position: { type: String, required: true },
  skill: { type: String, required: true },
  body: { type: String, required: true },
  status: {
    type: String,
    enum: ['기존 선수', '추가 가능', '추가 불가능'],
    default: '기존 선수',
  },
};

module.exports = playerSchema;
