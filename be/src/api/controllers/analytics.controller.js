import { ObjectId } from "../../util/index.js";
import AnalyticsModel from "../models/analytics.model.js";

export const createEvent = async (req, res) => {
  try {
    const {
      userId,
      event,
      payload,
      deviceInfo,
      browserInfo,
      localeInfo,
      webInfo,
    } = req.body;
    const newEvent = new AnalyticsModel({
      event: event,
      userId: ObjectId(userId),
      payload: payload,
      deviceInfo: deviceInfo,
      browserInfo: browserInfo,
      localeInfo: localeInfo,
      webInfo: webInfo,
    });
    await newEvent.save();
    res.status(200).json("OK");
  } catch (err) {
    console.log("createEvent: ", err);
  }
};

export const getEvents = async (req, res) => {
  try {
    const { userId, agg } = req.body;
  } catch (err) {
    console.log("getEvents: ", err);
  }
};
