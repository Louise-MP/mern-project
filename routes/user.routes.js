const router = require('express').Router(); // fait reference à l'objet router() express 
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const uploadController = require('../controllers/upload.controller');
const multer = require('multer');
const upload = multer();


// auth
router.post("/register", authController.signUp);
router.post('/login', authController.signIn);
router.get('/logout', authController.logout);

// user 
router.get('/', userController.getAllUsers);
router.get('/:id', userController.userInfo); // :id est un parametre : ici on va chercher dans les parametres du user et non dans le .body...
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.patch('/follow/:id', userController.follow); // .patch pour mettre à jour...
router.patch('/unfollow/:id', userController.unfollow);

// upload (controle de l'image (taille, type de fichier etc), image stockée en static, puis url de stockage de l'image envoyé dans la bdd...) 
router.post('/upload', upload.single('file'), uploadController.uploadProfil); // api/user/upload... 


module.exports = router;

