const { User, WithdrawnUser } = require('../model/models/index');
const { AppError } = require('../middlewares/errorHandler');
const bcrypt = require('bcrypt');
const { BCRYPT_SALT_ROUNDS } = require('../envconfig');

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

    //탈퇴 db 저장
    const withdrawnUserData = {
      userId: foundUser.userId,
      userEmail: foundUser.userEmail,
      userName: foundUser.userName,
      withdrawalDate: new Date(),
    };

    await WithdrawnUser.create(withdrawnUserData);

    await User.deleteOne({ userId });

    return { statusCode: 204, message: '회원탈퇴 되었습니다.' };
  } catch (error) {
    console.error(error);
    return new AppError(500, '회원탈퇴 실패');
  }
};

module.exports = {
  getUser,
  updateUser,
  deleteUser,
};
