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

// [ 유저 로그인 정지 ]

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
        return 'id';
      } else if (foundUser.userName === userName) {
        return 'name';
      } else if (foundUser.userEmail === userEmail) {
        return 'email';
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

    return;
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
      return new AppError(400, 'incorrectId');
    }

    const isMatched = await bcrypt.compare(password, foundUser.password);

    if (!isMatched) {
      return new AppError(400, 'incorrectPassword');
    }

    if (foundUser.isBanned) {
      const { banEndDate } = foundUser;
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
        `${year} ${month} ${date} ${day} ${type} ${hour} ${minute}분 까지 로그인 정지입니다.`
      );
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
    console.error(error, 'catch문');
    return new AppError(500, '로그인에 실패하였습니다');
  }
};

//[ 유저정보 수정 ]
/** (수정 formData) */
const updateUser = async (formData) => {
  const { userId, password, userName, userEmail } = formData;
  try {
    const foundUser = await User.findOne({ userId });

    if (!foundUser) {
      return null;
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

// [ 관리자 ] 유저 로그인 정지
/**(아이디, 유저 유형, 정지 대상 아이디) */
const banUser = async (userId, role, banUserId) => {
  try {
    const foundUser = await User.findOne({ userId });

    if (
      foundUser.role === 'user' &&
      foundUser.role === role &&
      role !== 'admin'
    ) {
      return 'notAdmin';
    }

    const foundBanUser = await User.findOne({ userId: banUserId });

    if (!foundBanUser) return 'Not Found User';

    if (foundBanUser) {
      const currentDate = new Date();
      const banEndDate = getBanTime(currentDate, 2000);
      // 시간 1000 단위, 1000당 1일, 프론트에서 받아야될듯

      foundBanUser.isBanned = true;
      foundBanUser.banEndDate = banEndDate;
      await foundBanUser.save();

      return;
    }
  } catch (error) {
    console.error(error);
    throw new AppError(500, '회원 정지 실패');
  }
};

module.exports = {
  signUpUser,
  logInUser,
  updateUser,
  banUser,
};
