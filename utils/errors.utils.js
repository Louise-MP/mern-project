// fichier qui sert à remonter les erreurs de manière "propre", à l'utilisateur


module.exports.signUpErrors = (err) => { // (err) va permettre d'analyser les erreurs liées à la création de compte (signUp)
    let errors = { pseudo: '', email:'', password:'' }

    if (err.message.includes('pseudo'))
    errors.pseudo = "Ce pseudo est incorrect ou existe déjà";

    if (err.message.includes('email'))
    errors.email = "Email incorrect";

    if (err.message.includes('password'))
    errors.password = "Le mot de passe doit faire 6 caractères minimum";

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('pseudo'))
    errors.pseudo = "Ce pseudo existe déjà";

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('email'))
    errors.email = "Cet email est déjà enregistré";

    return errors
};

module.exports.signInErrors = (err) => {
    let errors = { email:'', password:'' }

    if (err.message.includes('email'))
    errors.email = "Email inconnu";

    if (err.message.includes('password'))
    errors.password = "Mot de passe incorrect";

    return errors
};

module.exports.uploadErrors = (err) => {
    let errors = { format: '', maxSize: ''}; // soit le format n'est pas correct, soit la taille de l'image

    if (err.message.includes('invalid file'))
    errors.format = "Format non respecté";

    if (err.message.includes('max size'))
    errors.maxSize = "Le fichier doit faire moins de 500ko";

    return errors 
};