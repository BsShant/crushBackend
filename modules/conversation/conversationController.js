const Conversation = require("./conversationModel");
const { sendMessage } = require("../../utils/sendMessage");
exports.getAllConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.find();
    res.status(200).json({
      success: true,
      message: "All Conversations found",
      conversation: conversation,
    });
  } catch (error) {
    console.log("Error fetching conversation: ", error);

    res.status(400).json({
      success: false,
      message: "Feching all Conversations failed",
      conversation: null,
    });
  }
};

exports.getMyConversation = async (req, res, next) => {
  try {
    const { user } = req;
    const userId = user._id;
    const conversations = await Conversation.find({
      members: { $in: [userId] },
    });
    res.status(200).json({
      success: true,
      message: "My conversations found",
      conversations: conversations,
    });
  } catch (error) {
    console.log("Error fetching my conversation: ", error);

    res.status(400).json({
      success: false,
      message: "Feching my conversations failed",
      conversations: null,
    });
  }
};

exports.getUserConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const conversations = await Conversation.find({ members: { $in: [id] } });
    res.status(200).json({
      success: true,
      message: "User conversations found",
      conversations: conversations,
    });
  } catch (error) {
    console.log("Error fetching conversations: ", error);

    res.status(400).json({
      success: false,
      message: "Feching user conversations failed",
      conversations: null,
    });
  }
};


exports.createConversation = async (req, res, next) => {
  try {
    const { senderId, receiverId } = req.body;
    const conversation = await Conversation.create({ members: [senderId, receiverId] });
    res.status(201).json({
      success: true,
      message: "Conversation creation success",
      conversation: conversation,
    });
  } catch (error) {
    console.log("Error creating conversation: ", error);
    res.status(400).json({
      success: false,
      message: "Conversation creation failed",
      conversation: null,
    });
  }
};

exports.updateConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "Conversation update success",
      conversation: conversation,
    });
  } catch (error) {
    console.log("Conversation update failed: ", error);
    res.status(400).json({
      success: false,
      message: "Conversation update failed",
      conversation: null,
    });
  }
};

exports.deleteChat = async (req, res, next) => {
  try {
    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "Conversation update success",
      conversation: conversation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "User update failed",
      conversation: null,
    });
  }
};
