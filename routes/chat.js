const express = require("express");
const { protect } = require("../middlewares/protect");
const router = express.Router({ mergeParams: true });
const {
  getChats,
  createChat,
  updateChat,
  getMyChats,
  getPrivateChats,
  getChatsInConversation,
  createImageChat,
} = require("../modules/chat/chatController");

const Chat = require("../modules/chat/chatModel");
const { uploadChatImage } = require("../utils/multer");

router.route("/getAllChats").get(protect, getChats);
router
  .route("/getChatsInConvo/:conversationId")
  .get(protect, getChatsInConversation);
router.route("/postChat").post(protect, createChat);
router.route("/postImageChat").post(protect, uploadChatImage, createImageChat);

router.route("/getPrivateChats/:id").get(protect, getPrivateChats);

router.route("/updateChat/:id").put(protect, updateChat);

// const advancedResults = require("../middleware/advancedResults");
// const { protect, authorize } = require("../middleware/auth");

// router.use(protect);
// router.use(authorize("admin"));

// router.route("/").get(advancedResults(User), getUsers).post(createUser);
// router.route("/:id").get(getUser).put(updateUser).delete(deleteUser)
module.exports = router;
