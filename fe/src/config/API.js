import axios from "axios";
export const serverUrl = "http://localhost:8080";

export const GET = async ({ path, params = null }) => {
  try {
    const url = serverUrl + "/api/" + path;
    let result = null;
    if (params) {
      result = (
        await axios.get(url, {
          params: params,
        })
      )?.data;
    } else {
      result = (await axios.get(url))?.data;
    }
    return result;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

export const POST = async ({ path, payload }) => {
  try {
    const url = serverUrl + "/api/" + path;
    const { data } = await axios.post(url, payload);
    return data;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

export const PUT = async ({ path, payload }) => {
  try {
    const url = serverUrl + "/api/" + path;
    const { data } = await axios.put(url, payload);
    return data;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

export const PATCH = async ({ path, payload }) => {
  try {
    const url = serverUrl + "/api/" + path;
    const { data } = await axios.patch(url, payload);
    return data;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
