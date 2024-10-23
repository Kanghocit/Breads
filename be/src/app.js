import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import connectDB from "./api/db/connectDB.js";
import router from "./api/routers/index.js";
import { uploadFileFromBase64ToDrive } from "./api/utils/driveUpload.js";

// Connect to MongoDB
await connectDB();

const app = express();

app.use(express.json({ limit: "50mb" })); // to prase  Json data in the req.body
app.use(express.urlencoded({ extended: false })); // to prase from data in the req.body
app.use(cookieParser());
app.use(helmet());
const corOption = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(cors(corOption));

app.use("/upload-to-drive", async (req, res) => {
  try {
    const userId = "123";
    const data = await uploadFileFromBase64ToDrive(
      `C:\\Users\\Admin\\Desktop\\IT\\JS\\Breads\\be\\src\\test.docx`,
      userId
    );
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.use("/api", router);

export default app;
