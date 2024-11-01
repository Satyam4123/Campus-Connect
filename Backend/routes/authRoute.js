const { login, signup } = require('../controllers/auth')
const { loginValidation, signupValidation } = require('../middlewares/validation')

const router=require('express').Router()

router.post('/login',loginValidation,login)
router.post('/signup',signupValidation,signup)

module.exports=router