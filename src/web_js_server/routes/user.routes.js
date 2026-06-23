const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { requireAuth  } = require('../middlewares/auth.middleware');

/**
 * User Routes.
 * Base path: /api/users
 */

router.route('/')
    .post(userController.createUser.bind(userController));

router.route('/profile')
    .patch(requireAuth, userController.updateProfile.bind(userController));

router.route('/:id')
    .get(requireAuth, userController.getUserById.bind(userController));

module.exports = router;