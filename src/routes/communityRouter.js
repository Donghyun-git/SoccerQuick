const { Router } = require('express');
const router = Router();
const tokenValidator = require('../validator/jwt/tokenValidator');
const communityController = require('../controllers/communityController');

/* GET */
// [ 커뮤니티 게시글 조회 ]
router.get('/', tokenValidator, communityController.getAllPosts);

/* POST */
// [ 커뮤니티 게시글 등록 ]
router.post('/', tokenValidator, communityController.addPost);

//[ 커뮤니티 게시글 댓글 등록 ]
router.post('/:postId/comment', tokenValidator, communityController.addComment);

/* PATCH */
//[ 커뮤니티 게시글 댓글 수정]
router.patch(
  '/:postId/comment/:commentId',
  tokenValidator,
  communityController.updateComment
);

// [ 커뮤니티 게시글 수정 ]
router.patch('/:postId', tokenValidator, communityController.updatePost);

/* DELETE*/
// [ 커뮤니티 게시글 삭제 ]
router.delete('/:postId', tokenValidator, communityController.deletePost);

//[ 커뮤니티 게시글 댓글 삭제 ]
router.delete(
  '/:postId/comment/:commentId',
  tokenValidator,
  communityController.deleteComment
);

module.exports = router;
