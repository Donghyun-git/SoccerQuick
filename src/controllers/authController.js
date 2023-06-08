const authService = require('../services/authService');
const {
  AppError,
  errorMessageHandler,
} = require('../middlewares/errorHandler');
const {
  signUpSchema,
  logInSchema,
  validateUniqueUserIdSchema,
  validatePasswordSchema,
} = require('../validator/authValidator');

//[ 유저 회원가입 ]
const signUp = async (req, res, next) => {
  const { user_id, password, name, nick_name, email, phone_number, gender } =
    req.body;

  const { error } = signUpSchema.validate({
    user_id,
    password,
    name,
    nick_name,
    email,
    phone_number,
    gender,
  });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const result = await authService.signUp({
      user_id,
      password,
      name,
      nick_name,
      email,
      phone_number,
      gender,
    });

    if (result.statusCode !== 201)
      return next(new AppError(result.statusCode, result.message));

    res.status(201).json({ message: result.message });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

//[ 유저 로그인 ]
const logIn = async (req, res, next) => {
  const { user_id, password } = req.body;

  const { error } = logInSchema.validate({ user_id, password });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const result = await authService.logIn(user_id, password);

    if (result.statusCode !== 200)
      return next(new AppError(result.statusCode, result.message));

    const { accessToken, refreshToken, userData } = result;
    const {
      nick_name,
      name,
      email,
      phone_number,
      favoritePlaygrounds,
      role,
      gender,
      isBanned,
      banEndDate,
      createdAt,
    } = userData;

    //[accessToken, refreshToken 각각 response 헤더, 쿠키 세팅]
    res.cookie('accessToken', accessToken, {
      httpOnly: false,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: false, //배포 시 httpOnly: true, secure: true,
    });

    res.status(200).json({
      message: '로그인 성공',
      userData: {
        user_id: userData.user_id,
        name,
        nick_name,
        email,
        phone_number,
        role,
        gender,
        favoritePlaygrounds,
        isBanned,
        banEndDate,
        createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// [ 유저 로그아웃 ]
const logOut = async (req, res, next) => {
  try {
    const result = await authService.logOut(req, res);

    if (result.statusCode !== 200)
      return next(new AppError(result.statusCode, result.message));

    res.status(200).json({
      message: result.message,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
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

    if (result.statusCode !== 200)
      return next(new AppError(result.statusCode, result.message));

    res.status(200).json({
      message: result.message,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// [비밀번호 체크]   유저 아이디는 나중에 토큰으로 받는다.
const validatePassword = async (req, res, next) => {
  const { user_id, password } = req.body;

  const { error } = validatePasswordSchema.validate({ user_id, password });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const result = await authService.validatePassword(user_id, password);

    if (result.statusCode !== 200)
      return next(new AppError(result.statusCode, result.message));

    res.status(200).json({
      message: result.message,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

module.exports = {
  logIn,
  logOut,
  signUp,
  validateUniqueUserId,
  validatePassword,
};
