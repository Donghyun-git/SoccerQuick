const { Router } = require('express');
const router = Router();
const userController = require('../controllers/userController');

// [ 유저 정보 조회 ]
router.get('/:id', userController.getUserInfo); // user/:id

//[ 회원정보 수정 ]
router.patch('/', userController.updateUserInfo); // user/update

// [ 회원 탈퇴 ]
router.delete('/', userController.deleteUserInfo); //  user/delete

module.exports = router;
