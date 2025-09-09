const { protect } = require('../middlewares/protect')
const {searchFunctions, searchUsersForConnection, getAllAvailableUsers}=require('../controllers/searchFunctions')
const router=require('express').Router()

router.get('/',protect, searchFunctions)
router.get('/users',protect, searchUsersForConnection)
router.get('/users/all',protect, getAllAvailableUsers)

module.exports=router