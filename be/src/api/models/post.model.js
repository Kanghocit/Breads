import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const postSchema = mongoose.Schema(
  {
    authorId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      maxLength: 500,
    },
    media: {
      type: Object,
      required: false,
    },
    usersLike: [
      {
        type: ObjectId,
        ref: "User",
        default: [],
      },
    ],
    replies: [
      {
        type: ObjectId,
        ref: "Post",
        default: [],
      },
    ],
    parentPost: {
      type: ObjectId,
      ref: "Post",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
