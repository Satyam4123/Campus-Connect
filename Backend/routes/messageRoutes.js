const { protect } = require("../middlewares/protect");
const {getAllUsers}=require('../controllers/chatFunctions')

const router = require("express").Router();

router.get('/user', protect, getAllUsers)

module.exports=router