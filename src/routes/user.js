const express = require('express');
const passport = require('passport');
const controller = require('../controllers/users');
const router = express.Router();

router.post('/login', controller.login);
router.post('/register', controller.register);
router.get('/:id', passport.authenticate('jwt', { session: false }), controller.get);

module.exports = router;
