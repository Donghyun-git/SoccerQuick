const Joi = require('joi');

// 팀 등록
const addGroupSchema = Joi.object({
  leader_id: Joi.string().label('리더 아이디').required(),
  location: Joi.string().label('지역').required(),
  play_date: Joi.string().label('경기 날짜').required(),
  gk_count: Joi.number().label('구하는 골키퍼 수').required(),
  player_count: Joi.number().label('구하는 플레이어 수').required(),
  current_count: Joi.number().label('현재 플레이어 수').required(),
  contents: Joi.string().label('팀 모집 본문'),
});

//유저 - 팀 신청
const userApplicantGroupSchema = Joi.object({
  group_id: Joi.string().label('팀 id').required(),
  user_id: Joi.string().label('아이디').required(),
  position: Joi.string().label('포지션').required(),
  level: Joi.string().label('자신의 레벨(수준)').required(),
  contents: Joi.string().label('본문'),
});

//팀 리더  - 신청한 유저 수락.
const leaderApplicantAcceptSchema = Joi.object({
  group_id: Joi.string().label('팀 id').required(),
  leaderId: Joi.string().label('팀 리더 아이디').required(),
  user_id: Joi.string().label('아이디').required(),
});

module.exports = {
  addGroupSchema,
  userApplicantGroupSchema,
  leaderApplicantAcceptSchema,
};