const path = require("path");
const multer = require("multer");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    try {
      const { phone } = req;
      var dest = path.join(__dirname, `../public/uploads/${phone}/`);
      fs.access(dest, function (error) {
        if (error) {
          console.log("Directory does not exist.");
          fs.mkdir(dest, (error) => callback(error, dest));
        } else {
          console.log("Directory exists.");
          callback(null, dest);
        }
      });
    } catch (error) {
      console.log("Error uploading image: ", error.message);
    }
  },
  filename: (req, file, callback) => {
    const ext = file.mimetype.split("/")[1];
    callback(null, `${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fieldSize: 25 * 1024 * 1024 },
});
exports.uploadProfileImage = upload.any();





const chatStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    try {
      const { phone } = req.user;
      var dest = path.join(__dirname, `../public/uploads/${phone}/`);
      fs.access(dest, function (error) {
        if (error) {
          console.log("Directory does not exist.");
          fs.mkdir(dest, (error) => callback(error, dest));
        } else {
          console.log("Directory exists.");
          callback(null, dest);
        }
      });
    } catch (error) {
      console.log("Error uploading image: ", error.message);
    }
  },
  filename: (req, file, callback) => {
    const ext = file.mimetype.split("/")[1];
    callback(null, `${file.originalname}`);
  },
});

const uploadChat = multer({
  storage: chatStorage,
  limits: { fieldSize: 25 * 1024 * 1024 },
});
exports.uploadChatImage = uploadChat.any();