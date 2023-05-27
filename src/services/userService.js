const { User } = require('../model/models/index');
const { AppError } = require('../middlewares/errorHandler');
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
/** (유저 입력 formdata, next 함수) */
const signUpUser = async (formData, next) => {
  const { userId, password, userName, userEmail } = formData;
  try {
    const foundUser = await User.findOne({
      $or: [{ userId }, { userName }, { userEmail }],
    });

    if (foundUser) {
      if (foundUser.userId === userId) {
        return next(new AppError(400, '이미 존재하는 아이디 입니다.'));
      } else if (foundUser.userName === userName) {
        return next(new AppError(400, '이미 존재하는 닉네임 입니다.'));
      } else if (foundUser.userEmail === userEmail) {
        return next(new AppError(400, '이미 존재하는 이메일 입니다.'));
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
/** (아이디, 패스워드, next 함수)*/
const logInUser = async (userId, password, next) => {
  try {
    const foundUser = await User.findOne({ userId });

    if (!foundUser) {
      return next(new AppError(400, '존재하지 않는 아이디입니다.'));
    }

    const isMatched = await bcrypt.compare(password, foundUser.password);

    if (!isMatched) {
      return next(new AppError(400, '비밀번호가 일치하지 않습니다.'));
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
    throw new AppError(500, '로그인에 실패하였습니다');
  }
};

//[ 유저정보 수정 ]
/** (아이디, 패스워드, next 함수) */
const updateUser = async (userId, password, next) => {
  try {
    const foundUser = User.findOne({ userId });

    if (!foundUser) {
      return next(new AppError(400, '일치하는 아이디가 없습니다.'));
    }

    const updateData = {};

    if (password) {
      updateData.password = await bcrypt.hash(
        password,
        Number(BCRYPT_SALT_ROUNDS)
      );
    }

    const newUser = await User.updateOne(
      { userId },
      { $set: updateData },
      { new: true }
    );

    return newUser;
  } catch (error) {
    console.error(error);
    next(new AppError(500, '회원정보 수정에 실패하였습니다.'));
  }
};

module.exports = {
  signUpUser,
  logInUser,
  updateUser,
};
