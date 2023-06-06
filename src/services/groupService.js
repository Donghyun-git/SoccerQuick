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
    leader_id,
    location,
    play_date,
    gk_count,
    player_count,
    current_count,
    contents,
  } = group;
  try {
    const foundLeader = await User.findOne({ user_id: leader_id });

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
      play_date,
      recruitment_count: {
        gk_count: Number(gk_count),
        player_count: Number(player_count),
        current_count: Number(current_count),
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

// 유저 - [ 팀 신청 ]
/** (신청 팀그룹 아이디, 유저 데이터) Object */
const userApplicantGroup = async (user) => {
  const { group_id, user_id, position, level, contents } = user;

  try {
    const foundUser = await User.findOne({ user_id });
    if (!foundUser) return new AppError(404, '존재하지 않는 아이디입니다.');

    const userObjectId = foundUser._id;
    const userGender = foundUser.gender;
    const userStatus = foundUser.applicant_status;

    const foundGroup = await Group.findOne({ group_id });
    if (!foundGroup) return new AppError(404, '존재하지 않는 팀 그룹입니다.');

    const applicants = foundGroup.applicant;
    const acceptArray = foundGroup.accept;

    const filteredApplicant = [...applicants, ...acceptArray].filter(
      (user) => toString(user.id) === toString(userObjectId)
    );

    if (filteredApplicant.length > 0)
      return new AppError(400, '이미 신청한 팀 입니다.');

    if (userStatus === '모집 불가능')
      return new AppError(400, '이미 팀에 속해있습니다.');

    const applicantUserData = {
      id: userObjectId,
      gender: userGender,
      position,
      level,
      contents,
      status: userStatus,
    };

    applicants.push(applicantUserData);

    await foundGroup.save();

    return { statusCode: 200, message: '팀 신청 완료', data: foundGroup };
  } catch (error) {
    console.error(error);
    return new AppError(500, 'Internal Server Error');
  }
};

// 팀 그룹 리더 - 유저 신청 수락
const leaderApplicantAccept = async (group_id, leaderId, user_id) => {
  try {
    const foundLeader = await User.findOne({ user_id: leaderId });
    if (!foundLeader)
      return new AppError(404, '존재하지 않는 리더 아이디입니다.');

    const foundGroup = await Group.findOne({ group_id });
    if (!foundGroup) return new AppError(404, '존재하지 않는 팀 그룹 입니다.');

    const foundUser = await User.findOne({ user_id });
    if (!foundUser)
      return new AppError(404, '존재하지 않거나 탈퇴한 유저 입니다.');

    const leaderObjectId = toString(foundLeader._id);
    const userObjectId = toString(foundUser._id);
    const groupLeaderObjectId = toString(foundGroup.leader.leader_id);

    if (leaderObjectId !== groupLeaderObjectId)
      return new AppError(403, '팀 리더만 수락 가능합니다.');

    const applicants = foundGroup.applicant;
    const acceptArray = foundGroup.accept;

    let { gk_count, player_count, current_count } =
      foundGroup.recruitment_count;

    //비동기 처리를 위한 for문
    let foundApplicantUser = false;
    for (let idx = 0; idx < applicants.length; idx++) {
      const user = applicants[idx];

      if (toString(user.id) === userObjectId) {
        if (user.status === '모집 불가능')
          throw new AppError(400, '이미 다른 팀에서 모집완료 되었습니다.');

        if (user.position === '골키퍼' && gk_count === 0)
          throw new AppError(400, '신청 가능한 골키퍼 포지션은 0 개 입니다!');

        if (user.position === '골키퍼' && gk_count > 0) {
          user.status = '모집 불가능';
          acceptArray.push(user);
          applicants.splice(idx, 1);
          gk_count -= 1;
        }

        if (user.position !== '골키퍼' && player_count === 0)
          throw new AppError(400, '신청 가능한 플레이어 포지션은 0 개 입니다!');

        if (user.position !== '골키퍼' && player_count > 0) {
          user.status = '모집 불가능';
          acceptArray.push(user);
          applicants.splice(idx, 1);
          player_count -= 1;
        }

        current_count += 1;

        foundUser.applicant_status = '모집 불가능';
        await foundUser.save();

        foundApplicantUser = true;
        break;
      }
    }

    if (!foundApplicantUser) {
      throw new AppError(
        404,
        '이미 수락되었거나 신청목록에 존재하지 않습니다.'
      );
    }

    //팀 모집 자동 종료
    if (gk_count === 0 && player_count === 0) foundGroup.status = '모집 완료';

    foundGroup.recruitment_count = {
      gk_count,
      player_count,
      current_count,
    };

    await Group.updateOne(
      { _id: foundGroup._id, 'accept.id': userObjectId },
      { $set: { 'accept.$[elem].status': '모집 불가능' } },
      { arrayFilters: [{ 'elem.id': userObjectId }] }
    ).exec();

    await foundGroup.save();

    await Group.updateMany(
      { 'applicant.id': userObjectId },
      { $set: { 'applicant.$[elem].status': '모집 불가능' } },
      { arrayFilters: [{ 'elem.id': userObjectId }] }
    ).exec();

    return { statusCode: 200, message: '팀원 수락 성공', data: foundGroup };
  } catch (error) {
    if (error.statusCode !== 500) {
      return new AppError(error.statusCode, error.message);
    } else {
      return new AppError(500, 'Internal Server Error');
    }
  }
};

module.exports = {
  getAllGroups,
  addGroup,
  userApplicantGroup,
  leaderApplicantAccept,
};
