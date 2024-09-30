import axios from "axios";
export const serverUrl = "http://localhost:8080";

export const GET = async ({ path, params = null, showToast = null }) => {
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
    if (showToast && err.response.data) {
      const errorMsg = err.response.data;
      showToast("", errorMsg, "error");
    }
    throw new Error(err);
  }
};

export const POST = async ({ path, payload, params, showToast = null }) => {
  try {
    const url = serverUrl + "/api/" + path;
    const { data } = await axios.post(url, payload, {
      params: params,
    });
    return data;
  } catch (err) {
    if (showToast && err.response.data) {
      const errorMsg = err.response.data;
      showToast("", errorMsg, "error");
    }
    throw new Error(err);
  }
};

export const PUT = async ({ path, payload, showToast = null }) => {
  try {
    const url = serverUrl + "/api/" + path;
    const { data } = await axios.put(url, payload);
    return data;
  } catch (err) {
    if (showToast && err.response.data) {
      const errorMsg = err.response.data;
      showToast("", errorMsg, "error");
    }
    throw new Error(err);
  }
};

export const PATCH = async ({ path, payload, showToast = null }) => {
  try {
    const url = serverUrl + "/api/" + path;
    const { data } = await axios.patch(url, payload);
    return data;
  } catch (err) {
    if (showToast && err.response.data) {
      const errorMsg = err.response.data;
      showToast("", errorMsg, "error");
    }
    throw new Error(err);
  }
};

export const DELETE = async ({ path, params, showToast = null }) => {
  try {
    const url = serverUrl + "/api/" + path;
    const { data } = await axios.delete(url, {
      params: params,
    });
    return data;
  } catch (err) {
    if (showToast && err.response.data) {
      const errorMsg = err.response.data;
      showToast("", errorMsg, "error");
    }
    throw new Error(err);
  }
};
