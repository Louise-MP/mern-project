const router = require('express').Router(); 
const postController = require('../controllers/post.controller');
const multer = require('multer');
const upload = multer();

// création de post
router.get('/', postController.readPost); 
router.post('/', upload.single('file'), postController.createPost); // upload.single('file') upload post image pdt la création du post
router.put('/:id', postController.updatePost); 
router.delete('/:id', postController.deletePost); 
router.patch('/like-post/:id', postController.likePost);
router.patch('/unlike-post/:id', postController.unlikePost);

// commentaires 
router.patch('/comment-post/:id', postController.commentPost); // id du post que l'on souhaite commenter
router.patch('/edit-comment-post/:id', postController.editCommentPost); // éditer le commentaire
router.patch('/delete-comment-post/:id', postController.deleteCommentPost); // supprimer le commentaire


module.exports = router;
