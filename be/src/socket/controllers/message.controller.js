import Conversation from "../../api/models/conversation.model.js";
import Message from "../../api/models/message.model.js";
import { MESSAGE_PATH, Route } from "../../Breads-Shared/APIConfig.js";
import { ObjectId, destructObjectId, getCollection } from "../../util/index.js";
import Model from "../../util/ModelName.js";
import { getFriendSocketId } from "../services/user.js";

export default class MessageController {
  static async sendMessage(payload, cb, socket, io) {
    try {
      const { recipientId, senderId, message } = payload;
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, recipientId] },
      });
      const msgId = ObjectId();
      const listMsgId = [];
      const listMsg = [];
      const { files, media, content } = message;
      console.log({
        files: files,
        media: media,
        content: content,
      });
      const numberNewMsg =
        files?.length + (media?.length > 0 ? 1 : 0) + (content ? 1 : 0);
      console.log("numberNewMsg: ", numberNewMsg);
      [...Array(numberNewMsg)].map((_) => {
        listMsgId.push(ObjectId());
      });
      console.log("listMsgId: ", listMsgId);
      if (!conversation) {
        conversation = new Conversation({
          participants: [senderId, recipientId],
          msgIds: listMsgId,
          lastMsgId: msgId,
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
      listMsgId.forEach((_id, index) => {
        let newMsg = null;
        const msgInfo = {
          _id: _id,
          conversationId: conversation._id,
          sender: senderId,
        };
        if (content?.trim() && index === 0) {
          newMsg = new Message({
            ...msgInfo,
            content: content,
          });
        } else if (media?.length !== 0 && !addMedia) {
          newMsg = new Message({
            ...msgInfo,
            media: media,
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
        listMsg.push(newMsg);
      });
      await Message.insertMany(listMsg, { ordered: false });
      const newMessages = await Message.find({
        _id: { $in: listMsgId },
      }).populate({
        path: "file",
      });
      const friendOnline = socket.friendsInfo?.find(
        (socketInfo) => socketInfo?.userId === recipientId
      );
      if (!friendOnline) {
        const recipientSocketId = await getFriendSocketId(
          recipientId,
          io,
          socket
        );
        if (recipientSocketId) {
          socket.data.friendsInfo = [
            ...socket.data.friendsInfo,
            {
              socketId: recipientSocketId,
              userId: recipientId,
            },
          ];
          io.to(recipientSocketId).emit(
            Route.MESSAGE + MESSAGE_PATH.GET_MESSAGE,
            newMessages
          );
        }
      }
      !!cb && cb(newMessages);
    } catch (error) {
      console.error("sendMessage: ", error);
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
    const { userId, page, limit } = payload;
    try {
      const skip = (page - 1) * limit;
      const conversations = await Conversation.find(
        {
          participants: ObjectId(userId),
        },
        {
          createdAt: 0,
          msgIds: 0,
        }
      )
        .skip(skip)
        .limit(limit)
        .sort({
          updatedAt: -1,
        })
        .populate({
          path: "participants",
          select: "_id username avatar",
        })
        .populate({
          path: "lastMsgId",
          select: "_id content media files sender createdAt",
        })
        .lean();
      const result = conversations.map((conversation) => {
        const participant = conversation.participants.filter(
          ({ _id }) => destructObjectId(_id) !== userId
        );
        conversation.lastMsg = conversation.lastMsgId;
        delete conversation.participants;
        delete conversation.lastMsgId;
        return {
          ...conversation,
          participant: participant[0],
        };
      });
      cb({ status: "success", data: result });
    } catch (error) {
      console.error("getConversations: ", error);
    }
  }
  static async getMessages(payload, cb) {
    const { userId, conversationId } = payload;
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
      const msgIds = conversation.msgIds.map((id) => destructObjectId(id));
      const msgs = await Message.find({
        _id: { $in: msgIds },
      })
        .sort({
          createdAt: 1,
        })
        .populate({
          path: "file",
        });
      cb({ status: "success", data: msgs });
    } catch (error) {
      console.error("getConversations: ", error);
    }
  }
}
