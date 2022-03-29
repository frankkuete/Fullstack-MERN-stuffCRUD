const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config'); // ajouter le middleware multer

const stuffCtrl = require('../controllers/stuff');

router.get('/', auth, stuffCtrl.getAllStuff);
router.post('/', auth, multer, stuffCtrl.createThing); // exiger middleware multer avant de creer un objet  
router.get('/:id', auth, stuffCtrl.getOneThing);
router.put('/:id', auth, multer, stuffCtrl.modifyThing); // exiger middleware multer avant de supprimer un objet 
router.delete('/:id', auth, stuffCtrl.deleteThing);

module.exports = router;
