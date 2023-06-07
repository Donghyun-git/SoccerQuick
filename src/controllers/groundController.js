const groundService = require('../services/groundService');
const { AppError } = require('../middlewares/errorHandler');

// [ 전체 구장 조회 ]
const getAllGrounds = async (req, res, next) => {
  try {
    const result = await groundService.getAllGrounds();
    if (result.statusCode !== 200)
      return next(new AppError(result.statusCode, result.message));

    res.status(200).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// [ 필터링된 구장 조회 ]
const getFilteredGrounds = async (req, res, next) => {
  try {
    const { location, date } = req.query;
    const filteredGrounds = await groundService.getFilteredGrounds({
      location,
      date,
    });
    res.json(filteredGrounds);
  } catch (error) {
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// [ 풋볼장 즐겨찾기 추가 ]
const addFavorites = async (req, res, next) => {
  const { groundId } = req.params;
  const { user_id } = req.body;

  try {
    const result = await groundService.addFavorites(groundId, user_id);

    if (result.statusCode !== 201)
      return next(new AppError(result.statusCode, result.message));

    res.status(201).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// [ 풋볼장 즐겨찾기 삭제 ]
const removeFavorites = async (req, res, next) => {
  const { groundId } = req.params;
  const { userId } = req.body;

  try {
    const result = await groundService.removeFavorites({ groundId, userId });

    if (result.statusCode !== 204)
      return next(new AppError(result.statusCode, result.message));

    res.status(204).json({
      message: result.message,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// [ 상세페이지 - 풋살장 예약 ]
const reserveGround = async (req, res, next) => {
  const { ground_id } = req.params;
  const { 예약정보 } = req.body;

  try {
    const result = await groundService.reserveGround({ ground_id, 예약정보 });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

module.exports = {
  getAllGrounds,
  getFilteredGrounds,
  addFavorites,
  removeFavorites,
};