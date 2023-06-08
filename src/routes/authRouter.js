const { Router } = require('express');
const router = Router();
const tokenValidator = require('../middlewares/tokenValidator');
const authController = require('../controllers/authController');

//[ 회원가입 ]
router.post('/signup', authController.signUp);

// [ 로그인 ]
router.post('/login', authController.logIn);

//[ 로그아웃 ]

router.post('/logout', tokenValidator, authController.logOut);

//[회원가입 아이디 중복체크]
router.post('/id', authController.validateUniqueUserId);

// [ 비밀번호 체크 ]
router.post('/password', authController.validatePassword);

module.exports = router;
