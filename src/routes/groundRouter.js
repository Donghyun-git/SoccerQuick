const { Router } = require('express');
const router = Router();
const tokenValidator = require('../middlewares/tokenValidator');
const groundController = require('../controllers/groundController');

/* GET */
// [ 모든 풋볼장 조회 ]
router.get('/', tokenValidator, groundController.getAllGrounds);

// [ 위치, 날짜 풋볼장 필터링 ]
// router.get('/filter', groundController.getFilteredGrounds);

/* POST */
// [ 풋볼장 즐겨찾기에 추가 ]
router.post('/:groundId', tokenValidator, groundController.addFavorites);

/* DELETE */
// [ 풋볼장 즐겨찾기에서 삭제]
router.delete('/:groundId', tokenValidator, groundController.removeFavorites);

module.exports = router;
