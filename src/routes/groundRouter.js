const { Router } = require('express');
const router = Router();
const groundController = require('../controllers/groundController');

/* GET */
// [ 모든 풋볼장 조회 ]
router.get('/', groundController.getAllGrounds);

// [ 위치, 날짜 풋볼장 필터링 ]
router.get('/filter', groundController.getFilteredGrounds);

/* POST */
// [ 풋볼장 즐겨찾기에 추가 ]
router.post('/:groundId', groundController.addFavorites);

/* DELETE */
// [ 풋볼장 즐겨찾기에서 삭제]
router.delete('/:groundId', groundController.removeFavorites);

module.exports = router;
