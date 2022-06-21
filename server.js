const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
require('dotenv').config({path: './config/.env'});
require('./config/db');

// appel de la fonction directement
const { checkUser } = require('./middleware/auth.middleware');
const { requireAuth } = require('./middleware/auth.middleware');

const cors = require('cors');

const app = express();

// code modifié : erreur lié au credentials : axios Access to XMLHttpRequest at 'http://localhost:4000/api/user/login' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'. The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.
// solution : activer les crdentials dans axios ET dans le cors 

const corsOptions ={
  origin: process.env.CLIENT_URL || "https://racoont.netlify.app",
  credentials: true,
  allowedHeaders: ['Origin', 'X-Requested-With', 'x-access-token', 'role', 'Content', 'Accept', 'Content-Type', 'Authorization', "Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "CORELATION_ID"],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false
}
 
app.use(cors(corsOptions));


// body parser (indispensable pour traiter les données qui vont transiter lors des requetes)
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));  
app.use(cookieParser());

// jwt (vérifie si le user possède bien un token qui correspond à un id..) de cette manière on assure la sécurité et la connexion des user
app.get('*', checkUser); // (* = toutes les routes get) si la route c'est '*', ça déclenche le middleware checkUser
app.get('/jwtid', requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id)
});

// routes
app.use('/api/user', userRoutes); // toutes les routes qui ont un lien avec le user
app.use('/api/post', postRoutes); // toutes les routes qui ont un lien avec les posts

// heroku
app.get('/', (req, res) => {
  res.send('APP IS RUNNING');
});

// server (toujours à la fin du fichier )
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${ process.env.PORT }`);
})