const router = require('express').Router(); 
const postController = require('../controllers/post.controller');

router.get('/', postController.readPost); 
router.post('/', postController.createPost); 
router.put('/', postController.updatePost); 
router.delete('/', postController.deletePost); 

module.exports = router;
