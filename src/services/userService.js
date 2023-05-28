const { User } = require('../model/models/index');
const { AppError } = require('../middlewares/errorHandler');
const getBanTime = require('../utils/getBanTime');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
  BCRYPT_SALT_ROUNDS,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} = require('../envconfig');

//[ 비밀번호 해싱 ]
/** 패스워드 */
const hashPassword = async (password) => {
  const saltRounds = parseInt(BCRYPT_SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

//[ 유저 회원가입 ]
/** (유저 입력 formdata) */
const signUpUser = async (formData) => {
  const { userId, password, userName, userEmail } = formData;
  try {
    const foundUser = await User.findOne({
      $or: [{ userId }, { userName }, { userEmail }],
    });

    // 이미 사용 중이라면 데이터 추가 안하고 에러를 반환하기 위해 겹치는 요소 컨트롤러로.
    if (foundUser) {
      if (foundUser.userId === userId) {
        return new AppError(400, '이미 존재하는 아이디입니다.');
      } else if (foundUser.userName === userName) {
        return new AppError(400, '이미 존재하는 닉네임입니다.');
      } else if (foundUser.userEmail === userEmail) {
        return new AppError(400, '이미 존재하는 이메일입니다.');
      }
    }

    const hashedPassword = await hashPassword(password);

    const addUser = await User.create({
      userId,
      password: hashedPassword,
      userName,
      userEmail,
    });

    await addUser.save();

    return { statusCode: 201, message: '회원가입에 성공하였습니다.' };
  } catch (error) {
    console.error(error);
    throw new AppError(500, '회원가입에 실패하였습니다.');
  }
};

//[유저 로그인]
/** (아이디, 패스워드)*/
const logInUser = async (userId, password) => {
  try {
    const foundUser = await User.findOne({ userId });

    if (!foundUser) {
      return new AppError(400, '존재하지 않는 아이디입니다.');
    }

    const isMatched = await bcrypt.compare(password, foundUser.password);

    if (!isMatched) {
      return new AppError(400, '비밀번호가 일치하지 않습니다.');
    }

    if (foundUser.isBanned) {
      const { isBanned, banEndDate } = foundUser;
      const currentDate = new Date();

      if (banEndDate && banEndDate <= currentDate) {
        foundUser.isBanned = false;
        foundUser.banEndDate = null;
        await foundUser.save();
      } else {
        const dateString = banEndDate.toString();
        const newDate = new Date(dateString);

        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          weekday: 'long',
          timeZoneName: 'long',
        };

        const dateFormatter = new Intl.DateTimeFormat('ko-KR', options);
        const translatedDate = dateFormatter.format(newDate);

        const [year, month, date, day, type, hour, minute] =
          translatedDate.split(' ');

        return new AppError(
          403,
          `${year} ${month} ${date} ${day} ${type} ${hour} ${minute} 까지 로그인 정지입니다.`
        );
      }
    }

    const payload = {
      userId: foundUser.userId,
      password: foundUser.password,
    };

    //[accessToken 생성]
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    //[refreshToken 생성]
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    return {
      accessToken,
      refreshToken,
      userData: {
        userId: foundUser.userId,
        userName: foundUser.userName,
        userEmail: foundUser.userEmail,
        favoritePlaygrounds: foundUser.favoritePlaygrounds,
        isBanned: foundUser.isBanned,
        banEndDate: foundUser.banEndDate,
        createdAt: foundUser.createdAt,
      },
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, '로그인에 실패하였습니다');
  }
};

//[ 유저정보 조회 ]
/** (유저아이디) */
const getUser = async (userId) => {
  try {
    const foundUser = await User.findOne({ userId });

    if (!foundUser) return new AppError(400, '존재하지 않는 아이디 입니다.');

    return {
      statusCode: 200,
      message: '마이페이지 조회 성공',
      userData: {
        userId: foundUser.userId,
        userName: foundUser.userName,
        favoritePlaygrounds: foundUser.favoritePlaygrounds,
        role: foundUser.role,
        createdAt: foundUser.createdAt,
      },
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, '마이페이지 조회 실패');
  }
};

//[ 유저정보 수정 ]
/** (수정 formData) */
const updateUser = async (formData) => {
  const { userId, password, userName, userEmail } = formData;
  try {
    const foundUser = await User.findOne({ userId });

    if (!foundUser) {
      return new AppError(400, '존재하지 않는 아이디입니다.');
    }

    if (foundUser.userName === userName) {
      return new AppError(400, '이미 존재하는 닉네임입니다.');
    }

    if (foundUser.userEmail === userEmail) {
      return new AppError(400, '이미 존재하는 이메일입니다.');
    }

    const updateData = {
      userId: userId,
      password: await bcrypt.hash(password, Number(BCRYPT_SALT_ROUNDS)),
      userName: userName,
      userEmail: userEmail,
    };

    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true }
    );

    return updatedUser;
  } catch (error) {
    console.error(error);
    throw new AppError(500, '회원정보 수정 실패');
  }
};

// [ 유저 회원탈퇴 ]
/** (유저아이디, 패스워드) */
const deleteUser = async (userId, password) => {
  try {
    const foundUser = await User.findOne({ userId });

    if (!foundUser) return new AppError(400, '존재하지 않는 정보 입니다.');

    const isMatched = await bcrypt.compare(password, foundUser.password);
    if (!isMatched) {
      return new AppError(400, '비밀번호가 일치하지 않습니다.');
    }

    await User.deleteOne({ userId });

    return { statusCode: 204, message: '회원탈퇴 되었습니다.' };
  } catch (error) {
    console.error(error);
    return new AppError(500, '회원탈퇴 실패');
  }
};

// [ 관리자 ] 정보 조회
/** (관리자 userId ) */
const getAdmin = async (userId) => {
  try {
    const foundAdmin = await User.findOne({ userId });

    if (!foundAdmin)
      return new AppError(400, '유효하지 않은 관리자 아이디입니다.');

    if (foundAdmin.role === 'user')
      return new AppError(403, '관리자가 아닙니다. 접근 권한이 없습니다.');

    return {
      statusCode: 200,
      message: '관리자 정보 조회 성공',
      adminData: {
        userId: foundAdmin.userId,
        userNamd: foundAdmin.userName,
        userEmail: foundAdmin.userEmail,
        role: foundAdmin.role,
        createdAt: foundAdmin.createdAt,
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
      role !== 'admin'
    )
      return new AppError(403, '관리자 권한이 없습니다.');

    const foundBanUser = await User.findOne({ userId: banUserId });

    if (!foundBanUser)
      return new AppError(400, '존재하지 않는 유저입니다. 다시 선택해 주세요.');

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

module.exports = {
  signUpUser,
  logInUser,
  getUser,
  updateUser,
  deleteUser,
  getAdmin,
  banUser,
};
