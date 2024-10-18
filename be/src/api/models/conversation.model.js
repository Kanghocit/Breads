import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: ObjectId, ref: "users" }],
    msgIds: [
      {
        type: ObjectId,
        ref: "messages",
        required: false,
      },
    ],
    theme: String,
    emoji: {
      type: String,
      default: "like",
    },
    lastMsgId: {
      type: ObjectId,
      ref: "messages",
      required: false,
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
