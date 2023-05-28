const userService = require('../services/userService');
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
    const result = await userService.signUpUser(formData);

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
    const result = await userService.logInUser(userId, password);

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

//[ 유저정보 조회 ]
const getUserInfo = async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) return next(new AppError(400, '아이디가 입력되지 않았습니다.'));

  try {
    const result = await userService.getUser(userId);

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

  const { userId, password, userName, userEmail } = req.body;

  if (!userId) {
    return next(new AppError(400, '아이디를 입력해주세요'));
  }

  if (!password) {
    return next(new AppError(400, '수정된 패스워드 입력은 필수 사항입니다!'));
  }

  if (!userName) {
    return next(new AppError(400, '닉네임을 입력해주세요.'));
  }

  if (!userEmail) {
    return next(new AppError(400, '이메일을 입력해주세요.'));
  }

  const formData = req.body;

  try {
    const newUser = await userService.updateUser(formData);

    if (newUser.statusCode === 400) {
      return next(new AppError(400, newUser.message));
    }

    res.status(200).json({
      message: '회원정보 수정 성공',
      updateData: newUser,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, '회원 정보 수정 실패'));
  }
};

//[ 유저 회원탈퇴 ]
const deleteUserInfo = async (req, res, next) => {
  const { userId, password } = req.body;

  if (!userId) return next(new AppError(400, '아이디를 입력해주세요.'));

  if (!password) return next(new AppError(400, '비밀번호를 입력해주세요.'));

  try {
    const result = await userService.deleteUser(userId, password);

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

// [ 관리자 ] 정보 조회
const getAdminInfo = async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) return next(new AppError(400, '아이디를 입력해주세요'));

  try {
    const result = await userService.getAdmin(userId);

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
    const result = await userService.banUser(userId, role, banUserId);

    if (result.statusCode === 403)
      return next(new AppError(403, '관리자 권한이 없습니다.'));

    if (result.statusCode === 400)
      return next(new AppError(400, '존재하지 않는 유저 입니다!'));

    res.status(result.statusCode).json({
      message: result.message,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, '정지 실패, 서버 에러'));
  }
};

module.exports = {
  signUp,
  logIn,
  getUserInfo,
  updateUserInfo,
  deleteUserInfo,
  getAdminInfo,
  adminBanUser,
};
