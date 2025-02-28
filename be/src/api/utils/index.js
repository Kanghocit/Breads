import cloudinary from "cloudinary";
import axios from "axios";

export const uploadFileFromBase64 = async ({ base64, style = null }) => {
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
    console.log("fileUrl: ", data.url);
    return data.url;
  } catch (err) {
    console.error("uploadFileFromBase64: ", err?.message);
  }
};

export const uploadFile = async ({ file }) => {
  try {
    console.log("file: ", file);
    if (!file) {
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
    dataForm.append("file", file);
    dataForm.append("api_key", api_key);
    dataForm.append("cloud_name", cloud_name);
    dataForm.append("signature", signature);
    dataForm.append("timestamp", timestamp);
    const url = `https://api.cloudinary.com/v1_1/${cloud_name}/raw/upload`;
    try {
      const { data } = await axios.post(url, dataForm);
    } catch (err) {
      console.log("cloudinary err: ", err.message);
    }
    console.log("fileUrl: ", data.url);
    return data.url;
  } catch (err) {
    console.error("uploadFileFromBase64: ", err?.message);
  }
};

export const randomAvatar = () => {
  try {
    const randomNum = Math.floor(Math.random() * 70);
    const avatar = `https://i.pravatar.cc/300?img=${randomNum}`;
    return avatar;
  } catch (err) {
    console.log(err);
  }
};

export const getImgUnsplash = async ({ searchValue, page }) => {
  try {
    const ACCESS_KEY = process.env.UNSPLASH_API_KEY || "";
    if (!ACCESS_KEY) {
      return "";
    }
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${searchValue.trim()}&client_id=${ACCESS_KEY}`;
    const { data } = await axios.get(url);
    const results = data.results;
    const imgUrls = results.map(({ urls }) => {
      return urls.regular;
    });
    return imgUrls;
  } catch (err) {
    console.log(err);
  }
};
