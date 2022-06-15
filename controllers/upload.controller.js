const UserModel = require('../models/user.model');
const fs = require('fs'); // filSystem => dépendance native de node. sert à incrémenter des élements dans des fichiers 🤷🏽‍♀️
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);
const { uploadErrors } = require('../utils/errors.utils');

// profil
module.exports.uploadProfil = async (req, res) => {
    try {
        if (req.file.detectedMimeType != "image/jpg" && req.file.detectedMimeType != "image/png" && req.file.detectedMimeType != "image/jpeg" ) // controle les 3 formats acceptés /
        throw Error("invalid file") // on jette l'erreur si les formats ne sont pas respectés

        if (req.file.size > 500000) // controle la taille de l'image
        throw Error ("max size") // on jette l'erreur si la taille n'est pas respectée
    }
    catch (err) {
        const errors = uploadErrors(err)
        return res.status(201).json({ errors });
    }

    const fileName = req.body.name + ".jpg";  //  créer un nom de fichier unique en utilisant le pseudo du user et le nom de sa photo. 
    // même si la photo envoyé est en png, elle devient un jpg automatiquement... 🤷🏽‍♀️
    // du coup toutes les photos seront uniques et quand le user MAJ sa photo, on aura pas besoin de supprimer l'ancienne photo car elle sera écrasée par la nouvelle car elles possèdent le même nom de sauvegarde 
    // évite le sur stockage de photos utilisateurs

    // on stock de manière static le fichier RAPPEL : n'est pas stocké dans la bdd
    await pipeline(
        req.file.stream,
        fs.createWriteStream(
          `${__dirname}/../client/public/uploads/profil/${fileName}` // le fichier est enfin enregistré sous le nom de fileName
        )
    );

    try {
       await UserModel.findByIdAndUpdate(
           req.body.userId, // on prend l'id du user
           {
               $set: { picture: "./uploads/profil/" + fileName }
           },
           { new: true, upsert: true, setDefaultsOnInsert: true },
           (err, docs) => {
               if (!err) return res.send(docs);
               else return res.status(500).send({ message: err });
           }
       );
    }
    catch (err) {
        return res.status(500).send({ message: err }); 
    }
};