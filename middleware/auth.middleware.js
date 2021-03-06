const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

// vérifie si le token du user existe 
module.exports.checkUser = (req, res, next) => {

    const token = req.cookies.jwt // si on veut pouvoir lire un cookie il faut installer cookie parser
    if (token) {
    // s'il y a un cookie qui s'appelle jwt => on le vérifie en lui passant notre token qui est en cookie et notre clé secrete
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
    // s'il trouve une erreur dans le décodage, il "retire" le cookie "fraudluleux"
        if (err) {
            res.locals.user = null; // erreur dans le décodage
            res.cookie('jwt', '', { maxAge: 1 }); // retirage du cookie jwt en limitant sa durée de vie à 1 ms
            next();
            // s'il ne trouve pas d'erreur
        } else {
            console.log('decoded token' + decodedToken)
            let user = await UserModel.findById(decodedToken.id);
            res.locals.user = user; // .locals => parametres provisoires dans la requete qui passe les infos et tout ce qui transite dans user
            console.log(res.locals.user);
            next();
        }
    }) 
    }
    // s'il n'y a pas de cookie
    else {
        res.locals.user = null; // s'il n'y a pas de token, alors on ne veut pas voir les infos de user 
        next(); 
    }
} 


module.exports.requireAuth = (res, req, next) => {

    const token = req.cookies.jwt; // on recupere le cookie
    if (token) { // si on trouve un token on lance la verification jwt
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(decodedToken.id);
                next();
            }
        });
    } 
    else {
        console.log('No token');
    }
} 