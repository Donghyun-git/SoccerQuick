const { Ground } = require('../model/models/index');
const { AppError } = require('../middlewares/errorHandler');

// [ 전체 구장 조회 ]
const getAllGrounds = async () => {
  try {
    const grounds = await Ground.find();
    return {
      statusCode: 200,
      message: '전체 구장 조회 성공',
      grounds: grounds,
    };
  } catch (error) {
    console.log('구장 전체 목록을 가져오는 중에 오류 발생', error);
    return new AppError(500, '구장 전체 목록을 가져오지 못했습니다.');
  }
};

// [ 위치, 날짜로 필터링된 구장 조회]
const getFilteredGrounds = async (location, date) => {
  try {
    const grounds = await Ground.find();
    // 필터링 로직 구현해서 해당 조건에 맞는 구장 데이터 조회
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
      message: '필터링된 구장 조회 성공',
      filteredGrounds: filteredGrounds,
    };
  } catch (error) {
    console.log('구장 필터링중에 오류 발생', error);
    return new AppError(500, '구장 필터링 실패');
  }
};

module.exports = {
  getAllGrounds,
  getFilteredGrounds,
};
