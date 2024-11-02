import PageConstant from "../../Breads-Shared/Constants/PageConstants.js";
import { ObjectId } from "../../util/index.js";
import Collection from "../models/collection.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import SurveyOption from "../models/surveyOption.model.js";

export const getPostDetail = async ({ postId, getFullInfo = false }) => {
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
                bio: 1,
                name: 1,
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
      {
        $lookup: {
          from: "posts",
          let: { searchId: { $toObjectId: "$parentPost" } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$$searchId", "$_id"],
                },
              },
            },
          ],
          as: "parentPostInfo",
        },
      },
      {
        $lookup: {
          from: "links",
          localField: "links",
          foreignField: "_id",
          as: "linksInfo",
        },
      },
    ];
    if (getFullInfo) {
      agg.push({
        $lookup: {
          from: "posts",
          localField: "replies",
          foreignField: "_id",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "authorId",
                foreignField: "_id",
                pipeline: [
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
            {
              $unwind: "$authorInfo",
            },
          ],
          as: "replies",
        },
      });
    }
    let result = (await Post.aggregate(agg))?.[0];
    if (result?.usersTag?.length > 0) {
      const usersTagInfo = await getUsersTagInfo({
        usersTagId: result?.usersTag,
      });
      result.usersTagInfo = usersTagInfo;
    }
    if (result?.parentPostInfo?.length > 0) {
      result.parentPostInfo = result.parentPostInfo[0];
      const parentPostInfo = result.parentPostInfo;
      const userInfo = await User.findOne(
        { _id: parentPostInfo.authorId },
        {
          _id: 1,
          avatar: 1,
          name: 1,
          username: 1,
          bio: 1,
        }
      );
      if (parentPostInfo?.survey.length) {
        const surveyOptions = await SurveyOption.find({
          _id: { $in: parentPostInfo.survey },
        });
        parentPostInfo.survey = surveyOptions;
      }
      if (parentPostInfo?.usersTag?.length > 0) {
        const usersTagInfo = await getUsersTagInfo({
          usersTagId: parentPostInfo?.usersTag,
        });
        parentPostInfo.usersTagInfo = usersTagInfo;
      }
      parentPostInfo.authorInfo = userInfo;
    } else {
      if (result?.parentPostInfo) {
        delete result.parentPostInfo;
      }
    }
    const childrenPost = await Post.find({ parentPost: result?._id });
    if (result) {
      result.repostNum = childrenPost?.length ?? 0;
    }
    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getPostsIdByFilter = async (payload) => {
  try {
    let data = null;
    let { filter, userId, page, limit } = payload;
    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 20;
    }

    const skip = (page - 1) * limit;
    switch (filter.page) {
      case PageConstant.SAVED:
        data = (
          await Collection.findOne({ userId: ObjectId(userId) })
            .skip(skip)
            .limit(limit)
        )?.postsId;
        break;
      case PageConstant.USER || PageConstant.FRIEND:
        const value = filter.value;
        if (!!value) {
          data = await Post.find(
            { authorId: ObjectId(userId), type: value },
            { _id: 1 }
          )
            .skip(skip)
            .limit(limit)
            .sort({
              createdAt: -1,
            });
        } else {
          data = await Post.find(
            { authorId: ObjectId(userId), type: { $nin: ["reply", "repost"] } },
            { _id: 1 }
          )
            .skip(skip)
            .limit(limit)
            .sort({
              createdAt: -1,
            });
        }
        // console.log(data);
        break;
      case PageConstant.FOLLOWING:
        const userInfo = await User.findOne({ _id: userId });
        const userFollowing = JSON.parse(JSON.stringify(userInfo)).following;
        data = await Post.find(
          { type: { $ne: "reply" }, authorId: { $in: userFollowing } },
          { _id: 1 }
        )
          .skip(skip)
          .limit(limit)
          .sort({
            createdAt: -1,
          });
        break;
      case PageConstant.LIKED:
        data = await Post.find({ usersLike: userId }, { _id: 1 })
          .skip(skip)
          .limit(limit)
          .sort({
            createdAt: -1,
          });
        break;
      default:
        data = await Post.aggregate([
          {
            $match: {
              type: { $ne: "reply" },
              authorId: { $ne: ObjectId(userId) },
            },
          },
          {
            $addFields: {
              interactionCount: {
                $add: [
                  { $size: "$usersLike" },
                  { $size: "$replies" },
                  { $size: "$media" },
                  { $size: "$survey" },
                ],
              },
            },
          },
          {
            $sort: { interactionCount: -1 },
          },
          {
            $skip: skip,
          },
          {
            $limit: parseInt(limit),
          },
          {
            $project: {
              _id: 1,
            },
          },
        ]);
        data = data.map(({ _id }) => _id);
        break;
    }
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const handleReplyForParentPost = async ({
  parentId,
  replyId,
  addNew,
}) => {
  try {
    if (addNew) {
      await Post.updateOne(
        {
          _id: parentId,
        },
        {
          $push: { replies: replyId },
        }
      );
    } else {
      await Post.updateOne(
        {
          _id: parentId,
        },
        {
          $pull: { replies: replyId },
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
};

export const getUsersTagInfo = async ({ usersTagId }) => {
  try {
    const usersTagInfo = await User.find(
      {
        _id: { $in: usersTagId },
      },
      {
        _id: 1,
        avatar: 1,
        name: 1,
        username: 1,
        bio: 1,
      }
    );
    return usersTagInfo;
  } catch (err) {
    console.log("getUsersTagInfo: ", err);
  }
};
