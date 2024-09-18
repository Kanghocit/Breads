import axios from "axios";
import { createUser } from "./services/user.js";
import { randomAvatar } from "./utils/index.js";

export const crawlData = async () => {
  try {
    await crawlPost();
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

const crawlUser = async () => {
  try {
    const { data } = await axios.get(
      "https://dummyjson.com/users?limit=200&select=firstName,lastName,email,username,password"
    );
    const { users } = data;
    for (let user of users) {
      const userInfo = {
        name: user.firstName + " " + user.lastName,
        username: user.username,
        email: user.email,
        password: user.password,
        avatar: randomAvatar(),
      };
      await createUser(userInfo);
    }
  } catch (err) {
    console.log(err);
  }
};

crawlUser();
