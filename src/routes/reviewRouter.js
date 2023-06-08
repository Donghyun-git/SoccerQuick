const { Router } = require('express');
const router = Router();
const tokenValidator = require('../validator/jwt/tokenValidator');
const reviewController = require('../controllers/reviewController');

/* GET */
// [ 리뷰 조회 ]
router.get('/', tokenValidator, reviewController.getAllReviews);

/* POST */
// [ 리뷰 생성 ]
router.post('/', tokenValidator, reviewController.addReview); //

/* PATCH */
// [ 리뷰 수정 ]
router.patch('/:reviewId', tokenValidator, reviewController.updateReview);

/* DELETE */
// [ 리뷰 삭제 ]
router.delete('/:reviewId', tokenValidator, reviewController.deleteReview);

module.exports = router;
