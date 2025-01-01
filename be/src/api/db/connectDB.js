import mongoose from "mongoose";
import cron from "node-cron";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connect success");
  } catch (error) {
    console.log("Connect failed");
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const createDailyCollection = async () => {
  try {
    const analyticsDB = mongoose.createConnection(process.env.ANALYTICS_DB_URI);
    const now = new Date();
    const dateString = now.toLocaleDateString("en-GB");
    const collectionName = dateString.replace(/\//g, "-");
    const collection = await analyticsDB.createCollection(collectionName);
    console.log(`Collection created: ${collection.collectionName}`);
  } catch (err) {
    if (err.codeName === "NamespaceExists") {
      console.log("Collection already exists for today.");
    } else {
      console.error("Error creating collection:", err);
    }
  }
};

// Schedule the task to run at midnight every day
cron.schedule("0 0 * * *", () => {
  console.log("Running daily task to create collection...");
  createDailyCollection();
});

export default connectDB;
