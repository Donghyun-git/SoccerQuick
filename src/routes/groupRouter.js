const { Router } = require('express');
const router = Router();
const tokenValidator = require('../validator/jwt/tokenValidator');
const groupController = require('../controllers/groupController');

// GET
// [ 전체 팀 그룹 조회 ]
router.get('/', tokenValidator, groupController.getAllGroups);

// [ 단일 팀 조회 ]
router.get('/:group_id', tokenValidator, groupController.getOneGroup);

// POST
// [ 팀 등록 ]
router.post('/', tokenValidator, groupController.addGroup);

// [ 팀 신청 ]
router.post('/:group_id', tokenValidator, groupController.userApplicantGroup);

// PATCH
// [ 팀 정보 수정 ]
router.patch('/:group_id/info', tokenValidator, groupController.updateMyGroup);

// [ 팀 수락 ]
router.patch(
  '/:group_id/accept',
  tokenValidator,
  groupController.leaderApplicantAccept
);

//[ 팀 거절 ]
router.patch(
  '/:group_id/reject',
  tokenValidator,
  groupController.leaderApplicantReject
);

// DELETE
// [ 팀 삭제 ]
router.delete('/:group_id', tokenValidator, groupController.deleteGroup);

module.exports = router;
