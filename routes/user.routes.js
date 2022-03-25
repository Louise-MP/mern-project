const router = require('express').Router(); // fait reference à l'objet router() express 
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');

// auth
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
 
// user 
router.get('/', userController.getAllUsers);
router.get('/:id', userController.userInfo); // :id est un parametre : ici on va chercher dans les parametres du user et non dans le .body...
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.patch('/follow/:id', userController.follow); // .patch pour mettre à jour un tableau...
router.patch('/unfollow/:id', userController.unfollow);

module.exports = router;