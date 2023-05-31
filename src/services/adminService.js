const { User } = require('../model/models/index');
const { AppError } = require('../middlewares/errorHandler');
const getBanTime = require('../utils/getBanTime');

// [ 관리자 ] 정보 조회
/** (관리자 userId ) */
const getAdmin = async (user_id) => {
  try {
    const foundUser = await User.findOne({ user_id });

    if (!foundUser) return new AppError(400, '유효하지 않은 아이디입니다.');

    if (!admin_id)
      return new AppError(403, '관리자가 아닙니다. 접근 권한이 없습니다.');

    return {
      statusCode: 200,
      message: '관리자 정보 조회 성공',
      adminData: {
        admin_id: foundUser.admin_id,
        user_id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        createdAt: foundUser.createdAt,
      },
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, '관리자 정보 조회 실패');
  }
};

// [ 관리자 ] 유저 로그인 정지
/**(아이디, 유저 유형, 정지 대상 아이디) */
const banUser = async (userId, role, banUserId) => {
  try {
    const foundUser = await User.findOne({ userId });

    if (
      foundUser.role === 'user' &&
      foundUser.role === role &&
      role !== 'admin' &&
      role !== 'manager'
    )
      return new AppError(403, '관리자 권한이 없습니다.');

    const foundBanUser = await User.findOne({ userId: banUserId });

    if (!foundBanUser)
      return new AppError(400, '존재하지 않는 유저입니다. 다시 선택해 주세요.');

    if (foundBanUser.role === 'manager' || foundBanUser.role === 'admin')
      return new AppError(
        400,
        '총 관리자 및 매니저는 서로 정지 시킬 수 없습니다.'
      );

    if (foundBanUser) {
      const currentDate = new Date();
      const banEndDate = getBanTime(currentDate, 2000);
      // 시간 1000 단위, 1000당 1일, 프론트에서 받아야될듯

      foundBanUser.isBanned = true;
      foundBanUser.banEndDate = banEndDate;
      await foundBanUser.save();

      return { statusCode: 201, message: '정지 성공' };
    }
  } catch (error) {
    console.error(error);
    throw new AppError(500, '회원 정지 실패');
  }
};

// [ 관리자 ] 일반 유저 직위 변경 user -> manager
/** (관리자 아이디, 아이디의 직위, 직위변경하려고 하는 유저의 아이디) */
const updateUserRole = async (userId, role, updateUser) => {
  try {
    const foundAdmin = await User.findOne({ userId });
    console.log(role, foundAdmin.role);
    if (!foundAdmin)
      return new AppError(400, '존재하지 않는 관리자 아이디입니다.');
    if (role !== foundAdmin.role)
      return new AppError(
        403,
        '유저의 권한이 서버의 데이터와 일치하지 않습니다.'
      );
    if (foundAdmin.role !== 'admin')
      return new AppError(403, '총 관리자만 접근 가능합니다.');

    const foundUser = await User.findOne({ userId: updateUser });

    if (!foundUser)
      return new AppError(400, '존재하지 않는 유저 아이디 입니다.');
    if (foundUser.role === 'manager')
      return new AppError(400, '이미 직위가 manager 입니다.');

    const updateData = {
      role: 'manager',
    };

    const updatedUser = await User.findOneAndUpdate(
      { userId: updateUser },
      { $set: updateData },
      { new: true }
    );

    return {
      statusCode: 201,
      message: '유저 직위 변경 성공',
      data: updatedUser,
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, '유저 직위 변경 실패');
  }
};

module.exports = { getAdmin, banUser, updateUserRole };
