const { Post, Comment, User } = require('../model/models/index');
const { AppError } = require('../middlewares/errorHandler');

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
  const { userId, postId, title, description, isNotice } = posts;

  try {
    const foundUser = await User.findOne({ userId });

    if (!foundUser) return new AppError(400, '존재하지 않는 아이디입니다.');

    if (isNotice === true && foundUser.role === 'user')
      return new AppError(403, '관리자만 공지사항을 등록할 수 있습니다.');

    const user_id = foundUser._id;

    const newPostField = {
      userId: user_id,
      postId: postId,
      title,
      description,
      isNotice,
    };

    const newPost = await Post.create(newPostField);

    return {
      statusCode: 201,
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
const updatePost = async (updatePost) => {
  const { postId, userId, title, description, isNotice } = updatePost;

  const foundUser = await User.findOne({ userId });
  if (!foundUser) return new AppError(400, '존재하지 않는 아이디입니다.');

  if (isNotice && foundUser.role === 'user')
    return new AppError(403, '관리자만 공지사항으로 변경 가능합니다.');
};

module.exports = {
  addPost,
  getAllPosts,
  updatePost,
};
