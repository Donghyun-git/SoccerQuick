const Joi = require('joi');

const addReviewSchema = Joi.object({
  user_id: Joi.string().label('아이디').required(),
  dom_id: Joi.string().label('풋볼장번호').required(),
  rating: Joi.number().label('평점').min(1).max(5).required(),
  comment: Joi.string().label('리뷰내용').required(),
});

const updateReviewSchema = Joi.object({
  reviewId: Joi.string().label('리뷰번호').required(),
  user_id: Joi.string().label('아이디').required(),
  rating: Joi.number().label('평점').min(1).max(5).required(),
  comment: Joi.string().label('리뷰내용').required(),
});

const deleteReviewSchema = Joi.object({
  review_id: Joi.string().label('리뷰번호').required(),
  user_id: Joi.string().label('아이디').required(),
});

module.exports = { addReviewSchema, updateReviewSchema, deleteReviewSchema };
