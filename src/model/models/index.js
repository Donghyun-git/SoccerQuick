const mongoose = require('mongoose');

// [ 유저 모델 ]
const { UserSchema, WithdrawnUserSchema } = require('../schemas/userSchema');
const User = mongoose.model('User', UserSchema);
const WithdrawnUser = mongoose.model('WidthdrawnUser', WithdrawnUserSchema);

// [ 관리자 기능 모델 ]
const AdminSchema = require('../schemas/adminSchema');
const Admin = mongoose.model('Admin', AdminSchema);

// [ 커뮤니티 관련 모델 ]
const { PostSchema, CommentSchema } = require('../schemas/communitySchema');
const Post = mongoose.model('Post', PostSchema);
const Comment = mongoose.model('Comment', CommentSchema);

// [ 리뷰 관련 모델 ]
const ReviewSchema = require('../schemas/reviewSchema');
const Review = mongoose.model('Review', ReviewSchema);

// [ 풋살장 관련 모델 ]
const GroundSchema = require('../schemas/groundSchema');
const Ground = mongoose.model('Ground', GroundSchema);

// [ 팀 관련 모델 ]
const TeamSchema = require('../schemas/teamSchema');
const Team = mongoose.model('Team', TeamSchema);
module.exports = {
  User,
  Admin,
  WithdrawnUser,
  Post,
  Comment,
  Review,
  Ground,
  Team,
};
