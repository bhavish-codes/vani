
const { login, signup } = require('../controllers/Authcontroller');
const { signupValidation, loginValidation } = require('../middleware/Authvalidation');

const router = require('express').Router();
router.post('/login',loginValidation,login)
router.post('/signup',signupValidation,signup)
module.exports=router;