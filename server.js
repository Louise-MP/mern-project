const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes= require('./routes/user.routes');
require('dotenv').config({path: './config/.env'});
require('./config/db');

// appel de la fonction directement
const { checkUser } = require('./middleware/auth.middleware');
const { requireAuth } = require('./middleware/auth.middleware');

const app = express();

// body parser (indispensable pour traiter les données qui vont transiter lors des requetes)
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));  
app.use(cookieParser());

// jwt (vérifie si le user possède bien un token qui correspond à un id..) de cette manière on assure la sécurité et la connexion des user
app.get('*', checkUser); // (* = toutes les routes get) si la route c'est '*', ça déclenche le middleware checkUser
app.get('/jwtid', requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id)
});


// routes user (toutes les routes qui ont un lien avec le user)
app.use('/api/user', userRoutes);

// server (toujours à la fin du fichier )
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${ process.env.PORT }`);
  })