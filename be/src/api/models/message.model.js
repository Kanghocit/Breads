import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: ObjectId, ref: "Conversation", required: true },
    sender: { type: ObjectId, ref: "User", required: true },
    content: {
      type: String,
      required: false,
    },
    media: {
      type: Array,
      required: false,
    },
    files: [
      {
        type: ObjectId,
        ref: "File",
        required: false,
      },
    ],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
