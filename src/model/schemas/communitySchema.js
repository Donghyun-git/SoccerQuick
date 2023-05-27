const { Schema } = require('mongoose');

// [ 커뮤니티 게시글 스키마 ]
const PostSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    isNotice: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// [ 커뮤니티 댓글 스키마 ]
const CommentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = {
  PostSchema,
  CommentSchema,
};
