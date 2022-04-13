const express = require("express");
const { protect } = require("../middlewares/protect");
const router = express.Router({ mergeParams: true });

const {
  getMyConversation,
  getAllConversation,
  createConversation,
  updateConversation,
  getUserConversation,
} = require("../modules/conversation/conversationController");

router.route("/getAllConversation").get(protect, getAllConversation);
router.route("/getMyConversations").get(protect, getMyConversation);
router.route("/postConversation").post(protect, createConversation);
router.route("/getUserConversations/:id").get(protect,getUserConversation);

router.route("/updateConversation/:id").put(protect, updateConversation);

// const advancedResults = require("../middleware/advancedResults");
// const { protect, authorize } = require("../middleware/auth");

// router.use(protect);
// router.use(authorize("admin"));

// router.route("/").get(advancedResults(User), getUsers).post(createUser);
// router.route("/:id").get(getUser).put(updateUser).delete(deleteUser)
module.exports = router;
