import { ObjectId, destructObjectId, getCollection } from "../../util/index.js";
import Model from "../../util/ModelName.js";
import Conversation from "../../api/models/conversation.model.js";
import Message from "../../api/models/message.model.js";

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
        await Conversation.updateOne(
          {
            _id: ObjectId(conversation._id),
          },
          {
            $push: {
              msgIds: msgId,
            },
            $set: {
              lastMsgId: msgId,
            },
          }
        );
      }
      const newMessage = new Message({
        _id: msgId,
        conversationId: conversation._id,
        sender: senderId,
        ...message,
      });
      await newMessage.save();
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
    const { userId } = payload;
    try {
      const conversations = await Conversation.find(
        {
          participants: ObjectId(userId),
        },
        {
          createdAt: 0,
          msgIds: 0,
        }
      )
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
    const { conversationId } = payload;
    try {
      const messages = await Conversation.findOne({
        _id: ObjectId(conversationId),
      }).populate({
        path: "msgIds",
        select: "_id media files sender createdAt",
      });

      // conversations.forEach((conversation) => {
      //   conversation.participants = conversation.participants.filter(
      //     (participant) => participant._id.toString() !== userId.toString()
      //   );
      // });
      cb({ status: "success", message: messages });
    } catch (error) {
      console.error("getConversations: ", error);
    }
  }
}
