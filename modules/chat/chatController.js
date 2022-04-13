const Chat = require("./chatModel");
const { sendMessage } = require("../../utils/sendMessage");
exports.getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find();
    res.status(200).json({
      success: true,
      message: "Chats found",
      chats: chats,
    });
  } catch (error) {
    console.log("Error fetching chat: ", error);

    res.status(400).json({
      success: false,
      message: "Feching chats failed",
      chats: null,
    });
  }
};

exports.getChatsInConversation = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const chats = await Chat.find({ conversation: conversationId });
    res.status(200).json({
      success: true,
      message: "Chats in conversation found",
      chats: chats,
    });
  } catch (error) {
    console.log("Error fetching chats in converstion: ", error);

    res.status(400).json({
      success: false,
      message: "Feching chats in conversation failed",
      chats: null,
    });
  }
};

exports.getPrivateChats = async (req, res, next) => {
  try {
    const { user } = req;
    const withUser = req.params.id;
    const chats = await Chat.find({
      users: {
        $all: [user._id, withUser],
      },
    });
    res.status(200).json({
      success: true,
      message: "our chats found",
      chats: chats,
    });
  } catch (error) {
    console.log("Error fetching our chats: ", error);

    res.status(400).json({
      success: false,
      message: "Feching our chats failed",
      chats: null,
    });
    next(error);
  }
};

exports.createChat = async (req, res, next) => {
  try {
    const { sender, message, conversation } = req.body;
    const chat = await Chat.create({ conversation, sender, message });
    res.status(201).json({
      success: true,
      message: "Chat creation success",
      chat: chat,
    });
  } catch (error) {
    console.log("Error creating chat: ", error);
    res.status(400).json({
      success: false,
      message: "Chat creation failed",
      chat: null,
    });
  }
};

exports.createImageChat = async (req, res, next) => {
  try {
    const file = req.files[0];
    let image, video;
    const message = {
      image: "",
      text: "",
      video: "",
      voice: "",
      emoji: "",
    };
    if (file.mimetype.includes("video")) {
      message.video = file.filename;
    }
    if (file.mimetype.includes("image")) {
      message.image = file.filename;
    }

    const { sender, conversation } = req.body;

    const chat = await Chat.create({ conversation, sender, message });
    res.status(201).json({
      success: true,
      message: "Chat creation success",
      chat: chat,
    });
  } catch (error) {
    console.log("Error creating chat: ", error);
    res.status(400).json({
      success: false,
      message: "Chat creation failed",
      chat: null,
    });
  }
};

exports.updateChat = async (req, res, next) => {
  try {
    const chat = await Chat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      message: "Chat update success",
      chat: chat,
    });
  } catch (error) {
    console.log("Chat update failed: ", error);
    res.status(400).json({
      success: false,
      message: "Chat update failed",
      chat: null,
    });
  }
};

exports.deleteChat = async (req, res, next) => {
  try {
    const chat = await Chat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      message: "User update success",
      chat: chat,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "User update failed",
      error: error,
    });
  }
};
