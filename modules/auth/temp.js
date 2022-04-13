const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendMessage } = require("../../utils/sendMessage");
const User = require("../user/userModel");

exports.requestOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const exp = 2 * 60 * 1000;
    const jwt_exp = Date.now() + process.env.OTP_EXP;
    const data = `${phone}.${otp}.${jwt_exp}`;
    const hash = crypto
      .createHmac("sha256", process.env.SMS_SECRET)
      .update(data)
      .digest("hex");
    const fullHash = `${hash}.${jwt_exp}`;
    // sendMessage(`+977${phone}`,'Hellooooooo')
    res.status(200).json({
      success: true,
      message: "OTP request success",
      hash: fullHash,
      phone: phone,
      otp: otp,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "OTP request failed",
      error: error,
    });
  }
};

exports.veriftOtp = (req, res, next) => {
  const { phone, hash, otp } = req.body;
  let [hashValue, jwt_exp] = hash.split(".");
  let now = Date.now();
  console.log(hashValue, hash, jwt_exp, Date.now());
  if (now > parseInt(jwt_exp)) {
    return res.status(504).json({
      success: false,
      message: "Timeout",
    });
  }
  const data = `${phone}.${otp}.${jwt_exp}`;
  const newCalcHash = crypto
    .createHmac("sha256", process.env.SMS_SECRET)
    .update(data)
    .digest("hex");
  if (newCalcHash === hashValue) {
    const accessToken = jwt.sign(
      { data: phone },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: process.env.JWT_ACCESS_EXP }
    );
    const refreshToken = jwt.sign(
      { data: phone },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: process.env.JWT_REFRESH_EXP }
    );

    return res.status(200).json({
      success: true,
      message: "Verified",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Incorrect OTP",
    });
  }
};

exports.register = async (req, res, next) => {
  const profileImages = req.files.map((file) => file.filename);
  let facebookId, twitterId;
  if (req.body.auth === "facebook") {
    facebookId = req.body.facebookId;
  }
  if (req.body.auth === "twitter") {
    twitterId = req.body.twitterId;
  }
  const { phone, name, age, address, gender, star, color, interests, auth } =
    req.body;
  try {
    const user = await User.create({
      auth,
      phone,
      name,
      age,
      address,
      gender,
      star,
      color,
      interests,
      profileImages,
      facebookId,
      twitterId
    });
    res.status(201).json({
      success: true,
      message: "User creation success",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "User creation failed",
      error: error,
    });
  }
};
