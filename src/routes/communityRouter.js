const { Router } = require('express');
const router = Router();
const communityController = require('../controllers/communityController');

/* GET */
// [ 커뮤니티 게시글 조회 ]
router.get('/', communityController.getAllPosts);

/* POST */
// [ 커뮤니티 게시글 등록 ]
router.post('/', communityController.addPost);

/* PATCH */
// [ 커뮤니티 게시글 수정 ]
router.patch('/:postId', communityController.updatePost);

/* DELETE*/
// [ 커뮤니티 게시글 삭제 ]
router.delete('/:postId', communityController.deletePost);

module.exports = router;
