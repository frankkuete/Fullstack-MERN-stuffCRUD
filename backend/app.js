const express = require('express');
const mongoose = require('mongoose');
const app = express();
const userRoutes = require('./routes/user');
const stuffRoutes = require('./routes/stuff');
const path = require('path');

app.use(express.json())

const uri = process.env.ATLAS_URI
mongoose.connect(uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));



app.use((req, res, next) => {
    //authorise toute les origine a acceder a notre API
    res.setHeader('Access-Control-Allow-Origin', '*'); //authorise toute les origine a acceder a notre API
    //authorise  seulement les headers qui sont specifiés dans les requetes 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //specifie les methodes utilisés 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});




app.use('/images', express.static(path.join(__dirname, 'images'))); // cela permet de gerer les req dans le dossier static image
app.use('/api/stuff', stuffRoutes); // pour gerer les routes CRUD 
app.use('/api/auth', userRoutes); // pour gerer les routes auth des utilsateurs (login et signin)


module.exports = app;