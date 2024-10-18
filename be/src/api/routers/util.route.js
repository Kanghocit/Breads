import express from "express";
import File from "../models/file.model.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/test-upload-file", upload.single("file"), async (req, res) => {
  try {
    const { originalname, buffer, mimetype } = req.file;

    // Save the file to MongoDB
    const newFile = new File({
      name: originalname,
      data: buffer,
      contentType: mimetype,
    });

    await newFile.save();
    res.status(200).json("OK");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export default router;
