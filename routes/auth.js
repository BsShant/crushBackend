const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  requestOtp,
  register,
  verifyOtp,
  checkExternalAuth,
  logout,
  getMe,
} = require("../modules/auth/phoneAuthController");

const User = require("../modules/user/userModel");
const { protect, registerProtect } = require("../middlewares/protect");
const { uploadProfileImage } = require("../utils/multer");

router.route("/requestOtp").post(requestOtp);
router.route("/verifyOtp").post(verifyOtp);
router.route("/register").post(registerProtect, uploadProfileImage, register);
router.route("/checkExtAuth").post(checkExternalAuth);
router.route("/logout").get(protect, logout);
router.route("/me").get(protect, getMe);

// const advancedResults = require("../middleware/advancedResults");
// const { protect, authorize } = require("../middleware/auth");

// router.use(protect);
// router.use(authorize("admin"));

// router.route("/").get(advancedResults(User), getUsers).post(createUser);
// router.route("/:id").get(getUser).put(updateUser).delete(deleteUser)
module.exports = router;
