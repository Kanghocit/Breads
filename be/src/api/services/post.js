import { ObjectId } from "../../util/index.js";
import Post from "../models/post.model.js";

export const getPostDetail = async (postId) => {
  try {
    const agg = [
      {
        $match: { _id: ObjectId(postId) },
      },
      {
        $lookup: {
          from: "users",
          let: { searchId: { $toObjectId: "$authorId" } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$$searchId", "$_id"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                username: 1,
                avatar: 1,
              },
            },
          ],
          as: "authorInfo",
        },
      },
      { $unwind: "$authorInfo" },
    ];
    const result = (await Post.aggregate(agg))?.[0];
    return result;
  } catch (err) {
    return null;
    console.log(err);
  }
};
