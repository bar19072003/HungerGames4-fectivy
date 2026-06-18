const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');


/**
 * User Routes.
 * Base path: /api/users
 */

router.route('/')
    .post(userController.createUser.bind(userController));

router.route('/:id')
    .get(userController.getUserById.bind(userController));

module.exports = router;