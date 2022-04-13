const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema({
  auth: {
    type: String,
    enum: ["phone", "facebook", "google"],
    required: [true, "Please add auth type"],
  },
  facebookId: {
    type: String,
    required: false,
  },
  googleId: {
    type: String,
    required: false,
  },
  phone: {
    type: Number,
    unique: true,
    required: [true, "Please add your mobile number"],
  },
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  age: {
    type: Number,
    required: [true, "Please add your age"],
  },
  address: {
    type: String,
    required: [true, "Please add address"],
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: [true, "Please add your gender"],
  },
  star: {
    type: String,
    required: [true, "Please add your star sign"],
  },
  color: {
    type: String,
    required: [true, "Please add your color"],
  },
  interests: {
    type: [String],
    required: [true, "Please add your interests"],
  },
  profileImages: {
    type: [String],
    required: [true, "Please add your image"],
  },
  premium: {
    type: Boolean,
    default: false,
    required: [true, "Please add your image"],
  },
  location:{
    required:false,

    type:{
      type: String,
      enum:['POINT']
    },
    coordinates:{
      type:[Number],
      index:'2dsphere'
    }

  },
  
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

//Cascade delete courses when bootcamp is deleted
// BootcampSchema.pre('remove', async function(next){
//   console.log(`Courses being removed from bootcamp ${this._id}`)
//   await this.model('Course').deleteMany({ bootcamp: this._id})
//   next()
// })

module.exports = mongoose.model("User", UserSchema);
