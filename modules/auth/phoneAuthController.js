const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendMessage } = require("../../utils/sendMessage");
const User = require("../user/userModel");
const Token = require("../token/tokenModel");

//requestOtp
exports.requestOtp = async (req, res, next) => {
  const { phone } = req.body;
  if (req.body.auth) {
    sendOtp(phone, req.body.auth, req.body.authId, req, res, next);
  } else {
    sendOtp(phone, null, null, req, res, next);
  }
};

//verifyOtp
exports.verifyOtp = (req, res, next) => {
  const { phone, hash, otp } = req.body;
  try {
    if (req.body.auth && req.body.authId) {
      verifyOtp(res, otp, phone, hash, req.body.auth, req.body.authId);
    } else {
      verifyOtp(res, otp, phone, hash);
    }
  } catch (error) {
    console.log("Otp verification failed: ", error);
    next(error);
  }
};

//check if the user exists through external medium
exports.checkExternalAuth = async (req, res, next) => {
  try {
    let user = null;
    if (req.body.googleId) {
      user = await User.findOne({ googleId: req.body.googleId });
    }
    if (req.body.facebookId) {
      user = await User.findOne({ facebookId: req.body.facebookId });
    }
    if (user) {
      generateTokens(res, user.phone, user, "login");
    } else {
      return res.status(404).json({
        message: "User not found",
        user: null,
      });
    }
  } catch (error) {
    console.log("Error authenticating through external source: ", error);
    next(error);
  }
};

//register user
exports.register = async (req, res, next) => {
  const profileImages = req.files.map((file) => file.filename);
  let facebookId, googleId;
  if (req.body.auth === "facebook") {
    facebookId = req.body.facebookId;
  }
  if (req.body.auth === "google") {
    googleId = req.body.googleId;
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
      googleId,
    });
    generateTokens(res, phone, user, "register");
  } catch (error) {
    console.log("Error registering users", error);
    return res.status(400).json({
      success: false,
      message: "User creation failed",
      error: error,
    });
  }
};

//logout
exports.logout = async (req, res, next) => {
  try {
    const { user } = req;
    const myToken = await Token.findOne({ user: user._id });
    const updateToken = await Token.findByIdAndUpdate(
      myToken._id,
      { refreshTokens: [] },
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).json({
      message: "Logout success",
      user: null,
      accessToken: null,
      refreshToken: null,
    });
  } catch (error) {
    console.log("Error while logging out: ", error);
    next(error);
  }
};

//send otp function
const sendOtp = (phone, auth, authId, req, res, next) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const exp = 2 * 60 * 1000;
    const jwt_exp = Date.now() + process.env.OTP_EXP;
    const data = `${phone}.${otp}.${jwt_exp}`;
    const hash = crypto
      .createHmac("sha256", process.env.SMS_SECRET)
      .update(data)
      .digest("hex");

    const fullHash = `${hash}.${jwt_exp}`;
    // sendMessage(`+977${phone}`,`Your otp is ${otp}.`)
    console.log(otp);
    res.status(200).json({
      success: true,
      message: "OTP request success",
      hash: fullHash,
      phone: phone,
      otp: otp,
      auth: auth,
      authId,
    });
  } catch (error) {
    console.log("Error generating otp:", error);
    res.status(400).json({
      success: false,
      message: "OTP request failed",
      error: error,
    });
  }
};

//verify otp
const verifyOtp = async (res, otp, phone, hash, auth, authId) => {
  let [hashValue, jwt_exp] = hash.split(".");
  let now = Date.now();
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
    let userExists = false;
    const user = await User.findOne({ phone: phone });
    if (user) {
      userExists = true;
      const accessToken = jwt.sign(
        { data: user._id },
        process.env.JWT_ACCESS_TOKEN,
        { expiresIn: process.env.JWT_ACCESS_EXP }
      );
      const refreshToken = jwt.sign(
        { data: user._id },
        process.env.JWT_REFRESH_TOKEN,
        { expiresIn: process.env.JWT_REFRESH_EXP }
      );
      const myToken = await Token.findOne({ user: user._id });
      const updateToken = await Token.findByIdAndUpdate(
        myToken._id,
        { refreshTokens: [...myToken.refreshTokens, refreshToken] },
        {
          new: true,
          runValidators: true,
        }
      );
      return res.status(200).json({
        success: true,
        userExists,
        user,
        message: "OTP Verified. User found!",
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    }
    const accessToken = jwt.sign(
      { data: phone },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: "15m" }
    );
    return res.status(404).json({
      success: true,
      userExists,
      user: null,
      phone: phone,
      auth,
      authId,
      message: "Otp verified. User not found. Please Register!",
      accessToken: accessToken,
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Incorrect OTP",
    });
  }
};

exports.renewAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
    const currentTime = Date.now() / 1000;
    if (currentTime > decoded.exp) {
      return res.status(400).json({
        message:
          "The refresh token has expired, user need to reauthenticate again",
        user: null,
      });
    } else {
      const accessToken = jwt.sign(
        { data: decoded.data },
        process.env.JWT_ACCESS_TOKEN,
        { expiresIn: process.env.JWT_ACCESS_EXP }
      );
      return res.status(201).json({
        success: true,
        message: "Renew access token success",
        refreshToken: refreshToken,
        accessToken: accessToken,
      });
    }
  } catch (error) {
    console.log("Generating refresh token failed: ", error);
    return res.status(201).json({
      success: true,
      message: "refresh token invalid",
      refreshToken: null,
      accessToken: null,
      user: null,
    });
  }
};

//generate tokens
const generateTokens = async (res, phone, user, type) => {
  try {
    const accessToken = jwt.sign(
      { data: user._id },
      process.env.JWT_ACCESS_TOKEN,
      {
        expiresIn: process.env.JWT_ACCESS_EXP,
      }
    );
    const refreshToken = jwt.sign(
      { data: user._id },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: process.env.JWT_REFRESH_EXP }
    );
    let myToken = await Token.findOne({ user: user._id });
    if (!myToken) {
      const newToken = await Token.create({
        user: user._id,
        refreshTokens: [refreshToken],
      });
    } else {
      const updateToken = await Token.findByIdAndUpdate(
        myToken._id,
        { refreshTokens: [...myToken.refreshTokens, refreshToken] },
        {
          new: true,
          runValidators: true,
        }
      );
    }
    if (type === "register") {
      return res.status(201).json({
        success: true,
        message: "User creation success",
        user: user,
        refreshToken: refreshToken,
        accessToken: accessToken,
      });
    }

    return res.status(200).json({
      success: true,
      userExists: true,
      message: "User auth success",
      user: user,
      refreshToken: refreshToken,
      accessToken: accessToken,
    });
  } catch (error) {
    console.log("Error on generating tokens:", error);
    return res.status(400).json({
      success: false,
      message: "Database Error!",
      user: null,
      refreshToken: null,
      accessToken: null,
    });
  }
};

//get me
exports.getMe = async (req, res, next) => {
  try {
    const { user } = req;
    if (user) {
      return res.status(200).json({
        message: "User found!",
        user: user,
      });
    }
    return res.status(404).json({
      message: "User not found!",
      user: null,
    });
  } catch (error) {
    next(error);
  }
};
