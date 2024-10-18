import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: ObjectId, ref: "conversations", required: true },
    sender: { type: ObjectId, ref: "users", required: true },
    content: String,
    media: {
      type: Array,
      required: false,
    },
    files: [
      {
        type: ObjectId,
        ref: "files",
        required: false,
      },
    ],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
