import axios from "axios";
const serverUrl = "http://localhost:8080";

export const GET = async ({ path }) => {
  try {
    const url = serverUrl + "/" + path;
    const { data } = await axios.get(url);
    return data;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

export const POST = async ({ path, payload }) => {
  try {
    const url = serverUrl + "/" + path;
    const { data } = await axios.post(url, payload);
    return data;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
