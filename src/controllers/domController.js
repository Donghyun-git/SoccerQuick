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

// [ 필터링된 구장 조회 ]
const getFilteredDoms = async (req, res, next) => {
  // try {
  //   // const { location, date } = req.query;
  //   // const filteredDoms = await domService.getFilteredDoms({
  //   //   location,
  //   //   date,
  //   // // });
  //   // res.status(200).json({ filteredDoms });
  // } catch (error) {
  //   return next(new AppError(500, 'Internal Server Error'));
  // }
};

// [ 풋볼장 즐겨찾기 추가 ]
const addFavoriteDoms = async (req, res, next) => {
  const { groundId } = req.params;
  const { user_id } = req.user;

  try {
    const result = await domService.addFavoriteDoms(groundId, user_id);

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
const removeFavoriteDoms = async (req, res, next) => {
  // const { groundId } = req.params;
  // const { userId } = req.body;
  // try {
  //   const result = await domService.removeFavoriteDoms({ groundId, userId });
  //   if (result.statusCode !== 204)
  //     return next(new AppError(result.statusCode, result.message));
  //   res.status(204).json({
  //     message: result.message,
  //   });
  // } catch (error) {
  //   console.error(error);
  //   return next(new AppError(500, 'Internal Server Error'));
  // }
};

module.exports = {
  getAllDoms,
  getFilteredDoms,
  addFavoriteDoms,
  removeFavoriteDoms,
};
