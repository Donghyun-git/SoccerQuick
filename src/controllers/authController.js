const authService = require('../services/authService');
const {
  AppError,
  errorMessageHandler,
} = require('../middlewares/errorHandler');
const {
  signUpSchema,
  logInSchema,
  validateUniqueUserIdSchema,
} = require('../validator/authValidator');

//[ 유저 회원가입 ]
const signUp = async (req, res, next) => {
  const { user_id, password, name, nick_name, email, phone_number } = req.body;

  const { error } = signUpSchema.validate(req.body);

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const result = await authService.signUpUser({
      user_id,
      password,
      name,
      nick_name,
      email,
      phone_number,
    });

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
  const { user_id, password } = req.body;

  const { error } = logInSchema.validate(req.body);

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const result = await authService.logInUser(user_id, password);

    if (result.statusCode === 400) {
      return next(new AppError(400, result.message));
    } else if (result.statusCode === 403) {
      return next(new AppError(403, result.message));
    } else if (result) {
      const { accessToken, refreshToken, userData } = result;
      const {
        nick_name,
        name,
        email,
        phone_number,
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
          user_id: userData.user_id,
          name: name,
          nick_name: nick_name,
          email: email,
          phone_number: phone_number,
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

//[ 회원가입 아이디 중복 체크]
const validateUniqueUserId = async (req, res, next) => {
  const { user_id } = req.body;

  const { error } = validateUniqueUserIdSchema.validate({ user_id });
  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const result = await authService.validateUniqueUserId(user_id);

    res.status(200).json({
      message: result.message,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, '아이디 중복체크 실패'));
  }
};

module.exports = { logIn, signUp, validateUniqueUserId };
