const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, { // prend l'id du user et la clé secrete et en fait un mélange des deux, ce qui créer un token unique pour user
        expiresIn: 3 * 24 * 60 * 60 * 1000
    })
};

module.exports.signUp = async(req, res) => {
    const {pseudo, email, password} = req.body

    try {
        const user = await UserModel.create({pseudo, email, password});
        res.status(201).json({user: user._id});
    }
    catch(err) {
        res.status(200).send({err})
    }
}

module.exports.signIn = async(req, res) => {
    const {email, password} = req.body

    try {
        const user = await UserModel.login(email, password); // cherche dans la bdd si le user existe 
        const token = createToken(user._id)  // si le user existe, création du token du user.  le token comporte l'id du user et la clé secrete et le reste qui rend le jeton unique et authentifiable
        res.cookie('jwt', token, {httpOnly: true, maxAge});   // met dans les cookies : 'jwt' (nom du cookie), token (token qui vient d'être créé pour le user), {httpOnly: true} (sert à la sécurité du token, pour pas qu'il se retrouve n'importe où (consultable que par mon serveur))
        res.status(200).json({user: user._id});
    }  

    catch (err) {
        res.status(200).json(err);
    }
}

module.exports.logout = async(req, res) => {

}