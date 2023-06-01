const { Post, Comment, User, Admin } = require('../model/models/index');
const { AppError } = require('../middlewares/errorHandler');
const { createPostId } = require('../utils/createIndex');
const toString = require('../utils/toString');

// [ 커뮤니티 전체 게시글 조회 ]
const getAllPosts = async () => {
  try {
    const posts = await Post.find();

    return {
      statusCode: 200,
      message: '전체 게시글 조회 성공',
      posts: posts,
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, '전체 게시글 조회 실패');
  }
};

//[ 커뮤니티 게시글 등록 ]
/** ([유저아이디, 제목, 본분, 공지사항여부] 객체) */
const addPost = async (posts) => {
  const { userId, title, description, isNotice } = posts;

  try {
    const foundUser = await User.findOne({ user_id: userId });

    if (!foundUser) return new AppError(400, '존재하지 않는 아이디입니다.');

    const admin_id = foundUser.admin_id;

    if (isNotice === '공지사항' && !admin_id)
      return new AppError(403, '관리자만 공지사항을 등록할 수 있습니다.');

    const user_id = foundUser._id;

    const post_id = await createPostId();

    const newPostField = {
      user_id: user_id,
      post_id: post_id,
      title,
      description,
      isNotice,
    };

    const newPost = await Post.create(newPostField);

    return {
      message: '게시글이 등록되었습니다.',
      newPost: newPost,
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, '게시글 등록 실패');
  }
};

//[ 커뮤니티 게시글 수정 ]
/** (게시물 수정 목록 객체) */
const updatePost = async (post) => {
  const { postId, userId, title, description, isNotice } = post;
  try {
    const foundUser = await User.findOne({ user_id: userId });
    console.log(postId);
    if (!foundUser) return new AppError(400, '존재하지 않는 아이디입니다.');
    if (isNotice === '공지사항' && !foundUser.admin_id)
      return new AppError(403, '관리자만 공지사항으로 변경 가능합니다.');

    const user_id = foundUser._id;

    const foundPost = await Post.findOne({ post_id: postId });

    if (!foundPost) return new AppError(400, '존재하지 않는 게시물입니다.');

    if (toString(user_id) !== toString(foundPost.user_id)) {
      return new AppError(400, '본인이 작성한 게시글만 수정 가능합니다.');
    }

    const updatedPostObj = {
      post_id: foundPost.post_id,
      user_id: user_id,
      title: title,
      description: description,
      isNotice: isNotice,
    };

    const updatedPost = await Post.findOneAndUpdate(
      { post_id: postId },
      { $set: updatedPostObj },
      { new: true }
    );

    return { statusCode: 201, message: '게시물 수정 성공', data: updatedPost };
  } catch (error) {
    console.error(error);
    return new AppError(500, '게시글 수정 실패');
  }
};

//[ 커뮤니티 게시글 삭제 ]
/** (게시글 번호, 게시물 삭제하는 유저아이디) */
const deletePost = async (post_id, userId) => {
  try {
    const foundUser = await User.findOne({ user_id: userId });
    if (!foundUser) return new AppError(400, '존재하지 않는 아이디입니다.');

    const user_id = foundUser._id;

    const foundPost = await Post.findOne({ post_id });

    if (!foundPost) return new AppError(400, '존재하지 않는 게시물 입니다.');

    if (foundUser.admin_id) {
      await Post.deleteOne({ post_id });
      return { statusCode: 204, message: '게시물이 삭제되었습니다.' };
    }

    if (toString(user_id) !== toString(foundPost.user_id))
      return new AppError(400, '글 작성자만 삭제 가능합니다.');

    if (toString(user_id) === toString(foundPost.user_id)) {
      await Post.deleteOne({ post_id });
      return { statusCode: 204, message: '게시물이 삭제되었습니다.' };
    }

    return new AppError(403, '삭제 권한이 없습니다.');
  } catch (error) {
    console.error(error);
    return new AppError(500, '게시물 삭제 실패');
  }
};

module.exports = {
  addPost,
  getAllPosts,
  updatePost,
  deletePost,
};
