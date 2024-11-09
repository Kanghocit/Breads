import axios from "axios";
import { uploadFileFromBase64 } from "../../../src/api/utils/index.js";
import Conversation from "../../api/models/conversation.model.js";
import Link from "../../api/models/link.model.js";
import Message from "../../api/models/message.model.js";
import { MESSAGE_PATH, Route } from "../../Breads-Shared/APIConfig.js";
import { Constants } from "../../Breads-Shared/Constants/index.js";
import { ObjectId, destructObjectId, getCollection } from "../../util/index.js";
import Model from "../../util/ModelName.js";
import { getFriendSocketId, getUserSocketByUserId } from "../services/user.js";
import User from "../../api/models/user.model.js";

export default class MessageController {
  static async sendMessage(payload, cb, socket, io) {
    try {
      const { recipientId, senderId, message } = payload;
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, recipientId] },
      });
      const listMsgId = [];
      const listMsg = [];
      const { files, media, content } = message;
      const numberNewMsg =
        files?.length + (media?.length > 0 ? 1 : 0) + (content ? 1 : 0);
      [...Array(numberNewMsg)].map((_) => {
        listMsgId.push(ObjectId());
      });
      console.log("listMsgId: ", listMsgId);
      if (!conversation) {
        conversation = new Conversation({
          participants: [senderId, recipientId],
          msgIds: listMsgId,
          lastMsgId: listMsgId[listMsgId.length - 1],
        });
        await conversation.save();
      } else {
        await Conversation.updateOne(
          {
            _id: ObjectId(conversation._id),
          },
          {
            $push: {
              msgIds: {
                $each: listMsgId,
              },
            },
            $set: {
              lastMsgId: listMsgId[listMsgId.length - 1],
            },
          }
        );
      }
      let currentFileIndex = 0;
      let addMedia = false;
      for (let index = 0; index < listMsgId.length; index++) {
        const _id = listMsgId[index];
        let newMsg = null;
        const msgInfo = {
          _id: _id,
          conversationId: conversation._id,
          sender: senderId,
        };
        if (content?.trim() && index === 0) {
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          const urls = content.match(urlRegex);
          console.log("urls: ", urls);
          const links = [];
          if (urls?.length) {
            for (let url of urls) {
              const { data } = await axios.get(
                `https://api.linkpreview.net?key=d8f12a27e6e5631b820f629ea7f570b8&q=${url}`
              );
              links.push({
                _id: ObjectId(),
                ...data,
              });
            }
          }
          if (links?.length > 0) {
            console.log("links: ", links);
            await Link.insertMany(links, { ordered: false });
          }
          newMsg = {
            ...msgInfo,
            content: content,
            links: links?.map((_id) => _id),
          };
        } else if (media?.length !== 0 && !addMedia) {
          const isAddGif =
            media?.length === 1 && media[0].type === Constants.MEDIA_TYPE.GIF;
          const uploadMedia = media;
          if (!isAddGif) {
            for (let i = 0; i < media.length; i++) {
              const imgUrl = await uploadFileFromBase64({
                base64: media[i].url,
              });
              uploadMedia[i] = {
                url: imgUrl ?? media[i].url,
                type: Constants.MEDIA_TYPE.IMAGE,
              };
            }
          }
          console.log("uploadMedia: ", uploadMedia);
          newMsg = new Message({
            ...msgInfo,
            media: uploadMedia,
          });
          addMedia = true;
        } else if (
          files?.length !== 0 &&
          (files?.length > 1
            ? currentFileIndex < files?.length - 1
            : currentFileIndex < files?.length)
        ) {
          newMsg = new Message({
            ...msgInfo,
            file: files[currentFileIndex],
          });
          currentFileIndex += 1;
        }
        console.log("newMsg: ", newMsg);
        listMsg.push(newMsg);
      }
      await Message.insertMany(listMsg, { ordered: false });
      const newMessages = await Message.find({
        _id: { $in: listMsgId },
      }).populate({
        path: "file",
      });
      const recipientSocketId = await getUserSocketByUserId(recipientId, io);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit(
          Route.MESSAGE + MESSAGE_PATH.GET_MESSAGE,
          newMessages
        );
      }
      !!cb && cb(newMessages);
    } catch (error) {
      console.error("sendMessage: ", error);
      cb([]);
    }
  }

  static async getMessage(payload, socket, io) {
    const { otherUserId, userId } = payload;
    try {
      const conversation = await getCollection(Model.CONVERSATION).findOne({
        participants: { $all: [userId, otherUserId] },
      });

      const messages = await getCollection(Model.MESSAGE)
        .find({
          conversationId: ObjectId(conversation._id),
        })
        .sort({ createdAt: 1 })
        .lean();
    } catch (error) {
      console.error("getMessage: ", error);
    }
  }

  static async deleteMessage(payload, socket, io) {
    try {
      const { messageId, userId } = payload;
      const mess = await getCollection(Model.MESSAGE).findOne({
        _id: ObjectId(messageId),
      });
      if (mess.sender.toString() !== userId.toString()) {
      }

      await getCollection(Model.MESSAGE).deleteOne({
        _id: ObjectId(messageId),
      });
    } catch (error) {
      console.error("deleteMessage: ", error);
    }
  }

  static async getConversations(payload, cb) {
    const { userId, page, limit, searchValue } = payload;
    try {
      const skip = (page - 1) * limit;
      const agg = [
        {
          $match: {
            participants: ObjectId(userId),
          },
        },
        {
          $project: {
            otherParticipant: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: "$participants",
                    cond: { $ne: ["$$this", ObjectId(userId)] }, // Exclude userId
                  },
                },
                0,
              ],
            },
            theme: 1,
            emoji: 1,
            lastMsgId: 1,
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
        {
          $sort: {
            updatedAt: -1,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "otherParticipant",
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
            as: "participant",
          },
        },
        {
          $match: {
            "participant.username": {
              $regex: searchValue,
              $options: "i",
            },
          },
        },
        {
          $unwind: "$participant",
        },
        {
          $lookup: {
            from: "messages",
            localField: "lastMsgId",
            foreignField: "_id",
            as: "lastMsg",
          },
        },
        {
          $unwind: "$lastMsg",
        },
      ];
      const conversations = await Conversation.aggregate(agg);
      const result = conversations.map((conversation) => {
        delete conversation.otherParticipant;
        delete conversation.lastMsgId;
        return conversation;
      });
      cb({ status: "success", data: result });
    } catch (error) {
      console.error("getConversations: ", error);
      cb({ status: "error", data: [] });
    }
  }
  static async getMessages(payload, cb) {
    const { userId, conversationId, page, limit } = payload;
    const skip = (page - 1) * limit;
    try {
      if (!userId) {
        cb({ status: "error", data: [] });
        return;
      }
      const conversation = await Conversation.findOne(
        {
          _id: ObjectId(conversationId),
        },
        {
          msgIds: 1,
        }
      );
      if (!conversation) {
        cb({ status: "error", data: [] });
        return;
      }
      const msgs = await Message.find({
        conversationId: ObjectId(conversationId),
      })
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "file",
        })
        .populate({
          path: "links",
        });
      const result = msgs?.sort((a, b) => -1);
      cb({ status: "success", data: result });
    } catch (error) {
      console.error("getConversations: ", error);
      cb({ status: "error", data: [] });
    }
  }
  static async getMsgsToSearchMsg(payload, cb) {
    try {
      const { userId, conversationId, limit, searchMsgId, currentPage } =
        payload;
      if (!userId) {
        cb({ status: "error", data: [] });
        return;
      }
      const conversation = await Conversation.findOne(
        {
          _id: ObjectId(conversationId),
        },
        {
          msgIds: 1,
        }
      );
      if (!conversation) {
        cb({ status: "error", data: [] });
        return;
      }
      const msgIds = conversation?.msgIds.map((id) => destructObjectId(id));
      const searchMsgIndex = msgIds?.findIndex((id) => id === searchMsgId);
      const page = Math.ceil((msgIds.length - searchMsgIndex) / limit);
      if (page <= currentPage) {
        cb({ status: "success", data: [] });
      } else {
        const skip = currentPage * limit;
        const newLimit = (page - currentPage) * limit;
        const msgs = await Message.find({
          _id: { $in: msgIds },
        })
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(newLimit)
          .populate({
            path: "file",
          })
          .populate({
            path: "links",
          });
        const result = msgs?.sort((a, b) => -1);
        cb({ status: "success", data: result, page: page });
      }
    } catch (err) {
      console.error("getMsgsToSearchMsg: ", err);
      cb({ status: "error", data: [], page: 1 });
    }
  }
  static async reactMsg(payload, cb, io) {
    try {
      const { participantId, userId, msgId, react } = payload;
      if (!msgId || !participantId) {
        cb({ status: "error", data: [] });
        return;
      }
      const msgInfo = await Message.findOne({
        _id: ObjectId(msgId),
      });
      const msgReact = msgInfo?.reacts;
      const validUserReact = msgReact?.find(
        (userReact) => userReact?.userId === userId
      );
      let result = null;
      if (validUserReact) {
        let newReacts = [];
        if (validUserReact?.react === react) {
          newReacts = msgReact.filter((react) => react?.userId !== userId);
        } else {
          newReacts = msgReact?.map((reactInfo) => {
            if (reactInfo?.userId === userId) {
              return {
                userId: userId,
                react: react,
              };
            }
            return reactInfo;
          });
        }
        await Message.updateOne(
          {
            _id: ObjectId(msgId),
          },
          {
            $set: {
              reacts: newReacts,
            },
          }
        );
        result = await Message.findOne({
          _id: ObjectId(msgId),
        });
      } else {
        const newReact = {
          userId: userId,
          react: react,
        };
        await Message.updateOne(
          {
            _id: ObjectId(msgId),
          },
          {
            $push: {
              reacts: newReact,
            },
          }
        );
        result = await Message.findOne({
          _id: ObjectId(msgId),
        });
      }
      !!cb && cb({ status: "success", data: result });
      const participantSocketId = await getUserSocketByUserId(
        participantId,
        io
      );
      if (participantSocketId) {
        io.to(participantSocketId).emit(
          Route.MESSAGE + MESSAGE_PATH.UPDATE_MSG,
          result
        );
      }
    } catch (err) {
      console.log("reactMsg: ", err);
      cb({ status: "error", data: null });
    }
  }
}
