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
    media: [
      {
        type: Object,
        required: false,
      },
    ],
    file: {
      type: ObjectId,
      ref: "File",
      required: false,
    },
    postShared: {
      type: ObjectId,
      ref: "Post",
      required: false,
    },
    links: [
      {
        type: ObjectId,
        ref: "Link",
        required: false,
      },
    ],
    respondTo: {
      type: ObjectId,
      ref: "Message",
      required: false,
    },
    react: [
      {
        type: Object,
        required: false,
      },
    ],
    usersSeen: [
      {
        type: ObjectId,
        ref: "User",
        required: false,
      },
    ],
    isRetrieve: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
