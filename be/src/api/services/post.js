import PageConstant from "../../Breads-Shared/Constants/PageConstants.js";
import { ObjectId } from "../../util/index.js";
import Collection from "../models/collection.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import SurveyOption from "../models/surveyOption.model.js";
import { Constants } from "../../Breads-Shared/Constants/index.js";
import PostConstants from "../../Breads-Shared/Constants/PostConstants.js";

export const getPostDetail = async ({ postId, getFullInfo = false }) => {
  try {
    const getRelativeProp = [
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
                followed: 1,
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
          from: "links",
          localField: "links",
          foreignField: "_id",
          as: "linksInfo",
        },
      },
      {
        $lookup: {
          from: "files",
          localField: "files",
          foreignField: "_id",
          as: "files",
        },
      },
    ];

    const agg = [
      {
        $match: { _id: ObjectId(postId) },
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
      ...getRelativeProp,
    ];
    if (getFullInfo) {
      agg.push({
        $lookup: {
          from: "posts",
          localField: "replies",
          foreignField: "_id",
          pipeline: [...getRelativeProp],
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
          followed: 1,
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
    console.log("getPostDetail: ", err);
    return null;
  }
};

const getQueryPostValidation = (filter) => {
  const user = filter.user;
  const postContent = filter?.postContent;
  const postType = filter?.postType;
  if (!user && !postContent && !postType) {
    return { status: Constants.POST_STATUS.PENDING };
  }
  let userQuery = null;
  let postContentQuery = null;
  let postTypeQuery = null;
  if (!!user) {
    userQuery = {
      authorId: ObjectId(user),
    };
  }
  if (!!postContent && postContent?.length > 0) {
    const contentConditions = [];
    const { GIF, IMAGE, VIDEO } = Constants.MEDIA_TYPE;
    postContent.forEach((contentType) => {
      if (contentType === "text") {
        contentConditions.push({
          $and: [{ media: { $size: 0 } }, { survey: { $size: 0 } }],
        });
      } else if (contentType === GIF) {
        contentConditions.push({ "media.type": GIF });
      } else if (contentType === IMAGE) {
        contentConditions.push({ "media.type": IMAGE });
      } else if (contentType === VIDEO) {
        contentConditions.push({ "media.type": VIDEO });
      } else if (contentType === "survey") {
        contentConditions.push({
          $expr: {
            $gt: [{ $size: "$survey" }, 0],
          },
        });
      }
    });
    postContentQuery = {
      $or: contentConditions,
    };
  }
  if (!!postType && postType?.length > 0) {
    const postTypeConditions = postType.map((type) => {
      return {
        type: type,
      };
    });
    postTypeQuery = {
      $or: postTypeConditions,
    };
  }
  const subQueries = [{ status: Constants.POST_STATUS.PENDING }];
  [userQuery, postContentQuery, postTypeQuery].forEach((subQuery) => {
    if (subQuery) {
      subQueries.push(subQuery);
    }
  });
  const query = {
    $and: subQueries,
  };
  return query;
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

    const { PENDING, PUBLIC, ONLY_ME, ONLY_FOLLOWERS, DELETED } =
      Constants.POST_STATUS;

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
            {
              authorId: ObjectId(userId),
              type: value,
              status: {
                $nin: [PENDING, DELETED],
              },
            },
            { _id: 1 }
          )
            .skip(skip)
            .limit(limit)
            .sort({
              createdAt: -1,
            });
        } else {
          data = await Post.find(
            {
              authorId: ObjectId(userId),
              type: {
                $nin: [
                  PostConstants.ACTIONS.REPLY,
                  PostConstants.ACTIONS.REPOST,
                ],
              },
              status: {
                $nin: [PENDING, DELETED],
              },
            },
            { _id: 1 }
          )
            .skip(skip)
            .limit(limit)
            .sort({
              createdAt: -1,
            });
        }
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
      case PageConstant.ADMIN.POSTS_VALIDATION:
        const query = getQueryPostValidation(filter);
        data = await Post.find(query, { _id: 1 }).skip(skip).limit(limit).sort({
          createdAt: -1,
        });
        break;
      case PageConstant.ADMIN.POSTS:
        data = await Post.find({}, { _id: 1 }).sort({ createdAt: 1 });
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
    console.log("getPostsIdByFilter: ", err);
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
    console.log("handleReplyForParentPost: ", err);
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
        followed: 1,
      }
    );
    return usersTagInfo;
  } catch (err) {
    console.log("getUsersTagInfo: ", err);
  }
};
