const { getRecommendations } = require('../controllers/getRecommendations');
const { protect } = require('../middlewares/protect');

const router=require('express').Router();

router.get('/popularity',protect,getRecommendations)

module.exports=router