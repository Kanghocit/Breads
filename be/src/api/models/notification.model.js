import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const notificationSchema = mongoose.Schema({
  fromUser: {
    type: ObjectId,
    ref: "users",
    required: true,
  },
  toUser: [
    {
      type: ObjectId,
      ref: "users",
      required: true,
    },
  ],
  action: {
    type: String,
    required: true,
  },
  target: {
    type: ObjectId,
    ref: "posts",
    required: false,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
