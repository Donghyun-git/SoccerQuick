const Joi = require('joi');
const addGroupSchema = Joi.object({
  leaderId: Joi.string().label('리더 아이디').required(),
  location: Joi.string().label('지역').required(),
  playDate: Joi.string().label('경기 날짜').required(),
  gkCount: Joi.number().label('구하는 골키퍼 수').required(),
  playerCount: Joi.number().label('구하는 플레이어 수').required(),
  currentCount: Joi.number().label('현재 플레이어 수').required(),
  contents: Joi.string().label('팀 모집 본문'),
});

module.exports = { addGroupSchema };
