import PageConstant from "../../../../share/Constants/PageConstants.js";
import { ObjectId } from "../../util/index.js";
import Collection from "../models/collection.model.js";
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
      {
        $lookup: {
          from: "surveyoptions",
          localField: "survey",
          foreignField: "_id",
          as: "survey",
        },
      },
    ];
    const result = (await Post.aggregate(agg))?.[0];
    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getPostsIdByFilter = async (payload) => {
  try {
    let data = null;
    const filter = payload.filter;
    switch (filter) {
      case PageConstant.SAVED:
        const userId = payload.userId;
        data = (await Collection.findOne({ userId: ObjectId(userId) }))
          ?.postsId;
        break;
      default:
        data = await Post.find({}, { _id: 1 }).sort({ createdAt: -1 });
        break;
    }
    return data;
  } catch (err) {
    console.log(err);
  }
};
