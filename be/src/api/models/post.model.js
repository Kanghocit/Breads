import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const postSchema = mongoose.Schema(
  {
    postedBy: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      maxLength: 500,
    },
    text: {
      type: String,
    },
    img: {
      type: String,
    },
    likes: {
      type: [ObjectId],
      ref: "User",
      default: [],
    },
    replies: [
      {
        userId: {
          type: ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        userProfile: {
          type: String,
        },
        username: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
