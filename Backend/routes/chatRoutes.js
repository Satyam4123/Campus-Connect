const router = require("express").Router();
const { protect } = require("../middlewares/protect");

const {
  sendConnectionReq,
  acceptConnectionReq,
  rejectConnectionReq,
  getPendingRequests,
  getConnectedUsers,
  sendMessage,
  getHistory,
} = require("../controllers/connectionFunctions");

router.post("/request/:receiverId", protect, sendConnectionReq);
router.post("/accept/:senderId", protect, acceptConnectionReq);
router.delete("/reject/:senderId", protect, rejectConnectionReq);
router.get('/requests/pending',protect, getPendingRequests)

router.get('/', protect, getConnectedUsers)
router.post('/send/:receiverId', protect, sendMessage)
router.get('/:receiverId', protect, getHistory)

module.exports = router;
