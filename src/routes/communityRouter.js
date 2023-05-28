const { Router } = require('express');
const router = Router();
const communityController = require('../controllers/communityController');

/* GET */
// [ 커뮤니티 게시글 조회 ]
router.get('/', communityController.getAllPosts);

/* POST */
// [ 커뮤니티 게시글 등록 ]
router.post('/posts', communityController.addPost);

/* PATCH */

/* DELETE*/

module.exports = router;
