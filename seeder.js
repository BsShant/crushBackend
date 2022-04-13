const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

//load env vars
dotenv.config({ path: "./config/config.env" });

//load models
const User = require("./modules/user/userModel");
const Chat = require("./modules/chat/chatModel");
const Conversation = require("./modules/conversation/conversationModel");


//connect to db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//read json file

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);
const chats = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/chats.json`, "utf-8")
);
const conversations = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/conversations.json`, "utf-8")
);

//import into db
const importData = async () => {
  try {
    await User.create(users);
    await Chat.create(chats);
    await Conversation.create(conversations);


    console.log("Data imported...".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

//delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Chat.deleteMany();
    await Conversation.deleteMany();


    console.log("Data deleted...".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
