const communityService = require('../services/communityService');
const {
  AppError,
  errorMessageHandler,
} = require('../middlewares/errorHandler');
const {
  addPostSchema,
  updatePostSchema,
  deletePostSchema,
} = require('../validator/communityValidator');

//[ 커뮤니티 전체 게시글 조회 ]
const getAllPosts = async (req, res, next) => {
  try {
    const result = await communityService.getAllPosts();

    res.status(200).json({
      message: result.message,
      posts: result.posts,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, '전체 게시글 조회 실패'));
  }
};

//[ 커뮤니티 게시글 등록 ]
const addPost = async (req, res, next) => {
  const { userId, title, description, isNotice } = req.body;

  const { error } = addPostSchema.validate({
    userId,
    title,
    description,
    isNotice,
  });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const result = await communityService.addPost({
      userId,
      title,
      description,
      isNotice,
    });

    if (result.statusCode === 403 || result.statusCode === 404)
      return next(new AppError(result.statusCode, result.message));

    res.status(201).json({
      message: result.message,
      data: result.newPost,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, '게시글 등록 실패'));
  }
};

//[ (유저,관리자) 커뮤니티 게시글 수정 ]
// [admin, manager] 는 게시글 공지사항 변경 가능.
const updatePost = async (req, res, next) => {
  const { postId } = req.params;
  const { userId, title, description, isNotice } = req.body;

  const { error } = updatePostSchema.validate({
    postId,
    userId,
    title,
    description,
    isNotice,
  });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const result = await communityService.updatePost({
      postId,
      userId,
      title,
      description,
      isNotice,
    });

    if (result.statusCode === 400 || result.statusCode === 403)
      return next(new AppError(result.statusCode, result.message));

    res.status(200).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, '게시물 수정 실패'));
  }
};

//[ (유저, 관리자) 커뮤니티 게시글 삭제 ]
const deletePost = async (req, res, next) => {
  const { postId } = req.params;
  const { userId } = req.body;

  const { error, value } = deletePostSchema.validate({ postId, userId });

  console.log(value);

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const result = await communityService.deletePost(postId, userId);

    if (result.statusCode === 400 || result.statusCode === 403)
      return next(new AppError(result.statusCode, result.message));

    res.status(204).json({
      message: result.message,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  addPost,
  getAllPosts,
  updatePost,
  deletePost,
};
