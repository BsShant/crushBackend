const User = require("./userModel");
const { sendMessage } = require("../../utils/sendMessage");
exports.getUsers = async (req, res, next) => {
  try {
    const user = await User.find();
    res.status(201).json({
      success: true,
      message: "Users found",
      user: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "User get failed",
      error: error,
    });
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      message: "User creation success",
      user: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "User creation failed",
      error: error,
    });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      message: "User update success",
      user: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "User update failed",
      error: error,
    });
  }
};


exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      success: true,
      message: "User found",
      user: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "User not found",
      error: error,
    });
  }
};