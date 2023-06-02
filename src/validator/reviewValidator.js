const Joi = require('joi');

const addReviewSchema = Joi.object({
  user_id: Joi.string().label('아이디').required(),
  ground_id: Joi.string().label('풋볼장번호').required(),
  rating: Joi.number().label('평점').min(1).max(5).required(),
  comment: Joi.string().label('리뷰내용').required(),
});



module.exports = { addReviewSchema };
