const { Router } = require('express');
const router = Router();
const reviewController = require('../controllers/reviewController');

/* GET */
// [ 리뷰 조회 ]
router.get('/', reviewController.getAllReviews);

/* POST */
// [ 리뷰 생성 ]
router.post('/', reviewController.addReview); //

/* PATCH */
// [ 리뷰 수정 ]
router.patch('/:reviewId', reviewController.updateReview);

/* DELETE */
// [ 리뷰 삭제 ]
router.delete('/:reviewId', reviewController.deleteReview);

module.exports = router;
