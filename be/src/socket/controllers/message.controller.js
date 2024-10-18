import Conversation from "../../api/models/conversation.model.js";
import Message from "../../api/models/message.model.js";
import HTTPStatus from "../../util/httpStatus.js";
import { ObjectId, getCollection } from "../../util/index.js";
import Model from "../../util/ModelName.js";

async function sendMessage(req, res) {
  try {
    const { recipientId, message } = req.body;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });
    const msgId = ObjectId();
    if (!conversation) {
      conversation = new getCollection(Model.NOTIFICATION)({
        participants: [senderId, recipientId],
        msgIds: [msgId],
        lastMsgId: msgId,
      });
      await conversation.save();
    }
    const newMessage = new getCollection(Model.MESSAGE)({
      _id: msgId,
      conversationId: conversation._id,
      sender: senderId,
      text: message,
    });
    newMessage.save();
  } catch (error) {
    console.log("sendMessage: ", error);
  }
}
async function getMessage(req, res) {
  const { otherUserId } = req.params;
  const userId = req.user._id;
  try {
    const conversation = await getCollection(Model.NOTIFICATION).findOne({
      participants: { $all: [userId, otherUserId] },
    });

    if (!conversation) {
      return res
        .status(HTTPStatus.NOT_FOUND)
        .json({ error: "Conversation not found" });
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteMessage(req, res) {
  try {
    const { messageId } = req.params;
    const userId = req.query.userId;

    const mess = await Message.findById(messageId);
    if (!mess) {
      return res.status(HTTPStatus.NOT_FOUND).json({ error: "Post not found" });
    }
    if (mess.sender.toString() !== userId.toString()) {
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({ error: "Unauthorized to delete message" });
    }
    await Message.findByIdAndDelete(messageId);
    res.status(HTTPStatus.OK).json({ message: "Message deleted" });
  } catch (error) {
    res.status(HTTPStatus.SERVER_ERR).json(error);
  }
}

async function getConversations(req, res) {
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
    res.status(HTTPStatus.SERVER_ERR).json({ error: error.message });
  }
}

export { sendMessage, getMessage, getConversations, deleteMessage };
