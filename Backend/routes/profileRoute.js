const { getProfile, editProfile,deleteProfile } = require('../controllers/profileFunctions');
const { protect } = require('../middlewares/protect');

const router=require('express').Router();

// To get the profile
router.get('/:id',protect,getProfile)

// To edit profile
router.put('/edit',protect,editProfile)

// To delete profile
router.delete('/delete',protect,deleteProfile)

module.exports=router