const { Router } = require('express');
const router = Router();
const reviewController = require('../controllers/reviewController');

/* GET */
// [ 리뷰 조회 ]
router.get('/', reviewController.getAllReviews);

/* POST */
// [ 리뷰 생성 ]
router.post('/:id', reviewController.addReview);

/* PATCH */
// [ 리뷰 수정 ]
// router.patch('/:id', reviewController.updateReview);

/* DELETE */
// [ 리뷰 삭제 ]
// router.delete('/:id', reviewController.deleteReview);

module.exports = router;
