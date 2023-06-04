const groundService = require('../services/groundService');
const { AppError } = require('../middlewares/errorHandler');

// [ 전체 구장 조회 ]
const getAllGrounds = async (req, res, next) => {
  try {
    const grounds = await groundService.getAllGrounds();
    res.status(200).json(grounds);
  } catch (error) {
    return next(new AppError(500, 'Internal Server Error'));
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
    return next(new AppError(500, 'Internal Server Error'));
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
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
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
