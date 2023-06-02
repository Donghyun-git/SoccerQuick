const reviewService = require('../services/reviewService');
const {
  AppError,
  errorMessageHandler,
} = require('../middlewares/errorHandler');

const {
  addReviewSchema,
  updateReviewSchema,
} = require('../validator/reviewValidator');

// [ 리뷰 전체 조회]
const getAllReviews = async (req, res, next) => {
  try {
    const result = await reviewService.getAllReviews();
    res.status(200).json({
      message: result.message,
      reviews: result.reviews,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, '리뷰 조회 실패'));
  }
};

// [ 리뷰 등록 ]
const addReview = async (req, res, next) => {
  const { user_id, ground_id, rating, comment } = req.body;

  //validate
  const { error } = addReviewSchema.validate({
    user_id,
    ground_id,
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
      ground_id,
      rating,
      comment,
    });

    if (result.statusCode === 403 || result.statusCode === 404)
      return next(new AppError(result.statusCode, result.message));

    res.status(201).json({
      message: result.message,
      data: result.newReview,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, '리뷰 등록 실패'));
  }
};

// [ 리뷰 수정 ]
const updateReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const { user_id, rating, comment } = req.body;
  console.log(reviewId)
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

    if (result.statusCode === 400 || result.statusCode === 403)
      return next(new AppError(result.statusCode, result.message));

    res.status(200).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, '리뷰 수정 실패'));
  }
};

// [ 리뷰 삭제 ]

module.exports = {
  getAllReviews,
  addReview,
  updateReview,
};
