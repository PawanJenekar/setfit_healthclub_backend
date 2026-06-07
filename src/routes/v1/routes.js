const express = require('express');
const router = express.Router();
const {registerUser, LoginUser} = require('../../controllers/authController');

router.post('/register', registerUser);
router.post('/login', LoginUser);
router.use('/users', require('./users'));

router.get('/', (req, res) => res.json({ version: 'v1' }));

module.exports = router;
