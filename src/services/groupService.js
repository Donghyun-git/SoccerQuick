const { Group, User } = require('../model/models/index');
const { AppError } = require('../middlewares/errorHandler');
const { createGroupId } = require('../utils/createIndex');
const toString = require('../utils/toString');

// [ 전체 팀 그룹 조회 ]
const getAllGroups = async () => {
  try {
    const foundGroup = await Group.find();

    if (!foundGroup)
      return new AppError(404, '등록된 팀 그룹이 존재하지 않습니다.');

    return {
      statusCode: 200,
      message: '전체 팀 그룹 목록 조회 성공',
      data: foundGroup,
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};
// [팀 그룹 등록]
/** (그룹 데이터) */
const addGroup = async (group) => {
  console.log('group:', group);
  const {
    leaderId,
    location,
    playDate,
    gkCount,
    playerCount,
    currentCount,
    contents,
  } = group;
  try {
    const foundLeader = await User.findOne({ user_id: leaderId });

    if (!foundLeader) return new AppError(404, '존재하지 않는 아이디입니다.');

    const leaderObjectId = foundLeader._id;
    const leaderName = foundLeader.name;

    const groupId = await createGroupId();

    const groupData = {
      group_id: groupId,
      leader: {
        leader_id: leaderObjectId,
        leader_name: leaderName,
      },
      location: location,
      play_date: playDate,
      recruitment_count: {
        gk_count: Number(gkCount),
        player_count: Number(playerCount),
        current_count: Number(currentCount),
      },
      contents,
    };
    console.log(groupData);
    const createGroup = await Group.create(groupData);
    return {
      statusCode: 201,
      message: '팀 등록이 완료되었습니다.',
      data: createGroup,
    };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

module.exports = { getAllGroups, addGroup };
