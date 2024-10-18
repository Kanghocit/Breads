import Conversation from "../../api/models/conversation.model.js";
import Message from "../../api/models/message.model.js";
import HTTPStatus from "../../util/httpStatus.js";

export default class MessageController {
   static async sendMessage(req, res) {
    try {
      const { recipientId, message } = req.body;
      const senderId = req.user._id;
  
      if (!recipientId || !message) {
        return res.status(HTTPStatus.BAD_REQUEST).json({ error: "Recipient and message are required" });
      }
  
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, recipientId] },
      });
      if (!conversation) {
        conversation = new Conversation({
          participants: [senderId, recipientId],
          lastMessage: {
            text: message,
            sender: senderId,
          },
        });
        await conversation.save();
      }
      
      const newMessage = new Message({
        conversationId: conversation._id,
        sender: senderId,
        text: message,
      });
      
      await Promise.all([
        newMessage.save(),
        conversation.updateOne({
          lastMessage: {
            text: message,
            sender: senderId,
          },
        }),
      ]);
  
      res.status(HTTPStatus.CREATED).json(newMessage);
    } catch (error) {
      console.error(error);
      res.status(HTTPStatus.SERVER_ERR).json({ error: error.message });
    }
  }
  
  static async getMessage(req, res) {
    const { otherUserId } = req.params;
    const userId = req.user._id;
  
    try {
      const conversation = await Conversation.findOne({
        participants: { $all: [userId, otherUserId] },
      });
  
      if (!conversation) {
        return res.status(HTTPStatus.NOT_FOUND).json({ error: "Conversation not found" });
      }
  
      const messages = await Message.find({
        conversationId: conversation._id,
      }).sort({ createdAt: 1 }).lean();
  
      if (messages.length === 0) {
        return res.status(HTTPStatus.NO_CONTENT).send();
      }
  
      res.status(HTTPStatus.OK).json(messages);
    } catch (error) {
      console.error(error);
      res.status(HTTPStatus.SERVER_ERR).json({ error: error.message });
    }
  }
  
  static async deleteMessage(req, res) {
    try {
      const { messageId } = req.params;
      const userId = req.user._id;
  
      const mess = await Message.findById(messageId);
      if (!mess) {
        return res.status(HTTPStatus.NOT_FOUND).json({ error: "Message not found" });
      }
      if (mess.sender.toString() !== userId.toString()) {
        return res.status(HTTPStatus.UNAUTHORIZED).json({ error: "Unauthorized to delete message" });
      }
      
      await Message.findByIdAndDelete(messageId);
      res.status(HTTPStatus.OK).json({ message: "Message deleted" });
      
    } catch (error) {
      console.error(error);
      res.status(HTTPStatus.SERVER_ERR).json({ error: error.message });
    }
  }
  
  static async getConversations(req, res) {
    const userId = req.user._id;
    try {
      const conversations = await Conversation.find({
        participants: userId,
      }).populate({
        path: "participants",
        select: "username profilePicture",
      });
  
      conversations.forEach((conversation) => {
        conversation.participants = conversation.participants.filter(
          (participant) => participant._id.toString() !== userId.toString()
        );
      });
  
      res.status(HTTPStatus.OK).json(conversations);
    } catch (error) {
      console.error(error);
      res.status(HTTPStatus.SERVER_ERR).json({ error: error.message });
    }
  }
}


