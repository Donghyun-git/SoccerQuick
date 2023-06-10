const domService = require('../services/domService');
const { AppError } = require('../middlewares/errorHandler');

// [ 전체 구장 조회 ]
const getAllDoms = async (req, res, next) => {
  try {
    const result = await domService.getAllDoms();
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

// [ 단일 구장 조회 ]
const getOneDom = async (req, res, next) => {
  const { dom_id } = req.params;

  try {
    const result = await domService.getOneDom(dom_id);

    if (result.statusCode !== 200)
      return next(new AppError(result.statusCode, result.message));

    res.status(200).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// [ 검색된 위치의 풋볼장 찾기 ]
const getSearchLocation = async (req, res, next) => {
  const { keywords } = req.query;

  try {
    const result = await domService.getSearchLocation(keywords);

    if (result.statusCode !== 200)
      return new AppError(result.statusCode, result.message);

    res.status(200).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// [ 풋볼장 즐겨찾기 추가 ]
const addFavoriteDoms = async (req, res, next) => {
  const { dom_id } = req.params;
  const { user_id } = req.user;

  try {
    const result = await domService.addFavoriteDoms(dom_id, user_id);

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

// [ 풋볼장 즐겨찾기 삭제 ]
const removeFavoriteDoms = async (req, res, next) => {
  const { dom_id } = req.params;
  const { user_id } = req.user;

  try {
    const result = await domService.removeFavoriteDoms(dom_id, user_id);

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

module.exports = {
  getAllDoms,
  getOneDom,
  getSearchLocation,
  addFavoriteDoms,
  removeFavoriteDoms,
};
