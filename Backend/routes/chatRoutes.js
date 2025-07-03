const router = require("express").Router();
const { protect } = require("../middlewares/protect");

const {
  sendConnectionReq,
  acceptConnectionReq,
  getConnectedUsers,
  sendMsg,
  loadChat,
} = require("../controllers/chatFunctions");

router.post("/request/:receiverId", protect, sendConnectionReq);
router.post("/accept/:requestId", protect, acceptConnectionReq);
router.get("/connections", protect, getConnectedUsers);

router.post("/send/:receiverId", protect, sendMsg);
router.get("/loadAll/:receiverId", protect, loadChat);

module.exports = router;
