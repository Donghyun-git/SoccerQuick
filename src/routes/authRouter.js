const { Router } = require('express');
const router = Router();
const authController = require('../controllers/authController');

/* GET */

/* POST */

//[ 회원가입 ]
router.post('/signup', authController.signUp); //auth/signup

// [ 로그인 ]
router.post('/login', authController.logIn); // auth/login

//[회원가입 아이디 중복체크]
router.post('/id', authController.validateUniqueUserId); //auth/id-check

/* PATCH */

module.exports = router;
