const { Router } = require('express');
const router = Router();
const userController = require('../controllers/user.ctrl');

//[ 회원가입 ]
router.post('/signup', userController.signUp);

// [ 로그인 ]
router.post('/login', userController.logIn);

module.exports = router;
