const userService = require('../services/userService');
const { AppError } = require('../middlewares/errorHandler');

//[ 유저정보 조회 ]
const getUserInfo = async (req, res, next) => {
  const { id } = req.params;

  if (!id) return next(new AppError(400, '아이디가 입력되지 않았습니다.'));

  try {
    const result = await userService.getUser(id);

    if (result.status === 400) {
      return next(new AppError(result.status, result.message));
    }

    res.status(result.statusCode).json({
      message: result.message,
      userData: result.userData,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, '마이페이지 조회 실패'));
  }
};

//[ 유저정보 수정 ]
const updateUserInfo = async (req, res, next) => {
  //나중에 tokenValidator 미들웨어에서 토큰 검증하고 나서 유저 정보 데이터를 따로 받아야 한다.
  // const { userId } = req.user;

  const { user_id, password, nick_name, email, phone_number } = req.body;

  if (!user_id) {
    return next(new AppError(400, '아이디를 입력해주세요'));
  }

  if (!password) {
    return next(new AppError(400, '수정된 패스워드 입력은 필수 사항입니다!'));
  }

  if (!nick_name) {
    return next(new AppError(400, '닉네임을 입력해주세요.'));
  }

  if (!email) {
    return next(new AppError(400, '이메일을 입력해주세요.'));
  }

  try {
    const result = await userService.updateUser({
      user_id,
      password,
      nick_name,
      email,
      phone_number,
    });

    if (result.statusCode === 400) {
      return next(new AppError(400, result.message));
    }

    res.status(200).json({
      message: '회원정보 수정 성공',
      updateData: result.data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, '회원 정보 수정 실패'));
  }
};

//[ 유저 회원탈퇴 ]
const deleteUserInfo = async (req, res, next) => {
  const { user_id, password } = req.body;

  if (!user_id) return next(new AppError(400, '아이디를 입력해주세요.'));

  if (!password) return next(new AppError(400, '비밀번호를 입력해주세요.'));

  try {
    const result = await userService.deleteUser(user_id, password);

    if (result.statusCode === 400) {
      return next(new AppError(result.statusCode, result.message));
    }

    res.status(result.statusCode).json({
      message: result.message,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, '회원탈퇴 실패'));
  }
};

module.exports = {
  getUserInfo,
  updateUserInfo,
  deleteUserInfo,
};
