import mongoose from "mongoose";

export const getCollection = (name) => {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("MongoDB: Can not get Collection");
  }

  return db.collection(name);
};

export const ObjectId = (_id = null) => {
  if (!mongoose.isValidObjectId(_id)) {
    return new mongoose.Types.ObjectId();
  }
  return new mongoose.Types.ObjectId(_id);
};

export const destructObjectId = (objectId) => {
  return JSON.parse(JSON.stringify(objectId).replace("new ObjectId", ""));
};
