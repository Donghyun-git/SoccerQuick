const { User } = require('../model/models/index');
const { AppError } = require('../middlewares/errorHandler');
const hashPassword = require('../utils/hashPassword');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} = require('../envconfig');

//[ 유저 회원가입 ]
/** (유저 입력 formdata) */
const signUpUser = async (formData) => {
  const { user_id, password, name, nick_name, email, phone_number } = formData;
  try {
    const foundUser = await User.findOne({
      $or: [{ user_id }, { name }, { email }],
    });
    // 이미 사용 중이라면 데이터 추가 안하고 에러를 반환하기 위해 겹치는 요소 컨트롤러로.
    if (foundUser) {
      if (foundUser.user_id === user_id) {
        return new AppError(400, '이미 존재하는 아이디입니다.');
      }

      if (foundUser.nick_name === nick_name) {
        return new AppError(400, '이미 존재하는 닉네임입니다.');
      }

      if (foundUser.email === email) {
        return new AppError(400, '이미 존재하는 이메일입니다.');
      }
    }

    const hashedPassword = await hashPassword(password);

    const addUser = await User.create({
      user_id: user_id,
      password: hashedPassword,
      name,
      nick_name,
      email,
      phone_number,
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
const logInUser = async (user_id, password) => {
  try {
    const foundUser = await User.findOne({ user_id });

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
      user_id: foundUser.user_id,
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
        user_id: foundUser.user_id,
        name: foundUser.name,
        nick_name: foundUser.nick_name,
        email: foundUser.email,
        phone_number: foundUser.phone_number,
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

//[ 회원가입 아이디 중복 체크 ]
const validateUniqueUserId = async (user_id) => {
  try {
    const foundUser = await User.findOne({ user_id });

    if (foundUser) return new AppError(400, '이미 존재하는 아이디입니다.');

    return { message: '사용할 수 있는 아이디입니다!' };
  } catch (error) {
    console.error(error);
    return new AppError(500, '아이디 중복 체크 실패');
  }
};

module.exports = { logInUser, signUpUser, validateUniqueUserId };
