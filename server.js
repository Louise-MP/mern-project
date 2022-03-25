const express = require('express');
const bodyParser = require('body-parser');
const userRoutes= require('./routes/user.routes');
require('dotenv').config({path: './config/.env'});
require('./config/db');

const app = express();

// body parser indispensable pour traiter les données qui vont transiter lors des requetes
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));  


// routes user (toutes les routes qui ont un lien avec le user)
app.use('/api/user', userRoutes);

// server (toujours à la fin du fichier )
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  })