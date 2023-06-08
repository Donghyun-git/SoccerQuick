const { Dom, User } = require('../model/models/index');
const { AppError } = require('../middlewares/errorHandler');
const toString = require('../utils/toString');

// [ 전체 풋볼장 조회 ]
const getAllDoms = async () => {
  try {
    const doms = await Dom.find();
    return {
      statusCode: 200,
      message: '전체 풋볼장 조회 성공',
      data: doms,
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

// [ 위치로 필터링된 풋볼장 조회]
const getFilteredDoms = async (location) => {
  try {
    // const doms = await Dom.find();
    // // 필터링 로직 구현해서 해당 조건에 맞는 풋볼장 데이터 조회
    // const filteredDoms = doms.filter((dom) => {
    //   if (
    //     location &&
    //     (ground.location.latitude !== location.latitude ||
    //       ground.location.longitude !== location.longitude)
    //   ) {
    //     return false;
    //   }
    //   if (date && ground.timestamp !== date) {
    //     return false;
    //   }
    //   return true;
    // }
    // );
    // // 필터링된 결과 반환
    // return {
    //   statusCode: 200,
    //   message: '필터링된 풋볼장 조회 성공',
    //   data: filteredDoms,
    // };
  } catch (error) {
    console.error('풋볼장 필터링중에 오류 발생', error);
    return new AppError(500, 'Internal Server Error');
  }
};

// [ 풋볼장 즐겨찾기에 추가 ]
const addFavoriteDoms = async (dom_id, user_id) => {
  try {
    const foundUser = await User.findOne({ user_id });

    if (!foundUser) return new AppError(400, '존재하지 않는 아이디입니다.');

    const userObjectId = foundUser._id;

    // 풋볼장 조회
    const foundDom = await Dom.findOne({ dom_id });

    if (!foundDom) return new AppError(400, '풋볼장을 찾을 수 없습니다.');

    // 이미 즐겨찾기에 추가되어 있는지 확인
    const usersFavorites = foundDom.usersFavorites;

    const favoritesFiltered = usersFavorites.filter(
      (v) => toString(v) === toString(userObjectId)
    );

    if (favoritesFiltered.length > 0)
      return new AppError(400, '이미 즐겨찾기에 추가되어있습니다.');

    // 즐겨찾기에 추가
    usersFavorites.push(userObjectId);

    // 데이터 업데이트
    // const updateData = {
    //   dom_id,
    //   name: foundGround.name,
    //   location: foundGround.location,
    //   price: foundGround.price,
    //   rating: foundGround.rating,
    //   usersFavorites: usersFavorites,
    // };

    const updatedFavorites = await Dom.findOneAndUpdate(
      { dom_id },
      { $set: updateData },
      { new: true }
    );

    return {
      statusCode: 200,
      message: '즐겨찾기에 추가되었습니다.',
      data: updatedFavorites,
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

// [ 풋볼장 즐겨찾기에서 삭제 ]

const removeFavoriteDoms = async (dom_id, user_id) => {
  try {
    const foundUser = await User.findOne({ user_id });

    if (!foundUser) return new AppError(400, '존재하지 않는 아이디입니다.');

    const userObjectId = foundUser._id;

    // 풋볼장 조회
    const foundDom = await Dom.findOne({ dom_id });
    if (!foundDom) return new AppError(400, '풋볼장을 찾을 수 없습니다.');

    // 유저 아이디와 일치하지 않는 즐겨찾기만 남기기
    const updatedFavorites = foundDom.usersFavorites.filter(
      (v) => toString(v) !== toString(userObjectId)
    );

    // 즐겨찾기 업데이트
    foundDom.usersFavorites = updatedFavorites;
    await foundDom.save();

    return {
      statusCode: 204,
      message: '즐겨찾기에서 삭제되었습니다.',
      data: updatedFavorites,
    };
  } catch (error) {
    console.log(error);
    return new AppError(500, 'Internal Server Error');
  }
};

module.exports = {
  getAllDoms,
  getFilteredDoms,
  addFavoriteDoms,
  removeFavoriteDoms,
};
