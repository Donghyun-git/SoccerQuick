const adminService = require('../services/adminService');
const {
  AppError,
  errorMessageHandler,
} = require('../middlewares/errorHandler');
const {
  getAllUserInfoSchema,
  adminBanUserSchema,
  updateUserRoleSchema,
} = require('../validator/adminValidator');

// [ 관리자 ] 유저 전체 정보 조회
const getAllUserInfo = async (req, res, next) => {
  const { id } = req.params;

  const { error } = getAllUserInfoSchema.validate({ id });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const result = await adminService.getAllUserInfo(id);

    if (result.statusCode === 400 || result.statusCode === 403)
      return next(new AppError(result.statusCode, result.message));

    res.status(200).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    return next(500, '관리자 정보 조회 실패');
  }
};

// [ 관리자 ] 유저 로그인 정지
const adminBanUser = async (req, res, next) => {
  const { user_id, banUserId } = req.body;

  const { error } = adminBanUserSchema.validate({ user_id, banUserId });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const result = await adminService.banUser(user_id, banUserId);

    if (result.statusCode === 400 || result.statusCode === 403)
      return next(new AppError(result.statusCode, result.message));

    res.status(200).json({
      message: result.message,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, '정지 실패, 서버 에러'));
  }
};

// [ 관리자 ] 일반 유저 직위 변경 user -> manager
const updateUserRole = async (req, res, next) => {
  const { user_id, updateUser } = req.body;

  const { error } = updateUserRoleSchema.validate({ user_id, updateUser });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const result = await adminService.updateUserRole(user_id, updateUser);

    if (result.statusCode === 400 || result.statusCode === 403)
      return next(new AppError(result.statusCode, result.message));

    res.status(200).json({
      message: result.message,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, '직위 변경 실패'));
  }
};

module.exports = { getAllUserInfo, adminBanUser, updateUserRole };
