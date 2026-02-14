const router = require("express").Router();
const { protect } = require("../middlewares/protect");
const { getMessages, createMessage } = require("../controllers/departmentDiscussion");

router.get("/messages", protect, getMessages);
router.post("/messages", protect, createMessage);

module.exports = router;
