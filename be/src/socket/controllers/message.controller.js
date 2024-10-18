import { ObjectId, getCollection } from "../../util/index.js";
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
      }
      const newMessage = new Message({
        _id: msgId,
        conversationId: conversation._id,
        sender: senderId,
        text: message,
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

  static async getConversations(req, res) {
    const userId = req.user._id;
    try {
      const conversations = await getCollection(Model.CONVERSATION)
        .findOne({
          participants: ObjectId(userId),
        })
        .populate({
          path: "participants",
          select: "username avatar",
        });

      conversations.forEach((conversation) => {
        conversation.participants = conversation.participants.filter(
          (participant) => participant._id.toString() !== userId.toString()
        );
      });
    } catch (error) {
      console.error("getConversations: ", error);
    }
  }
}
