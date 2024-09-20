import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const collectionSchema = mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: "users",
    required: true,
  },
  postsId: [
    {
      type: ObjectId,
      default: [],
      required: false,
    },
  ],
});

const Collection = mongoose.model("Collection", collectionSchema);

export default Collection;
