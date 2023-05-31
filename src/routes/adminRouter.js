const { Router } = require('express');
const router = Router();
const adminController = require('../controllers/adminController');

// [ 관리자 - 유저 정보 조회]
router.get('/:id', adminController.getAllUserInfo); // admin/:id

//[ 관리자 - 유저 로그인 정지 ]
router.patch('/login-ban', adminController.adminBanUser); // admin/login-ban

//[ 관리자 - 유저 직위 변경 ]
router.patch('/role', adminController.updateUserRole); //admin/role

module.exports = router;
