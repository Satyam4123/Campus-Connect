const router = require("express").Router();
const { protect } = require("../middlewares/protect");

const {
  sendConnectionReq,
  acceptConnectionReq,
  rejectConnectionReq, getPendingRequests} = require("../controllers/connectionFunctions");

router.post("/request/:receiverId", protect, sendConnectionReq);
router.post("/accept/:senderId", protect, acceptConnectionReq);
router.delete("/reject/:senderId", protect, rejectConnectionReq);
router.get('/requests/pending',protect, getPendingRequests)

module.exports = router;
