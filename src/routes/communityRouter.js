const { Router } = require('express');
const router = Router();
const communityController = require('../controllers/communityController');

//예시
router.get('/', communityController.getAllPosts);

module.exports = router;
