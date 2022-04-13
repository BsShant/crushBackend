const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const ChatSchema = new mongoose.Schema({
  message: {
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    video: {
      type: String,
    },
    audio: {
      type: String,
    },
    emoji:{
      type:String,
    }
  },
  conversation: {
    type: mongoose.Schema.ObjectId,
    ref: "Conversation",
    required: true,
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  sent: { type: Boolean, default: false },
  received: { type: Boolean, default: false },

  seen: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Chat", ChatSchema);
