const groundService = require('../services/groundService');
const { AppError } = require('../middlewares/errorHandler');

// [ 전체 구장 조회 ]
const getAllGrounds = async (req, res, next) => {
  try {
    const grounds = await groundService.getAllGrounds();
    res.status(200).json(grounds);
  } catch (error) {
    return next(new AppError(500, '전체 구장 조회 실패'));
  }
};

// [ 필터링된 구장 조회 ]
const getFilteredGrounds = async (req, res, next) => {
  try {
    const { location, date } = req.query;
    const filteredGrounds = await groundService.getFilteredGrounds(
      location,
      date
    );
    res.json(filteredGrounds);
  } catch (error) {
    return next(new AppError(500, '구장 위치와 날짜 조회 실패 '));
  }
};

// [ 풋볼장 즐겨찾기 추가 ]
const addFavorites = async (req, res, next) => {
  const { groundId } = req.params;
  const { userId } = req.body;

  try {
    const result = await groundService.addFavorites(groundId, userId);

    if (result.statusCode === 400)
      return next(new AppError(400, result.message));

    res.status(201).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error('즐겨찾기 추가 중에 오류 발생', error);
    return new AppError(500, '즐겨찾기 추가 중에 오류 발생');
  }
};

// [ 풋볼장 즐겨찾기 삭제]
const removeFavorites = async (req, res, next) => {
  const { groundId } = req.params;
  const { userId } = req.body;

  try {
    const result = await groundService.removeFavorites(groundId, userId);

    if (result.statusCode === 400)
      return next(new AppError(400, result.message));

    res.status(201).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error('즐겨찾기 삭제 중에 오류 발생', error);
    return new AppError(500, '즐겨찾기 삭제 중에 오류 발생');
  }
};

module.exports = {
  getAllGrounds,
  getFilteredGrounds,
  addFavorites,
  removeFavorites,
};
