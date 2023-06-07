const userService = require('../services/userService');
const {
  AppError,
  errorMessageHandler,
} = require('../middlewares/errorHandler');
const {
  getUserInfoSchema,
  updateUserInfoSchema,
  deleteUserInfoSchema,
} = require('../validator/userValidator');

//[ 유저정보 조회 ]
const getUserInfo = async (req, res, next) => {
  const id = req.user.user_id;
  const { error } = getUserInfoSchema.validate({ id });

  if (error) {
    const message = errorMessageHandler(error, value);
    return next(new AppError(400, message));
  }

  try {
    const result = await userService.getUser(id);

    if (result.statusCode !== 200) {
      return next(new AppError(result.statusCode, result.message));
    }

    res.status(200).json({
      message: result.message,
      userData: result.userData,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

//[ 유저정보 수정 ]
const updateUserInfo = async (req, res, next) => {
  const { user_id } = req.user;
  const { password, nick_name, email, phone_number } = req.body;

  const { error } = updateUserInfoSchema.validate({
    user_id,
    password,
    nick_name,
    email,
    phone_number,
  });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const result = await userService.updateUser({
      user_id,
      password,
      nick_name,
      email,
      phone_number,
    });

    if (result.statusCode !== 200) {
      return next(new AppError(result.statusCode, result.message));
    }

    res.status(200).json({
      message: '회원정보 수정 성공',
      updateData: result.data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

//[ 유저 회원탈퇴 ]
const deleteUserInfo = async (req, res, next) => {
  const { user_id } = req.user;
  const { password } = req.body;

  const { error } = deleteUserInfoSchema.validate({ user_id, password });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const result = await userService.deleteUser(user_id, password);

    if (result.statusCode !== 204) {
      return next(new AppError(result.statusCode, result.message));
    }

    res.status(204).json({
      message: result.message,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

module.exports = {
  getUserInfo,
  updateUserInfo,
  deleteUserInfo,
};
