const express = require('express');

const router =  express.Router();

const friendshipController = require('../controllers/friendship_controller');

router.get('/create', friendshipController.create);

router.get('/destroy', friendshipController.destroy);


module.exports = router;