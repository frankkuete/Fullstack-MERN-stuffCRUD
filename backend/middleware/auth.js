const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; //permet de recuperer le token d'authentification du header de la req

        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // permet de dechiffrer le token et extraire le contenu

        const userId = decodedToken.userId;  //recuperer l'id de utilisateur qui veut acceder aux routes CRUD 

        //permet d'ajouter l'objet auth(qui est l'id du user qui veut faire un CRUD) a la requete entrante avant de passer aux routes CRUD
        req.auth = { userId: userId };

        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';  // si il n'ya pas userId ou l'userid qui fait la requete n'est proprietaire du token alors reponse 401
        } else {
            next(); 	// si tout est ok alors les autres routes CRUD sont ouvertes 
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};