const mongoose = require('mongoose');
const {isEmail} = require('validator'); // isEmail est une fonction qui fait en sorte que l'email fonctionne 
const bcrypt = require('bcrypt'); 

const userSchema = new mongoose.Schema( 
    {
        pseudo: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 55,
            unique: true, // (important)
            trim: true // supprime les espaces à la fin du pseudo 
        },

        email: {
            type: String,
            required: true,
            validate: [isEmail], // (validator = validation très précise de l'email) fait en sorte que l'email fonctionne
            lowercase: true,
            unique: true,
            trim: true
        },
        
        password: {
            type: String,
            required: true, 
            max: 1024,
            minlength: 6
        },

        bio: {
            type: String,
            max: 1024,
        },

        picture: {
            type: String,
            default: "./uploads/profil/user-icone.png" // chemin de l'image par défaut (quand l'user n'a pas encore mis d'image de profil)
        },

        followers: {
            type: [String] // tableau qui regroupe les id des followers du user 
            // (ces id seront stockés dans la bdd)
        },

        following: {
            type: [String] // tableau qui regroupe tous les id des following du user 
        },

        likes: {
            type: [String] // tableau qui regroupe tous les id des posts likés, 
            // regroupe les posts qui ont deja été likés par le user 
            // pour empecher le user de liker à l'infini
            // dès que le user like un post, l'id du post vient dans ce tableau
        }
    },

    {
        timestamps: true,
    }
)

// je lance la fonction de cryptage avant de sauvegarder (save) dans la bdd    
userSchema.pre("save", async function(next) { //pas de fonction fléchée car on utilise un this...
     const salt = await bcrypt.genSalt(); // génère le salage 
     this.password = await bcrypt.hash(this.password, salt); // va venir saler le mdp   
     next();
})

// je compare le mdp présent dans la bdd avec le mdp rentré par le user dans le input password pour se login
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email }); // on trouve ce qui correspond à l'email dans la bdd
    if (user) { 
        const auth = await bcrypt.compare(password, user.password); // vient controller le password qui est le parametre de la fonction et le password qui se trouve dans la bdd 
        if (auth) { // si auth est ok => retourne user sinon erreur
            return user;
        }
        throw Error('incorrect password'); // le throw arrete tout et déclenche l'erreur
    }
    throw Error('incorrect email')
}; 



// j'exporte le model pour le retrouver dans la table user de la bdd
const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;
