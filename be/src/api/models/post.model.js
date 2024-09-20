import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const postSchema = mongoose.Schema(
  {
    authorId: {
      type: ObjectId,
      ref: "users",
      required: true,
    },
    content: {
      type: String,
      maxLength: 500,
    },
    media: {
      type: Array,
      required: false,
    },
    usersLike: [
      {
        type: ObjectId,
        ref: "users",
        default: [],
      },
    ],
    replies: [
      {
        type: ObjectId,
        ref: "posts",
        default: [],
      },
    ],
    parentPost: {
      type: ObjectId,
      ref: "posts",
      required: false,
      default: null,
    },
    survey: [
      {
        type: ObjectId,
        ref: "surveyoptions",
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
