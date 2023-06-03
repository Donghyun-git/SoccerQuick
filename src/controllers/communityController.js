const communityService = require('../services/communityService');
const {
  AppError,
  errorMessageHandler,
} = require('../middlewares/errorHandler');
const {
  addPostSchema,
  updatePostSchema,
  deletePostSchema,
  addCommentSchema,
  updateCommentSchema,
  deleteCommentSchema,
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
  const { userId, title, description, notice } = req.body;

  const { error } = addPostSchema.validate({
    userId,
    title,
    description,
    notice,
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
      notice,
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
  const { userId, title, description, notice } = req.body;

  const { error } = updatePostSchema.validate({
    postId,
    userId,
    title,
    description,
    notice,
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
      notice,
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

  const { error } = deletePostSchema.validate({ postId, userId });

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

// [ 커뮤니티 게시글 댓글 등록 ]
const addComment = async (req, res, next) => {
  const { postId } = req.params;
  const { user_id, content } = req.body;

  const { error } = addCommentSchema.validate({ postId, user_id, content });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const result = await communityService.addComment(postId, user_id, content);

    if (result.statusCode === 404)
      return next(new AppError(404, result.message));

    res.status(201).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
  }
};

// [ 커뮤니티 게시글 댓글 수정 ]
const updateComment = async (req, res, next) => {
  const { postId, commentId } = req.params;
  const { user_id, content } = req.body;

  const { error } = updateCommentSchema.validate({
    postId,
    commentId,
    user_id,
    content,
  });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const result = await communityService.updateComment({
      postId,
      commentId,
      user_id,
      content,
    });

    if (result.statusCode === 403 || result.statusCode === 404)
      return next(new AppError(result.statusCode, result.message));

    res.status(200).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, '댓글 수정 실패'));
  }
};

// [ 커뮤니티 댓글 삭제 ]
const deleteComment = async (req, res, next) => {
  const { postId, commentId } = req.params;
  const { user_id } = req.body;

  const { error } = deleteCommentSchema.validate({
    postId,
    commentId,
    user_id,
  });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const result = await communityService.deleteComment({
      postId,
      commentId,
      user_id,
    });

    if (result.statusCode === 403 || result.statusCode === 404)
      return next(new AppError(result.statusCode, result.message));

    res.status(204).json({
      message: result.message,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, '댓글 삭제 실패'));
  }
};

module.exports = {
  addPost,
  getAllPosts,
  updatePost,
  deletePost,
  addComment,
  updateComment,
  deleteComment,
};
