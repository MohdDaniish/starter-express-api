const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new Schema(
  {
    mobile: { type: String, required: true},
    chatWithMobile: { type: String, required: true},
    chat: [{ type: Object, required: true }],
    createdAt: {
        type: Date,
        default: Date.now,
      }
  });

  const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;