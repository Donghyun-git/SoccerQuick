const { Router } = require('express');
const router = Router();
const tokenValidator = require('../middlewares/tokenValidator');
const groupController = require('../controllers/groupController');

// GET

// [ 전체 팀 그룹 조회 ]
router.get('/', tokenValidator, groupController.getAllGroups);

// POST
// [ 팀 등록 ]
router.post('/', tokenValidator, groupController.addGroup);

// [ 팀 신청 ]
router.post('/:group_id', tokenValidator, groupController.userApplicantGroup);

// [ 팀 수락 ]
router.patch(
  '/:group_id',
  tokenValidator,
  groupController.leaderApplicantAccept
);

module.exports = router;
