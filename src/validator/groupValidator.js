const Joi = require('joi');
const addGroupSchema = Joi.object({
  leader_id: Joi.string().label('리더 아이디').required(),
  location: Joi.string().label('지역').required(),
  play_date: Joi.string().label('경기 날짜').required(),
  gk_count: Joi.number().label('구하는 골키퍼 수').required(),
  player_count: Joi.number().label('구하는 플레이어 수').required(),
  current_count: Joi.number().label('현재 플레이어 수').required(),
  contents: Joi.string().label('팀 모집 본문'),
});

module.exports = { addGroupSchema };
