const { getProfile, editProfile,deleteProfile,uploadProfilePic } = require('../controllers/profileFunctions');
const { protect } = require('../middlewares/protect');
const upload = require('../middlewares/upload');

const router=require('express').Router();

// To get the profile
router.get('/:id',protect,getProfile)

// To edit profile
router.put('/edit',protect,editProfile)

// To delete profile
router.delete('/delete',protect,deleteProfile)

router.post('/uploadProfilePic',protect, upload.single('image') ,uploadProfilePic)

module.exports=router