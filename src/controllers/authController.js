const authService = require('../services/authService');
const { AppError } = require('../middlewares/errorHandler');

//[ 유저 회원가입 ]
const signUp = async (req, res, next) => {
  const { userId, password, userName, userEmail } = req.body;

  if (!userId) {
    return next(new AppError(400, '아이디는 필수 입력 사항입니다.'));
  }

  if (!password) {
    return next(new AppError(400, '비밀번호는 필수 입력 사항입니다.'));
  }

  if (!userEmail) {
    return next(new AppError(400, '이메일은 필수 입력 사항입니다.'));
  }

  if (!userName) {
    return next(new AppError(400, '닉네임은 필수 입력 사항입니다.'));
  }

  const formData = req.body;

  try {
    const result = await authService.signUpUser(formData);

    if (result.statusCode === 400)
      return next(new AppError(400, result.message));

    res.status(201).json({ message: result.message });
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
    const result = await authService.logInUser(userId, password);

    if (result.statusCode === 400) {
      return next(new AppError(400, result.message));
    } else if (result.statusCode === 403) {
      return next(new AppError(403, result.message));
    } else if (result) {
      const { accessToken, refreshToken, userData } = result;
      const {
        userName,
        userEmail,
        favoritePlaygrounds,
        isBanned,
        banEndDate,
        createdAt,
      } = userData;

      //[accessToken, refreshToken 각각 response 헤더, 쿠키 세팅]
      res.setHeader('Authorization', `Bearer ${accessToken}`);
      res.cookie('refreshToken', refreshToken, {
        httpOnly: false,
      });

      res.status(200).json({
        message: '로그인 성공',
        userData: {
          userId: userData.userId,
          userName: userName,
          userEmail: userEmail,
          favoritePlaygrounds: favoritePlaygrounds,
          isBanned: isBanned,
          banEndDate: banEndDate,
          createdAt: createdAt,
        },
      });
    }
  } catch (error) {
    console.error(error);
    return next(new AppError(500, '로그인 실패'));
  }
};

module.exports = { logIn, signUp };
