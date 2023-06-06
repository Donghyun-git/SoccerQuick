const { User, WithdrawnUser } = require('../model/models/index');
const { AppError } = require('../middlewares/errorHandler');
const bcrypt = require('bcrypt');
const { BCRYPT_SALT_ROUNDS } = require('../envconfig');

//[ 유저정보 조회 ]
/** (유저아이디) */
const getUser = async (user_id) => {
  try {
    const foundUser = await User.findOne({ user_id });

    if (!foundUser) return new AppError(404, '존재하지 않는 아이디 입니다.');

    return {
      statusCode: 200,
      message: '마이페이지 조회 성공',
      userData: {
        user_id: foundUser.user_id,
        name: foundUser.name,
        nick_name: foundUser.nick_name,
        email: foundUser.email,
        phone_number: foundUser.phone_number,
        favoritePlaygrounds: foundUser.favoritePlaygrounds,
        role: foundUser.role,
        gender: foundUser.gender,
        createdAt: foundUser.createdAt,
      },
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

//[ 유저정보 수정 ]
/** (수정 formData) */

// 기존에 등록되어있던 정보는 예외처리 x
const updateUser = async (formData) => {
  const { user_id, password, nick_name, email, phone_number } = formData;
  try {
    const foundUser = await User.findOne({ user_id });

    if (!foundUser) {
      return new AppError(404, '존재하지 않는 아이디입니다.');
    }

    const updateData = {
      password: await bcrypt.hash(password, Number(BCRYPT_SALT_ROUNDS)),
      phone_number,
    };

    if (foundUser.nick_name !== nick_name) {
      const existingUser = await User.findOne({ nick_name });
      if (existingUser) {
        return new AppError(400, '이미 존재하는 닉네임입니다.');
      }
      updateData.nick_name = nick_name;
    } else {
      // 기존에 가지고 있던 데이터인 경우.
      updateData.nick_name = nick_name;
    }

    if (foundUser.email !== email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return new AppError(400, '이미 존재하는 이메일입니다.');
      }
      updateData.email = email;
    } else {
      updateData.email = email;
    }

    const updatedUser = await User.findOneAndUpdate(
      { user_id },
      { $set: updateData },
      { new: true }
    );

    return {
      statusCode: 200,
      message: '회원정보 수정 성공',
      data: updatedUser,
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

// [ 유저 회원탈퇴 ]
/** (유저아이디, 패스워드) */
const deleteUser = async (user_id, password) => {
  const { nanoid } = await import('nanoid');

  try {
    const foundUser = await User.findOne({ user_id });

    if (!foundUser) return new AppError(404, '존재하지 않는 정보 입니다.');

    const isMatched = await bcrypt.compare(password, foundUser.password);
    if (!isMatched) {
      return new AppError(400, '비밀번호가 일치하지 않습니다.');
    }

    //탈퇴 db 저장
    const nano_id = nanoid(4);

    const withdrawnUserData = {
      user_id: `${foundUser.user_id}${nano_id}`,
      email: foundUser.email,
      name: foundUser.name,
      withdrawalDate: new Date(),
    };

    await WithdrawnUser.create(withdrawnUserData);

    await User.deleteOne({ user_id });

    return { statusCode: 204, message: '회원탈퇴 되었습니다.' };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

module.exports = {
  getUser,
  updateUser,
  deleteUser,
};
