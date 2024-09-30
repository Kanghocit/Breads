import axios from "axios";
import { randomAvatar } from "./utils/index.js";
import User from "./models/user.model.js";

export const crawlData = async () => {
  try {
    // await crawlPost();
    await crawlUser();
  } catch (err) {
    console.log(err);
  }
};

const crawlPost = async () => {
  try {
    const { data } = await axios.get(
      "https://dummyjson.com/posts?limit=250&select=title,tags"
    );
    const { posts } = data;
  } catch (err) {
    console.log(err);
  }
};

export const crawlUser = async () => {
  try {
    const { data } = await axios.get(
      "https://dummyjson.com/users?limit=100&select=firstName,lastName,email,username,password"
    );
    const { users } = data;
    const usersInfo = [];
    for (let user of users) {
      const userInfo = {
        name: user.firstName + " " + user.lastName,
        username: user.username,
        email: user.email,
        password: user.password,
        avatar: randomAvatar(),
      };
      usersInfo.push(userInfo);
    }
    await User.insertMany(usersInfo, { ordered: false });
    console.log("crawl success");
  } catch (err) {
    console.log(err);
  }
};
