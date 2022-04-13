const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getUsers,
  createUser,
  updateUser,
  getUser,
} = require("../modules/user/userController");

const User = require("../modules/user/userModel");

router.route("/").get(getUsers);
router.route("/:id").get(getUser);

router.route("/").post(createUser);
router.route("/:id").put(updateUser);

// const advancedResults = require("../middleware/advancedResults");
// const { protect, authorize } = require("../middleware/auth");

// router.use(protect);
// router.use(authorize("admin"));

// router.route("/").get(advancedResults(User), getUsers).post(createUser);
// router.route("/:id").get(getUser).put(updateUser).delete(deleteUser)
module.exports = router;
