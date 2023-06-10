const groupService = require('../services/groupService');
const {
  AppError,
  errorMessageHandler,
} = require('../middlewares/errorHandler');
const {
  addGroupSchema,
  userApplicantGroupSchema,
  leaderApplicantSchema,
  updateMyGroupSchema,
} = require('../validator/groupValidator');

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

// [ 단일 팀 조회 ]
const getOneGroup = async (req, res, next) => {
  const { group_id } = req.params;
  try {
    const result = await groupService.getOneGroup(group_id);

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

//[ 리더 - 팀 정보 수정 ]
const updateMyGroup = async (req, res, next) => {
  const { group_id } = req.params;
  const { user_id } = req.user;
  const {
    location,
    status,
    gk_count,
    player_count,
    gk_current_count,
    player_current_count,
    title,
    contents,
  } = req.body;

  const { error } = updateMyGroupSchema.validate({
    group_id,
    user_id,
    location,
    status,
    gk_count,
    player_count,
    gk_current_count,
    player_current_count,
    title,
    contents,
  });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const result = await groupService.updateMyGroup({
      group_id,
      user_id,
      location,
      status,
      gk_count,
      player_count,
      gk_current_count,
      player_current_count,
      title,
      contents,
    });

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
  const leader_id = req.user.user_id;
  const {
    title,
    location,
    gk_count,
    player_count,
    gk_current_count,
    player_current_count,
    contents,
  } = req.body;

  const { error } = addGroupSchema.validate({
    title,
    leader_id,
    location,
    gk_count,
    player_count,
    gk_current_count,
    player_current_count,
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
      gk_count,
      player_count,
      gk_current_count,
      player_current_count,
      title,
      contents,
    });

    res.status(201).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// 유저 - [ 팀 그룹 신청 ]
const userApplicantGroup = async (req, res, next) => {
  const { group_id } = req.params;
  const { user_id } = req.user;
  const { position, level, contents } = req.body;

  const { error } = userApplicantGroupSchema.validate({
    group_id,
    user_id,
    position,
    level,
    contents,
  });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const result = await groupService.userApplicantGroup({
      group_id,
      user_id,
      position,
      level,
      contents,
    });

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

// [ 리더 ] - 유저 신청 수락
const leaderApplicantAccept = async (req, res, next) => {
  const { group_id } = req.params;
  const { user_id } = req.body;
  const leaderId = req.user.user_id;

  const { error } = leaderApplicantSchema.validate({
    group_id,
    leaderId,
    user_id,
  });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const result = await groupService.leaderApplicantAccept(
      group_id,
      leaderId,
      user_id
    );

    if (result.statusCode !== 200) {
      return next(new AppError(result.statusCode, result.message));
    }

    res.status(200).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

//[ 리더 ] - 유저 신청 거절
const leaderApplicantReject = async (req, res, next) => {
  const { group_id } = req.params;
  const { user_id } = req.body;
  const leaderId = req.user.user_id;

  const { error } = leaderApplicantSchema.validate({
    group_id,
    leaderId,
    user_id,
  });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const result = await groupService.leaderApplicantReject(
      group_id,
      leaderId,
      user_id
    );

    if (result.statusCode !== 200) {
      return next(new AppError(result.statusCode, result.message));
    }

    res.status(200).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

//[ 리더, 관리자 ] - 팀 그룹 삭제
const deleteGroup = async (req, res, next) => {
  const { group_id } = req.params;
  const { user_id } = req.user;

  try {
    const result = await groupService.deleteGroup(group_id, user_id);

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
  getAllGroups,
  getOneGroup,
  updateMyGroup,
  addGroup,
  userApplicantGroup,
  leaderApplicantAccept,
  leaderApplicantReject,
  deleteGroup,
};
