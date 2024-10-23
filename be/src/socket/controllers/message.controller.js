import { ObjectId, destructObjectId, getCollection } from "../../util/index.js";
import Model from "../../util/ModelName.js";
import Conversation from "../../api/models/conversation.model.js";
import Message from "../../api/models/message.model.js";
import { uploadFile, uploadFileFromBase64 } from "../../api/utils/index.js";
import File from "../../api/models/file.model.js";

export default class MessageController {
  static async sendMessage(payload, socket, io) {
    try {
      const { recipientId, senderId, message } = payload;
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, recipientId] },
      });
      const msgId = ObjectId();
      if (!conversation) {
        conversation = new Conversation({
          participants: [senderId, recipientId],
          msgIds: [msgId],
          lastMsgId: msgId,
        });
        await conversation.save();
      } else {
        // await Conversation.updateOne(
        //   {
        //     _id: ObjectId(conversation._id),
        //   },
        //   {
        //     $push: {
        //       msgIds: msgId,
        //     },
        //     $set: {
        //       lastMsgId: msgId,
        //     },
        //   }
        // );
      }
      if (message?.files?.length) {
        const urls = [];
        for (let fileInfo of message.files) {
          const { file, name, contentType } = fileInfo;
          const fileUrl = await uploadFile({ file: file });
          // const newFile = new File({
          //   name: name,
          //   url: fileUrl,
          //   contentType: contentType,
          // });
          // const saveFile = await newFile.save();
          // urls.push(saveFile._id);
        }
      }
      // const newMessage = new Message({
      //   _id: msgId,
      //   conversationId: conversation._id,
      //   sender: senderId,
      //   ...message,
      // });
      // await newMessage.save();
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
      });
      cb({ status: "success", data: msgs });
    } catch (error) {
      console.error("getConversations: ", error);
    }
  }
}
