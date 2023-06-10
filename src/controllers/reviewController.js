const reviewService = require('../services/reviewService');
const {
  AppError,
  errorMessageHandler,
} = require('../middlewares/errorHandler');

const {
  addReviewSchema,
  updateReviewSchema,
  deleteReviewSchema,
} = require('../validator/reviewValidator');

// [ 리뷰 전체 조회 ]
const getAllReviews = async (req, res, next) => {
  try {
    const result = await reviewService.getAllReviews();

    if (result.statusCode !== 200)
      return next(new AppError(result.statusCode, result.message));

    res.status(200).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// [ 리뷰 페이징 조회 ]
const getPageReview = async (req, res, next) => {
  const { page } = req.query;

  try {
    const result = await reviewService.getPageReview(page);

    if (result.statusCode !== 200)
      return next(new AppError(result.statusCode, result.message));

    res.status(200).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// [ 리뷰 등록 ]
const addReview = async (req, res, next) => {
  const { user_id } = req.user;
  const { dom_id, rating, comment } = req.body;

  const { error } = addReviewSchema.validate({
    user_id,
    dom_id,
    rating,
    comment,
  });
  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const result = await reviewService.addReview({
      user_id,
      dom_id,
      rating,
      comment,
    });

    if (result.statusCode !== 201)
      return next(new AppError(result.statusCode, result.message));

    res.status(201).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// [ 리뷰 수정 ]
const updateReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const { user_id } = req.user;
  const { rating, comment } = req.body;

  const { error } = updateReviewSchema.validate({
    reviewId,
    user_id,
    rating,
    comment,
  });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const result = await reviewService.updateReview({
      reviewId,
      user_id,
      rating,
      comment,
    });

    if (result.statusCode !== 200)
      return next(new AppError(result.statusCode, result.message));

    res.status(200).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// [ 리뷰 삭제 ]
const deleteReview = async (req, res, next) => {
  const { review_id } = req.params;
  const { user_id } = req.user;

  const { error } = deleteReviewSchema.validate({
    review_id,
    user_id,
  });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const result = await reviewService.deleteReview(review_id, user_id);

    if (result.statusCode !== 204)
      return next(new AppError(result.statusCode, result.message));

    res.status(204).json({
      message: result.message,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// [ 리뷰 좋아요 등록 ]
const addLikesReview = async (req, res, next) => {
  const { review_id } = req.params;
  const { user_id } = req.user;
  try {
    const result = await reviewService.addLikesReview(review_id, user_id);
    if (result.statusCode !== 200)
      return next(new AppError(result.statusCode, result.message));

    res.status(200).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// [ 리뷰 추천 삭제 ]
const removeLikesReview = async (req, res, next) => {
  const { review_id } = req.params;
  const { user_id } = req.user;
  try {
    const result = await reviewService.removeLikesReview(review_id, user_id);
    if (result.statusCode !== 204)
      return next(new AppError(result.statusCode, result.message));

    res.status(204).json({
      message: result.message,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

module.exports = {
  getAllReviews,
  getPageReview,
  addReview,
  updateReview,
  deleteReview,
  addLikesReview,
  removeLikesReview,
};
