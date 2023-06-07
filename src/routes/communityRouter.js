const { Router } = require('express');
const router = Router();
const tokenValidator = require('../middlewares/tokenValidator');
const communityController = require('../controllers/communityController');

/* GET */
// [ 커뮤니티 게시글 조회 ]
router.get('/', tokenValidator, communityController.getAllPosts);

/* POST */
// [ 커뮤니티 게시글 등록 ]
router.post('/', communityController.addPost);

//[ 커뮤니티 게시글 댓글 등록 ]
router.post('/:postId/comment', communityController.addComment);

/* PATCH */
//[ 커뮤니티 게시글 댓글 수정]
router.patch('/:postId/comment/:commentId', communityController.updateComment);

// [ 커뮤니티 게시글 수정 ]
router.patch('/:postId', communityController.updatePost);

/* DELETE*/
// [ 커뮤니티 게시글 삭제 ]
router.delete('/:postId', communityController.deletePost);

//[ 커뮤니티 게시글 댓글 삭제 ]
router.delete('/:postId/comment/:commentId', communityController.deleteComment);

module.exports = router;
