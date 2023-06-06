const { Schema } = require('mongoose');

const playerSchema = {
  id: { type: Schema.Types.ObjectId, ref: 'User' },
  gender: { type: String, ref: 'User.gender' },
  position: { type: String, required: true },
  level: { type: String, required: true },
  contents: { type: String, required: true },
  status: {
    type: String,
    ref: 'User.applicant_status',
  },
};

module.exports = playerSchema;
