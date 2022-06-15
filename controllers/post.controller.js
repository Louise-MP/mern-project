const postModel = require('../models/post.model');
const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const { uploadErrors } = require('../utils/errors.utils');
const ObjectID = require('mongoose').Types.ObjectId;
const fs = require('fs'); // filSystem => dépendance native de node. sert à incrémenter des élements dans des fichiers 🤷🏽‍♀️
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);

// Récupérer tous les posts
module.exports.readPost = (req, res) => {
    PostModel.find((err, docs) => {
        if (!err) res.send(docs);
        else console.log('Error to get data :'+ err);
    }).sort({ createdAt: -1 }) // .sort = trier, permet récupérer les posts du plus récent au plus ancien
};

// créer un post
module.exports.createPost = async (req, res) => {

    // création du fichier photo de post du user
    let fileName;

    // controle s'il ya une image à traiter et si c'est le cas, lance les vérifications de taille et de format 
    if (req.file !== null) {
        try {
            if (req.file.detectedMimeType != "image/jpg" && req.file.detectedMimeType != "image/png" && req.file.detectedMimeType != "image/jpeg" ) // controle les 3 formats acceptés /
            throw Error("invalid file") // on jette l'erreur si les formats ne sont pas respectés
    
            if (req.file.size > 500000) // controle la taille de l'image
            throw Error ("max size") // on jette l'erreur si les formats ne sont pas respectés
        }
        catch (err) {
            const errors = uploadErrors(err)
            return res.status(201).json({ errors });
        }
        // s'il n'y a pas d'erreur lors des vérifications, on créer le fichier
        fileName = req.body.posterId + Date.now() + ".jpg"; // on détermine que fileName aura un nom unique (grâce à Date.now() car on aura l'heure pile à laquelle le user upload sa photo de post. donc on est sur que le fichier est unique) qui terminera par .jpg
        
        await pipeline(
            req.file.stream,
            fs.createWriteStream(
              `${__dirname}/../client/public/uploads/posts/${fileName}` // le fichier est enfin enregistré sous le nom de fileName
            )
        );
    } 

    const newPost = new PostModel({
        posterId: req.body.posterId,
        message: req.body.message,
        picture: req.file !== null ? "./uploads/posts/" + fileName: "", // si jamais req.file n'est pas null, donc si jamais un fichier a été transmis (upload d'image par le user), alors mongodb  go chercher l'image en suivant ce chemin...
        video: req.body.video,
        likers: [],
        comments: [],   
    });

    try {
        const post = await newPost.save();
        return res.status(201).json(post);
    }
    catch (err) {
        return res.status(400).send(err);
    }
};      

// modifier un post
module.exports.updatePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) // va chercher dans les parametres et vérifier si l'id est connu dans la bdd
    return res.status(400).send("ID unknown : " + req.params.id);

    const updatedRecord = {
        message: req.body.message // l'élément que l'on souhaite modifier
    }

    PostModel.findByIdAndUpdate(
        req.params.id, // id du post et non du user qui a posté
        { $set: updatedRecord },
        { new: true },
        (err, docs) => {
            if (!err) res.send(docs);
            else console.log("Update error : " + err);
        }
    )
};

// supprimer un post
module.exports.deletePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) 
    return res.status(400).send("ID unknown : " + req.params.id);

    postModel.findByIdAndRemove(
        req.params.id, // id du post
        (err, docs) => { //s'il y a une erreur, renvoie l'erreur sinon renvoie le doc
            if (!err) res.send(docs); 
            else console.log("Delete error : " + err);
        } 
    )

};

// liker un post
module.exports.likePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) 
    return res.status(400).send("ID unknown : " + req.params.id);

    try {
        await PostModel.findByIdAndUpdate(
            req.params.id, // id du post
            {
                $addToSet: { likers: req.body.id } // rajoute au tableau likers du post, l'id du user qui a liké le post
            },
            { new: true },
            (err, docs) => {
                if (err) return res.status(400).send(err) 
            }
        );
            await UserModel.findByIdAndUpdate(
            req.body.id, // id du user
            {
                $addToSet: { likes: req.params.id } // rajoute au tableau likes du user, l'id du post liké par le user 
            },
            { new: true },
            (err, docs) => {
                if (!err) res.send(docs); 
                else return res.status(400).send(err);
            }
        );
    }
    catch (err) {
        return res.status(400).send(err)
    }  
};

// unliker un post 
module.exports.unlikePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

      try {
        await PostModel.findByIdAndUpdate(
            req.params.id, // id du post
            {
                $pull: { likers: req.body.id } // retire du tableau likers, l'id du user qui a unlike le post
            },
            { new: true },
            (err, docs) => {
                if (err) return res.status(400).send(err) 
            }
        );
            await UserModel.findByIdAndUpdate(
            req.body.id, // id du user
            {
                $pull: { likes: req.params.id } // retire du tableau likes du user, l'id du post qu'il a unliké
            },
            { new: true },
            (err, docs) => {
                if (!err) res.send(docs); 
                else return res.status(400).send(err);
            }
        );
    }
    catch (err) {
        return res.status(400).send(err)
    }  
};


// commentaires 
module.exports.commentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id, // on récupère l'id du post 🤷🏽‍♀️ en paramètre
            {
                $push:  { // on push dans le tableau comments ; ajoute le commentaire à la suite des autres
                    comments: {  
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text,
                        timestamp: new Date().getTime()
                    } 
                }
            },
            { new: true },
            (err, docs) => { // callback : on obtient soit une erreur, soit la data
                if (!err) return res.send(docs);
                else return res.status(400).send(err);
            }  
        );
    }
    catch (err) {
        return res.status(400).send(err); 
    }
};

module.exports.editCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

    try {
        return PostModel.findById( // trouve l'id du post qui possède le commentaire à éditer
            req.params.id,
            (err, docs) => { 
                const theComment = docs.comments.find((comment) => // on vient trouver le commentaire à modifier grâce à .find
                    comment._id.equals(req.body.commentId) // check si les deux commentaires correspondent et si oui on pourra modifier theComment
                ) 

                if (!theComment) return res.status(400).send('Comment not found') // s'il ne trouve pas le commentaire...
                theComment.text = req.body.text;

                return docs.save((err) => {
                    if (!err) return res.status(200).send(docs);
                    return res.status(500).send(err);
                })
            }
        )
    }
    catch (err) {
        return res.status(400).send(err);
    }
}

module.exports.deleteCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id, // on trouve le commentaire grâce à son id
            {
                $pull: { // on retire le commentaire qui à l'id suivant, grâce à $pull
                    comments: {
                        _id: req.body.commentId
                    }
                }
            },
            { new: true },
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(400).send(err); 
            }
        ) 
    }
    catch (err) {
        return res.status(400).send(err);
    }
}