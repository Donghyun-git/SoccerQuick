const { Review, User, Ground } = require('../model/models/index');
const { AppError } = require('../middlewares/errorHandler');
const { createReviewId } = require('../utils/createIndex');

// [ 리뷰 전체 조회 ]
const getAllReviews = async () => {
  try {
    const reviews = await Review.find();

    return {
      message: '전체 리뷰 조회 성공',
      data: reviews,
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, '전체 리뷰 조회 실패');
  }
};

// [ 리뷰 등록 ]
/** ([유저아이디, 풋볼장번호, 작성자이름, 평점, 리뷰내용 ]) */
const addReview = async (reviews) => {
  const { user_id, ground_id, rating, comment } = reviews;

  try {
    const foundUser = await User.findOne({ user_id });
    if (!foundUser) return new AppError(404, '존재하지 않는 아이디입니다.');
    const userObjectId = foundUser._id;

    const foundGround = await Ground.findOne({ ground_id });
    if (!foundGround) return new AppError(404, '존재하지 않는 풋볼장입니다.');
    const groundObjectId = foundGround._id;

    const review_id = await createReviewId();

    const newReviewField = {
      review_id,
      user_id: userObjectId,
      ground_id: groundObjectId,
      name: foundUser.name,
      rating,
      comment,
    };

    const newReview = await Review.create(newReviewField);

    return {
      message: '리뷰가 등록되었습니다.',
      data: newReview,
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, '리뷰 등록 실패');
  }
};

// [ 리뷰 수정 ]
/** ([리뷰번호, 유저아이디, 평점, 리뷰내용 ]) */
const updateReview = async (review) => {
  const { reviewId, user_id, rating, comment } = review;

  try {
    const foundReview = await Review.findOne({ review_id: reviewId });
    if (!foundReview) return new AppError(404, '존재하지 않는 리뷰입니다.');

    const foundUser = await User.findOne({ user_id });
    if (!foundUser) return new AppError(404, '존재하지 않는 아이디입니다.');
    const userObjectId = toString(foundUser._id);

    if (toString(user_id) !== userObjectId) {
      return new AppError(404, '본인이 작성한 리뷰만 수정 가능합니다.');
    }

    const updatedReviewObj = {
      rating,
      comment,
    };

    const updatedReview = await Review.findOneAndUpdate(
      { review_id: reviewId },
      { $set: updatedReviewObj },
      { new: true }
    );
    return { message: '리뷰 수정 성공', data: updatedReview };
  } catch (error) {
    console.error(error);
    return new AppError(500, '리뷰 수정 실패');
  }
};

// [ 리뷰 삭제 ]
const deleteReview = async (review) => {
  const { reviewId, user_id } = review;
  console.log(reviewId, user_id);
  try {
    const foundReview = await Review.findOne({ review_id: reviewId });

    if (!foundReview) return new AppError(404, '존재하지 않는 리뷰입니다.');

    const reviewUserObjectId = toString(foundReview.user_id);

    const foundUser = await User.findOne({ user_id });

    if (!foundUser) return new AppError(404, '존재하지 않는 아이디입니다.');

    const userObjectId = toString(foundUser._id);

    if (reviewUserObjectId !== userObjectId)
      return new AppError(403, '리뷰 작성자만 삭제 가능합니다.');

    await Review.deleteOne({ review_id: reviewId });

    return { message: '리뷰 삭제 성공' };
  } catch (error) {
    console.error(error);
    return new AppError(500, '리뷰 삭제 실패');
  }
};

module.exports = {
  getAllReviews,
  addReview,
  updateReview,
  deleteReview,
};
