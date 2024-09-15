import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { crawlData } from "./api/crawl.js";
import connectDB from "./api/db/connectDB.js";
import router from "./api/routers/index.js";

// Connect to MongoDB
connectDB();

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

app.use("/api", router);
crawlData(app);

export default app;
