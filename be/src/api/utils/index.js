import cloudinary from "cloudinary";
import axios from "axios";

export const uploadFile = async ({ base64, style = null }) => {
  try {
    if (!base64) {
      return "";
    }
    const timestamp = Math.round(new Date().getTime() / 1000);
    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME ?? "";
    const api_key = process.env.CLOUDINARY_API_KEY ?? "";
    const api_secret = process.env.CLOUDINARY_API_SECRET ?? "";
    const signature = await cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
      },
      api_secret
    );

    const dataForm = new FormData();
    dataForm.append("file", base64);
    dataForm.append("api_key", api_key);
    dataForm.append("cloud_name", cloud_name);
    dataForm.append("signature", signature);
    dataForm.append("timestamp", timestamp);
    const url = `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`;
    const { data } = await axios.post(url, dataForm);
    if (style) {
      return `https://res.cloudinary.com/${cloud_name}/image/upload/${style}/${data.public_id}.png`;
    }
    return data.url;
  } catch (err) {
    console.error(err);
  }
};
