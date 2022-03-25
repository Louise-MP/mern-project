const UserModel = require("../models/user.model"); // "j'appelle la bdd"
const ObjectID = require("mongoose").Types.ObjectId // sert à controller à chaque fois que les ID sont reconnus par la bdd

// récupérer tous les users de la bdd 
module.exports.getAllUsers = async (req, res) => {
  // trouve (find()) la table qui correspond à userModel et (select()) les récupère
  const users = await UserModel.find().select('-password '); // le '-password' permet de ne jamais faire transiter le password d'un user (donnée sensible) => récupère tous les users sauf le password.
  res.status(200).json(users);
}

// récupérer un seul user dans la bdd
module.exports.userInfo = (req, res) => { // **** VOIR POUR CHANGER LE NOM DE LA VARIABLE A LA FIN EN findOne OU QLQ CHOSE DE + PERTINENT ****
  console.log(req.params);

  if (!ObjectID.isValid(req.params.id)) // va chercher dans les parametres et vérifier si l'id est connu dans la bdd
    return res.status(400).send('ID unknown ' + req.params.id)


  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log('ID unknown' + err);
  }).select('-password');
}

// mettre à jour un user
module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.findOneAndUpdate({
        _id: req.params.id
      }, {
        $set: {
          bio: req.body.bio,
        },
      }, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      },
      (err, docs) => {
        if (!err) return res.send(docs);
        if (err) return res.status(500).send({
          message: err
        });
      }
    );
  } catch (err) {}
};

// supprimer un user
module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.deleteOne({  // .remove est ancien ==> utiliser .deleteOne
      _id: req.params.id
    }).exec();
    res.status(200).json({
      message: "Successfuly deleted"
    });
  } catch (err) {
    return res.status(500).json({
      message: err
    });
  }
}

// follow
module.exports.follow = (req, res) => { // retirage de l'async (et des await) car erreur code: 'ERR_HTTP_HEADERS_SENT'
  if (
    !ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow)
  ) return res.status(400).send("ID unknown : " + req.params.id);

  try {
    // ajouter à la liste des following
      UserModel.findByIdAndUpdate(
      req.params.id, // id du user qui follow un autre user
      {
        $addToSet: {
          following: req.body.idToFollow // addToSet : rajoute au tableau following, l'id du user qui se fait follow
        }
      }, 
      {
        new: true,
        upsert: true
      },
      (err, docs) => {
        if (!err) res.status(201).json(docs);
        else return res.status(400).json(err);
      }
    );

    // ajouter à la liste des followers 
      UserModel.findByIdAndUpdate(
      req.body.idToFollow, // id du user qui s'est fait follow juste avant
      {
        $addToSet: {
          followers: req.params.id // rajoute au tableau followers, l'id du user qui le follow 
        }
      }, 
      {
        new: true,
        upsert: true
      },
      (err, docs) => {
        // if (!err) res.status(201).json(docs); // mis en commentaire exprès : on ne peut pas retourner 2 res dans le meme try
        if (err) return res.status(400).json(err);
      }
    )

  } catch (err) {
    return res.status(500).json({
      message: err
    });
  }
}





// unfollow 
module.exports.unfollow = (req, res) => { 
  if (
    !ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnfollow)
  ) return res.status(400).send("ID unknown : " + req.params.id);

  try {
    // retirer de la liste des following
      UserModel.findByIdAndUpdate(
      req.params.id, // id du user qui veut unfollow un autre user
      {
        $pull: {
          following: req.body.idToUnfollow // 
        }
      }, 
      {
        new: true,
        upsert: true
      },
      (err, docs) => {
        if (!err) res.status(201).json(docs);
        else return res.status(400).json(err);
      }
    );

    // retier de la liste des followers 
      UserModel.findByIdAndUpdate(
      req.body.idToUnfollow, // id du user qui s'est fait unfollow juste avant
      {
        $pull: {
          followers: req.params.id // retire du tableau followers, l'id du user qui a unfollow 
        }
      }, 
      {
        new: true,
        upsert: true
      },
      (err, docs) => {
        // if (!err) res.status(201).json(docs); // mis en commentaire exprès : on ne peut pas retourner 2 res dans le meme try
        if (err) return res.status(400).json(err);
      }
    )

  } catch (err) {
    return res.status(500).json({
      message: err
    });
  }
}













// likes