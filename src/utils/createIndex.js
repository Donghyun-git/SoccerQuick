// 게시글 커스텀 postId
/** (현재 post 게시글 배열 객체) */
const createPostId = async () => {
  const { nanoid } = await import('nanoid');
  const index = nanoid(4);
  return `post${index}`;
};

const createGroundId = async () => {
  const { nanoid } = await import('nanoid');
  const index = nanoid(4);
  return `ground${index}`;
};

const createReviewId = async () => {
  const { nanoid } = await import('nanoid');
  const index = nanoid(4);
  return `review${index}`;
};

const createCommentId = async () => {
  const { nanoid } = await import('nanoid');
  const index = nanoid(4);
  return `comment${index}`;
};

module.exports = {
  createPostId,
  createGroundId,
  createReviewId,
  createCommentId,
};
