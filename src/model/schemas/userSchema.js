const { Schema } = require('mongoose');

const UserSchema = new Schema(
  {
    admin_id: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
    user_id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    nick_name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['남', '여'],
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'user'],
      default: 'user',
    },
    applicant_status: {
      type: String,
      enum: ['모집 가능', '모집 불가능'],
      default: '모집 가능',
    },
    favoritePlaygrounds: [{ type: Schema.Types.ObjectId, ref: 'Ground' }],
    login_banned: {
      type: Boolean,
      default: false,
    },
    login_banEndDate: {
      type: Date,
      default: null,
    },
    community_banned: {
      type: Boolean,
      default: false,
    },
    community_banEndDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const WithdrawnUserSchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  withdrawalDate: {
    type: Date,
    required: true,
  },
});

module.exports = { UserSchema, WithdrawnUserSchema };
