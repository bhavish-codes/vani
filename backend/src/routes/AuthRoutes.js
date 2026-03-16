
const { login, signup } = require('../controllers/Authcontroller');
const { signupValidation, loginValidation } = require('../middleware/Authvalidation');

const router = require('express').Router();
router.post('/login',loginValidation,login)
router.post('/signup',signup)
module.exports=router;