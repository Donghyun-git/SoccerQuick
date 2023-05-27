const { getAllPosts } = require('../services/communityService');
const { AppError } = require('../middlewares/errorHandler');

module.exports = {
  getAllPosts,
};
