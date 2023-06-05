const { Router } = require('express');
const router = Router();
const groupController = require('../controllers/groupController');

// GET

// [ 전체 팀 그룹 조회 ]
router.get('/', groupController.getAllGroups);

// POST
// [ 팀 등록 ]
router.post('/', groupController.addGroup);

module.exports = router;
