const groundService = require('../services/groundService');
const { AppError } = require('../middlewares/errorHandler');

const getAllGrounds = (req, res, next) => {
  try {
    const grounds = groundService.getAllGrounds();
    res.status(200).json(grounds);
  } catch (error) {
    return next(new AppError(500, '전체 구장 조회 실패'));
  }
};

const getFilteredGrounds = (req, res, next) => {
  try {
    const { location, date } = req.query;
    const filteredGrounds = groundService.getFilteredGrounds(location, date);
    res.json(filteredGrounds);
  } catch (error) {
    return next(new AppError(500, '구장 위치와 날짜 조회 실패 '));
  }
};

module.exports = {
  getAllGrounds,
  getFilteredGrounds,
};
