const groupService = require('../services/groupService');
const {
  AppError,
  errorMessageHandler,
} = require('../middlewares/errorHandler');
const { addGroupSchema } = require('../validator/groupValidator');

// [ 전체 팀 그룹 조회 ]
const getAllGroups = async (req, res, next) => {
  try {
    const result = await groupService.getAllGroups();

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

// [ 팀 그룹 등록 ]
const addGroup = async (req, res, next) => {
  const {
    leader_id,
    location,
    play_date,
    gk_count,
    player_count,
    current_count,
    contents,
  } = req.body;

  const { error } = addGroupSchema.validate({
    leader_id,
    location,
    play_date,
    gk_count,
    player_count,
    current_count,
    contents,
  });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const result = await groupService.addGroup({
      leader_id,
      location,
      play_date,
      gk_count,
      player_count,
      current_count,
      contents,
    });

    console.log(result);
    res.status(201).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

module.exports = { getAllGroups, addGroup };
