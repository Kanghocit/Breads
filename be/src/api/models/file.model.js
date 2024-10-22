import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    name: String,
    url: String,
    contentType: String,
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model("File", fileSchema);

export default File;
