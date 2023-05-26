const userService = require('../services/userService');
const { AppError } = require('../middlewares/errorHandler');

//[ 유저 회원가입 ]
const signUp = async (req, res, next) => {
  const { userId, password } = req.body;

  if (!userId) {
    return next(new AppError(400, '아이디는 필수 입력 사항입니다.'));
  }

  if (!password) {
    return next(new AppError(400, '비밀번호는 필수 입력 사항입니다.'));
  }

  try {
    await userService.signUpUser(userId, password, next);

    res.status(201).json({ message: '회원가입에 성공하였습니다.' });
  } catch (error) {
    console.error(error);
    next(new AppError(500, '회원가입 실패'));
  }
};

//[ 유저 로그인 ]
const logIn = async (req, res, next) => {
  const { userId, password } = req.body;

  if (!userId) {
    return next(new AppError(400, '아이디를 입력해주세요.'));
  }
  if (!password) {
    return next(new AppError(400, '비밀번호를 입력해주세요.'));
  }

  try {
    const result = await userService.logInUser(userId, password, next);

    if (result) {
      const { accessToken, refreshToken, userData } = result;

      //[accessToken, refreshToken 각각 response 헤더, 쿠키 세팅]
      res.setHeader('Authorization', `Bearer ${accessToken}`);
      res.cookie('refreshToken', refreshToken, {
        httpOnly: false,
      });

      res.status(200).json({
        message: '로그인 성공',
        userData: {
          userId: userData.userId,
        },
      });
    }
  } catch (error) {
    console.error(error);
    return next(new AppError(500, '로그인 실패'));
  }
};

module.exports = {
  signUp,
  logIn,
};
