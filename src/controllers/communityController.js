const communityService = require('../services/communityService');
const { AppError } = require('../middlewares/errorHandler');

//[ 커뮤니티 전체 게시글 조회 ]
const getAllPosts = async (req, res, next) => {
  try {
    const result = await communityService.getAllPosts();

    res.status(200).json({
      message: result.message,
      posts: result.posts,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, '전체 게시글 조회 실패'));
  }
};

//[ 커뮤니티 게시글 등록 ]
const addPost = async (req, res, next) => {
  const { userId, postId, title, description } = req.body;
  const isNotice = req.body.isNotice || false;

  if (!userId) return next(new AppError(400, '작성자 아이디를 입력해주세요.'));
  if (!postId) return next(new AppError(400, '게시글 번호를 입력해주세요.'));
  if (!title) return next(new AppError(400, '글 제목을 입력해주세요.'));
  if (!description) return next(new AppError(400, '본문 내용을 입력해주세요.'));

  try {
    const posts = {
      userId,
      postId,
      title,
      description,
      isNotice,
    };
    const result = await communityService.addPost(posts);

    if (result.statusCode === 400)
      return next(new AppError(400, result.message));
    if (result.statusCode === 403)
      return next(new AppError(403, result.message));

    res.status(result.statusCode).json({
      message: result.message,
      data: result.newPost,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, '게시글 등록 실패'));
  }
};

//[ (유저,관리자) 커뮤니티 게시글 수정 ]
// [관리자] 는 게시글 공지사항 변경 가능.
const updatePost = async (req, res, next) => {
  const { postId } = req.params;
  const { userId, title, description } = req.body;
  const isNotice = req.body.isNotice || false;

  if (!postId)
    return next(
      new AppError(400, '게시글 번호를 URL 파라미터에 포함 시켜주세요. ㅎㅎ')
    );
  if (!userId)
    return next(
      new AppError(400, '유저 아이디를 바디에 넣어서 같이 보내주세용 ㅎㅎ')
    );
  if (!title) return next(new AppError(400, '수정할 제목을 입력해주세요.'));
  if (!description)
    return next(new AppError(400, '수정할 본문을 입력해주세요.'));

  try {
    const updatePost = {
      postId,
      userId,
      title,
      description,
      isNotice,
    };
    const result = await updatePost(updatePost);
  } catch (error) {
    console.error(error);
    return next(new AppError(500, '게시물 수정 실패'));
  }
};
module.exports = {
  addPost,
  getAllPosts,
  updatePost,
};
