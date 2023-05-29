const { Router } = require('express');
const router = Router();
const groundController = require('../controllers/groundController');

/* GET */
// [모든 구장 조회]
router.get('/', groundController.getAllGrounds);

// [위치, 날짜 구장 필터링 ]
router.get('/filter', groundController.getFilteredGrounds);

module.exports = router;
