const { Review, User, Ground } = require('../model/models/index');
const { AppError } = require('../middlewares/errorHandler');
const { createGroundId } = require('../utils/createIndex');

// [ 리뷰 전체 조회 ]
const getAllReviews = async () => {
  try {
    const reviews = await Review.find();

    return {
      message: '전체 리뷰 조회 성공',
      reviews,
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, '전체 리뷰 조회 실패');
  }
};

// [ 리뷰 등록 ]
/** ([유저아이디, 풋볼장번호, 작성자이름, 평점, 리뷰내용 ]) */
const addReview = async (reviews) => {
  const { user_id, ground_id, name, rating, comment } = reviews;

  try {
    const foundUser = await User.findOne({ user_id });
    if (!foundUser) return new AppError(404, '존재하지 않는 아이디입니다.');
    const userObjectId = foundUser._id;

    const foundGround = await Ground.findOne({ ground_id });
    if (!foundGround) return new AppError(404, '존재하지 않는 풋볼장입니다.');
    const groundObjectId = foundGround._id;

    const newReviewField = {
      user_id: userObjectId,
      ground_id: groundObjectId,
      name: foundUser.name,
      rating,
      comment,
    };

    const newReview = await Review.create(newReviewField);

    return {
      message: '리뷰가 등록되었습니다.',
      newReview,
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, '리뷰 등록 실패');
  }
};

module.exports = {
  getAllReviews,
  addReview,
};
