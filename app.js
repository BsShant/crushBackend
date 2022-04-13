const express = require("express");
const colors = require("colors");
const env = require("dotenv");
const morgan = require("./middlewares/logger");
const cookieParser = require("cookie-parser");
const socket = require("socket.io");
var admin = require("firebase-admin");

var serviceAccount = require("./crush-340307-firebase-adminsdk-monqy-06a4209d3e.json");
token = [
  "eHQDTBkwRFS496wpdQ1djU:APA91bFz9yqVYG6985WmSKOwQWHF2zrAHkLFJBid9A9zfReHXrYaTcoK0EPniNM_UyOyGhIK3aju6v_6YUiIDZWe1U0pdITH3ddjYgYBtzTEEtU250lm8k1Va9TsuA12P97Z0xnMNzxT",
  "f3BRZTRkSkaoyqTboOBAio:APA91bEjuATra5nZqhYz3c9-wUG35I-DpRRtz9t6-w-CCyrl546F1F-ZggZwYHUiuO2q5e8hsG-xgOKGLBzdM7On5bXYIc2MoOp2pqGkF5OQ6pTqG0aJgjKNPnYRvGjp6FW-a-VBxjpq",
];

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

admin
  .messaging()
  .sendToDevice(token, {
    data: {
      customData: "dene",
      id: "s",
      ad: "mtmtm",
    },
    // android: {
      notification: {
        body: "iehdxihdhid",
        title: "djdidjjd",
        color: "#ffffff",
        priority: "high",
        sound: "default",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/a/ad/Angelina_Jolie_2_June_2014_(cropped).jpg",
      },
    // },
  })
  .then((msg) => console.log("Message: ", msg));

//load dotenv
env.config({ path: "./config/config.env" });

//link db path
const connectDb = require("./config/db");

//connect db
connectDb();

//import route files
const user = require("./routes/user");
const chat = require("./routes/chat");
const auth = require("./routes/auth");
const conversation = require("./routes/conversation");

//load express
const app = express();

//body parser
app.use(express.json());

//cookie parser
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV == "development") {
  app.use(morgan());
}

app.use(express.urlencoded({ extended: false }));

// //set static folder
var publicDir = require("path").join(__dirname, "/public");
app.use(express.static(publicDir));

app.use("/api/user", user);
app.use("/api/chat", chat);
app.use("/api/auth", auth);
app.use("/api/conversation", conversation);

const server = app.listen(process.env.PORT, () => {
  console.log("The server is listening on port 5000");
});

const io = socket(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

global.onlineUsers = new Map();

let users = [];
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const user = getUser(receiverId);
    console.log("message send")
    io.to(user.socketId).emit("getMessage", {
      sender: senderId,
      message,
    });
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
  // global.chatsocket = socket
  //  socketsocket.on("add-user", (userId)=>{
  //   onlineUsers.set(userId, socket.id)
  // })
  // socket.on("send-msg", (data)=>{
  //   const sendUserSocket = onlineUsers.get(data.to)
  //   if(sendUserSocket){
  //     socket.to(sendUserSocket).emit("msg-received", data.msg)
  //   }
  // })
});
