const adminService = require('../services/adminService');
const { AppError } = require('../middlewares/errorHandler');

// [ 관리자 ] 정보 조회
const getAdminInfo = async (req, res, next) => {
  const { id } = req.params;

  if (!id) return next(new AppError(400, '아이디를 입력해주세요'));

  try {
    const result = await adminService.getAdmin(id);

    if (result.statusCode === 400)
      return next(new AppError(result.statusCode, result.message));
    if (result.statusCode === 403)
      return next(new AppError(result.statusCode, result.message));

    res.status(result.statusCode).json({
      message: result.message,
      adminData: result.adminData,
    });
  } catch (error) {
    console.error(error);
    return next(500, '관리자 정보 조회 실패');
  }
};

// [ 관리자 ] 유저 로그인 정지
const adminBanUser = async (req, res, next) => {
  const { userId, role, banUserId } = req.body;

  try {
    const result = await adminService.banUser(userId, role, banUserId);

    if (result.statusCode === 403)
      return next(new AppError(403, result.message));

    if (result.statusCode === 400)
      return next(new AppError(400, result.message));

    res.status(result.statusCode).json({
      message: result.message,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, '정지 실패, 서버 에러'));
  }
};

// [ 관리자 ] 일반 유저 직위 변경 user -> manager
const updateUserRole = async (req, res, next) => {
  const { userId, role, updateUser } = req.body;

  if (!userId)
    return next(new AppError(400, '관리자 아이디를 같이 보내주세요.'));
  if (!role) return next(new AppError(400, '권한을 같이 보내주세요.'));
  if (!updateUser)
    return next(
      new AppError(400, '직위를 바꾸려는 유저의 아이디를 입력해주세요.')
    );

  try {
    const result = await adminService.updateUserRole(userId, role, updateUser);

    if (result.statusCode === 400)
      return next(new AppError(400, result.message));
    if (result.statusCode === 403)
      return next(new AppError(403, result.message));

    res.status(201).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, '직위 변경 실패'));
  }
};

module.exports = { getAdminInfo, adminBanUser, updateUserRole };
