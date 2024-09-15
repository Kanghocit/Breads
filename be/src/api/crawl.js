import axios from "axios";
import HTTPStatus from "../util/httpStatus.js";
import { createUser } from "./services/user.js";
import { randomAvatar } from "./utils/index.js";

export const crawlData = async (app) => {
  try {
    await crawlPost(app);
    await crawlUser(app);
  } catch (err) {
    console.log(err);
  }
};

const crawlPost = async (app) => {
  app.use("/crawl-posts-from-dummyjson", async (req, res) => {
    try {
      const { data } = await axios.get(
        "https://dummyjson.com/posts?limit=250&select=title,tags"
      );
      const { posts } = data;
      res.status(HTTPStatus.OK).json(posts);
    } catch (err) {
      console.log(err);
      res.status(HTTPStatus.SERVER_ERR).json(err);
    }
  });
};

const crawlUser = async (app) => {
  app.use("/crawl-users-from-dummyjson", async (req, res) => {
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
      res.status(HTTPStatus.OK).json(users);
    } catch (err) {
      console.log(err);
      res.status(HTTPStatus.SERVER_ERR).json(err);
    }
  });
};
