const { Ground } = require('../model/models/index');
const { AppError } = require('../middlewares/errorHandler');

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
    return new AppError(500, '풋볼장 전체 목록을 가져오지 못했습니다.');
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
    return new AppError(500, '풋볼장 필터링 실패');
  }
};

// [ 풋볼장 즐겨찾기에 추가 ]
const addFavorites = async (req, res, nex) => {
  try {
    const { groundId } = req.params;
    const { userId } = req.body;

    // 풋볼장 조회
    const ground = await Ground.findById(groundId);
    if (!ground) {
      return new AppError(404, '풋볼장을 찾을 수 없습니다.');
    }

    // 이미 즐겨찾기에 추가되어 있는지 확인
    const isAlreadyFavorite = ground.usersFavorites.includes(userId);

    if (isAlreadyFavorite) {
      return new AppError(400, '이미 즐겨찾기에 추가되어 있습니다.');
    }
    // 즐겨찾기에 추가
    ground.usersFavorites.push(userId);
    await ground.save();

    return { statusCode: 200, message: '즐겨찾기에 추가되었습니다.' };
  } catch (error) {
    console.error('즐겨찾기 추가 중에 오류 발생', error);
    return new AppError(500, '즐겨찾기 추가 중 오류 발생');
  }
};

// [ 풋볼장 즐겨찾기에서 삭제 ]
const removeFavorites = async (req, res) => {
  try {
    const { groundId } = req.params;
    const userId = req.user.id; //로그인된 사용자 ID
    const ground = await Ground.findById(groundId);
    if (!ground) {
      return new AppError(404, '풋볼장을 찾을 수 없습니다.');
    }
    // 즐겨찾기에서 삭제
    ground.usersFavorites.pull(userId);
    await ground.save();
    return { statusCode: 200, message: '즐겨찾기에서 삭제되었습니다.' };
  } catch (error) {
    console.log('즐겨찾기 삭제 중에 오류 발생', error);
    return new AppError(500, '즐겨찾기 삭제 중 오류 발생');
  }
};

module.exports = {
  getAllGrounds,
  getFilteredGrounds,
  addFavorites,
  removeFavorites,
};
