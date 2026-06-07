const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/users.controller');

router.get('/', ctrl.getUsers);
router.post('/', ctrl.createUser);

module.exports = router;
