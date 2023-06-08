const { Router } = require('express');
const router = Router();
const tokenValidator = require('../middlewares/tokenValidator');
const domController = require('../controllers/domController');

/* GET */
// [ 모든 풋볼장 조회 ]
router.get('/', tokenValidator, domController.getAllDoms);

// [ 위치, 날짜 풋볼장 필터링 ]
// router.get('/filter', domController.getFilteredGrounds);

/* POST */
// [ 풋볼장 즐겨찾기에 추가 ]
router.post('/:groundId', tokenValidator, domController.addFavoriteDoms);

/* DELETE */
// [ 풋볼장 즐겨찾기에서 삭제]
router.delete('/:groundId', tokenValidator, domController.removeFavoriteDoms);

// [ 풋볼장 예약 ]
// router.post ('/ground/:ground_id/reserve', )
module.exports = router;
