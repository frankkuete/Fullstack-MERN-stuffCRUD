const Thing = require('../models/thing');

/*
version sans prise en compte des fichiers 
exports.createThing = (req, res, next) => {
    const thing = new Thing({
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        userId: req.body.userId
    });
    thing.save().then(
        () => {
            res.status(201).json({
                message: 'Post saved successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};*/

exports.createThing = (req, res, next) => {
    //le front-end doit envoyer les données de la requête sous la forme form-data, et non sous forme de JSON.
    //Nous devons donc l'analyser à l'aide de JSON.parse() pour obtenir un objet utilisable.
    const thingObject = JSON.parse(req.body.thing);
    delete thingObject._id;
    const thing = new Thing({
        ...thingObject,
        //Nous devons également résoudre l'URL complète de notre image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    thing.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneThing = (req, res, next) => {
    Thing.findOne({
        _id: req.params.id
    }).then(
        (thing) => {
            res.status(200).json(thing);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

/* exports.modifyThing = (req, res, next) => {
    const thing = new Thing({
        _id: req.params.id,
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        userId: req.body.userId
    });
    Thing.updateOne({ _id: req.params.id }, thing).then(
        () => {
            res.status(201).json({
                message: 'Thing updated successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};*/

exports.modifyThing = (req, res, next) => {
    const thingObject = req.file ? // il y'a t'il  un fichier dans la requete (user modifie l'image aussi) ? 
        { // oui il y'a un fichier 
            ...JSON.parse(req.body.thing), //
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } :
        { //non il n'ya pas de fichier
            ...req.body
        };

    Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};


/*exports.deleteThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id }).then( // find in mongodb, the thing to delete 
        (thing) => {
            if (!thing) {
                res.status(404).json({ // if thing does exist
                    error: new Error('No such Thing!')
                });
            }
            if (thing.userId !== req.auth.userId) { // if thing exists but the userId do not create it 
                res.status(400).json({
                    error: new Error('Unauthorized request!')
                });
            }
            Thing.deleteOne({ _id: req.params.id }).then( // if thing exists and userId create it
                () => {
                    res.status(200).json({
                        message: 'Deleted!'
                    });
                }
            ).catch(
                (error) => {
                    res.status(400).json({
                        error: error
                    });
                }
            );
        }
    )
};*/

exports.deleteThing = (req, res, next) => { //cherche le things en base de données 
    Thing.findOne({ _id: req.params.id })
        .then(thing => {
            const filename = thing.imageUrl.split('/images/')[1]; //recuperer le nom du fichier a partir de imageURL 
            //la fonction unlink du package fs pour supprimer ce fichier, en lui passant le fichier à supprimer et le callback à exécuter une fois ce //fichier supprimé ;
            fs.unlink(`images/${filename}`, () => {
                Thing.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};



exports.getAllStuff = (req, res, next) => {
    Thing.find().then(
        (things) => {
            res.status(200).json(things);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};