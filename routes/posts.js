const mongoose = require("mongoose");

// Define Post schema
const postSchema = new mongoose.Schema({
  postText: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  // it stores id of the user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // to get id of user fromuserschema
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Array,
    default: [],
  },
});

// Compile model from schema
module.exports = mongoose.model("Post", postSchema);
