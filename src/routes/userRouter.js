const { Router } = require('express');
const router = Router();
const userController = require('../controllers/userController');

// [ 유저 정보 조회 ] - 마이페이지
router.get('/:id', userController.getUserInfo);

//[ 회원정보 수정 ]
router.patch('/', userController.updateUserInfo);

// [ 회원 탈퇴 ]
router.delete('/', userController.deleteUserInfo);

module.exports = router;
