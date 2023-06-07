const { Ground, User } = require('../model/models/index');
const { AppError } = require('../middlewares/errorHandler');
const { createGroundId } = require('../utils/createIndex');
const toString = require('../utils/toString');

// [ 전체 풋볼장 조회 ]
const getAllGrounds = async () => {
  try {
    const grounds = await Ground.find();
    return {
      statusCode: 200,
      message: '전체 풋볼장 조회 성공',
      grounds: grounds,
    };
  } catch (error) {
    console.error('풋볼장 전체 목록을 가져오는 중에 오류 발생', error);
    return new AppError(500, 'Internal Server Error');
  }
};

// [ 위치, 날짜로 필터링된 풋볼장 조회]
const getFilteredGrounds = async (location, date) => {
  try {
    const grounds = await Ground.find();
    // 필터링 로직 구현해서 해당 조건에 맞는 풋볼장 데이터 조회
    const filteredGrounds = grounds.filter((ground) => {
      if (
        location &&
        (ground.location.latitude !== location.latitude ||
          ground.location.longitude !== location.longitude)
      ) {
        return false;
      }

      if (date && ground.timestamp !== date) {
        return false;
      }
      return true;
    });
    // 필터링된 결과 반환
    return {
      statusCode: 200,
      message: '필터링된 풋볼장 조회 성공',
      filteredGrounds: filteredGrounds,
    };
  } catch (error) {
    console.error('풋볼장 필터링중에 오류 발생', error);
    return new AppError(500, 'Internal Server Error');
  }
};

// [ 풋볼장 즐겨찾기에 추가 ]
const addFavorites = async (user) => {
  const { groundId, userId } = user;
  try {
    const foundUser = await User.findOne({ user_id: userId });

    if (!foundUser) return new AppError(400, '존재하지 않는 아이디입니다.');

    const userObjectId = foundUser._id;

    // 풋볼장 조회
    const foundGround = await Ground.findOne({ ground_id: groundId });

    if (!foundGround) return new AppError(400, '풋볼장을 찾을 수 없습니다.');

    // 이미 즐겨찾기에 추가되어 있는지 확인
    const usersFavorites = foundGround.usersFavorites;

    const favoritesFiltered = usersFavorites.filter(
      (v) => toString(v) === toString(userObjectId)
    );

    if (favoritesFiltered.length > 0)
      return new AppError(400, '이미 즐겨찾기에 추가되어있습니다.');

    // 즐겨찾기에 추가
    usersFavorites.push(userObjectId);

    // 데이터 업데이트
    const updateData = {
      ground_id: groundId,
      name: foundGround.name,
      location: foundGround.location,
      price: foundGround.price,
      rating: foundGround.rating,
      usersFavorites: usersFavorites,
    };

    const updatedFavorites = await Ground.findOneAndUpdate(
      { ground_id: groundId },
      { $set: updateData },
      { new: true }
    );

    return {
      statusCode: 201,
      message: '즐겨찾기에 추가되었습니다.',
      data: updatedFavorites,
    };
  } catch (error) {
    console.error('즐겨찾기 추가 중에 오류 발생', error);
    return new AppError(500, 'Internal Server Error');
  }
};

// [ 풋볼장 즐겨찾기에서 삭제 ]

const removeFavorites = async (user) => {
  const { groundId, userId } = user;
  try {
    const foundUser = await User.findOne({ user_id: userId });

    if (!foundUser) return new AppError(400, '존재하지 않는 아이디입니다.');

    const userObjectId = foundUser._id;

    // 풋볼장 조회
    const foundGround = await Ground.findOne({ ground_id: groundId });
    if (!foundGround) return new AppError(400, '풋볼장을 찾을 수 없습니다.');

    // 유저 아이디와 일치하지 않는 즐겨찾기만 남기기
    const updatedFavorites = foundGround.usersFavorites.filter(
      (v) => toString(v) !== toString(userObjectId)
    );

    // 즐겨찾기 업데이트
    foundGround.usersFavorites = updatedFavorites;
    await foundGround.save();

    return {
      statusCode: 204,
      message: '즐겨찾기에서 삭제되었습니다.',
      data: updatedFavorites,
    };
  } catch (error) {
    console.log('즐겨찾기 삭제 중에 오류 발생', error);
    return new AppError(500, 'Internal Server Error');
  }
};

module.exports = {
  getAllGrounds,
  getFilteredGrounds,
  addFavorites,
  removeFavorites,
};
