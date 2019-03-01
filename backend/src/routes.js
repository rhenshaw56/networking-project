const express = require('express');
const { UserController } = require('./handler');


const router = express.Router();

router.post('/user', UserController.saveUser);
router.get('/user', UserController.getUser);


module.exports = router;