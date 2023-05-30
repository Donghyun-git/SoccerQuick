// 게시글 커스텀 postId
/** (현재 post 게시글 배열 객체) */
const createPostId = (posts) => {
  const index = posts.length + 1;
  return `post${index}`;
};

const createGroundId = (ground) => {
  const index = ground.length + 1;
  return `ground${index}`;
};

module.exports = { createPostId, createGroundId };
