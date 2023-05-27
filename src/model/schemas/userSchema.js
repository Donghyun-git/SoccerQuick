const { Schema } = require('mongoose');

const UserSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    favoritePlaygrounds: [{ type: Schema.Types.ObjectId, ref: 'Ground' }],
    isBanned: {
      type: Boolean,
      default: false,
    },
    banEndDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = UserSchema;
