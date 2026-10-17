const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');
//login
router.post('/login', managerController.validateLogin, managerController.login);
//register
router.post('/register', managerController.validateRegister, managerController.register);

module.exports = router;