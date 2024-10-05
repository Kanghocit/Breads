import axios from "axios";
import { getImgUnsplash, randomAvatar } from "./utils/index.js";
import User from "./models/user.model.js";
import { Constants } from "../../../share/Constants/index.js";
import { gif } from "../../../share/Constants/index.js";
import fs from "fs";
import path from "path";
import { ObjectId } from "../util/index.js";
import SurveyOption from "./models/surveyOption.model.js";
import Post from "./models/post.model.js";

const getListFakeUserId = async () => {
  try {
    let fakeUserIds = await User.find(
      { role: Constants.USER_ROLE.USER },
      { _id: 1 }
    );
    fakeUserIds = fakeUserIds.map(({ _id }) => _id);
    return fakeUserIds;
  } catch (err) {
    console.log("Get fake users id err: ", err);
  }
};

const randomUserId = (fakeUserIds) => {
  const randomUserIndex = Math.floor(Math.random() * fakeUserIds.length);
  const randomUserId = fakeUserIds[randomUserIndex];
  return randomUserId;
};

export const crawlData = async () => {
  try {
    await crawlUser();
    // await crawlPost();
  } catch (err) {
    console.log(err);
  }
};

const createPosts = async (payload) => {
  try {
    const posts = await Post.insertMany(payload, { ordered: false });
    console.log("postCreated: ", posts);
  } catch (err) {
    console.log("Error while creating posts: ", err);
  }
};

const crawlPostsWithGif = async () => {
  try {
    console.log("Start crawling posts with gif");
    const fakeUserIds = await getListFakeUserId();
    //Maximum quantity of fake content: 250
    const numberPost = 100;
    const { data } = await axios.get(
      `https://dummyjson.com/posts?limit=${numberPost}&select=body`
    );
    const postContentFake = data?.posts.map(({ body }) => body);
    const arr = Array.from({ length: numberPost + 1 }, (_, i) => i + 1);
    const postsData = [];
    for (const index of arr) {
      const content = postContentFake[index];
      const gifIndex = Math.floor(Math.random() * gif.length);
      const randomGif = gif[gifIndex];
      const media = [
        {
          url: randomGif,
          type: Constants.MEDIA_TYPE.GIF,
        },
      ];
      const userId = randomUserId(fakeUserIds);
      const post = {
        authorId: userId,
        content: content,
        media: media,
      };
      postsData.push(post);
    }
    return postsData;
  } catch (err) {
    console.log("Crawl post with gif error: ", err);
  }
};

const crawlPostsWithImg = async () => {
  try {
    console.log("Start crawling posts with images");
    const fakeUserIds = await getListFakeUserId();
    const postsData = [];
    const getImgsByTag = async (tag, numberNeed) => {
      try {
        const totalImgs = [];
        const numberQuery = Math.ceil(numberNeed / 10); // Each query gets 10 images
        const arr = Array.from({ length: numberQuery }, (_, i) => i);
        for (const page of arr) {
          const imageUrls = await getImgUnsplash({
            searchValue: tag,
            page: page,
          });
          totalImgs.push(...imageUrls);
        }
        return totalImgs;
      } catch (err) {
        console.log("err: ", err);
        return [];
      }
    };
    const { data } = await axios.get(
      "https://dummyjson.com/posts?limit=250&select=title,tags"
    );
    const { posts } = data;
    const tags = {};
    posts.forEach((post) => {
      const postTag = post.tags;
      postTag.forEach((tag) => {
        if (Object.keys(tags).includes(tag)) {
          tags[tag] += 1;
        } else {
          tags[tag] = 1;
        }
      });
    });
    const keys = Object.keys(tags);
    //Get top tag by counting number valid in post crawled
    const tagsSortByCount = keys
      .map((key) => {
        const item = {};
        item[key] = tags[key];
        return item;
      })
      .sort((a, b) => {
        const valueA = Object.values(a)[0];
        const valueB = Object.values(b)[0];
        return valueB - valueA;
      });
    const postsByTag = {};
    let usedPostIds = [];
    //Classify post by tag
    tagsSortByCount.forEach((tag) => {
      const key = Object.keys(tag)[0];
      const postsContainTag = posts.filter(
        (post) => post.tags.includes(key) && !usedPostIds?.includes(post.id)
      );
      const postIds = postsContainTag.map(({ id }) => id);
      usedPostIds = [...usedPostIds, ...postIds];
      postsByTag[key] = postsContainTag;
    });
    for (const item of tagsSortByCount) {
      const tag = Object.keys(item)[0];
      const posts = postsByTag[tag];
      const totalImgs = await getImgsByTag(tag, posts.length);
      for (const { title } of posts) {
        const numberMedia = Math.floor(Math.random() * 5);
        const urls = totalImgs.splice(0, numberMedia);
        const media = urls.map((url) => {
          return {
            url: url,
            type: Constants.MEDIA_TYPE.IMAGE,
          };
        });
        console.log(media);
        const userId = randomUserId(fakeUserIds);
        const post = {
          content: title,
          media: media,
          authorId: userId,
        };
        postsData.push(post);
      }
    }
    return postsData;
  } catch (err) {
    console.log("Crawl post with img error: ", err);
  }
};

const crawlPostsWithSurvey = async () => {
  try {
    console.log("Start crawling posts with survey");
    const fakeUserIds = await getListFakeUserId();
    let postsData = [];
    const filePath = path.resolve("survey.json");
    let data = fs.readFileSync(filePath, "utf8");
    data = JSON.parse(data);
    for (const { question, A, B, C, D, answer } of data) {
      const listOption = [];
      const numberOption = Math.floor(Math.random() * 3) + 2;
      const charCodeAnswersKey = [65, 66, 67, 68];
      const answers = [A, B, C, D].map((value) => {
        return {
          placeholder: "",
          value: value,
          usersId: [],
        };
      });
      charCodeAnswersKey.forEach((num) => {
        if (String.fromCodePoint(num) === answer) {
          //Add correct value
          listOption.push(answers[num - 65]);
        }
      });

      for (const answer of answers) {
        if (listOption.length === numberOption) {
          break;
        } else {
          if (!listOption.includes(answer)) {
            listOption.push(answer);
          }
        }
      }
      listOption.sort(() => {
        const sortValues = [-1, 0, 1];
        const index = Math.floor(Math.random() * sortValues.length);
        return sortValues[index];
      });
      const userId = randomUserId(fakeUserIds);
      const options = await SurveyOption.insertMany(listOption, {
        ordered: false,
      });
      const optionIds = [];
      options.forEach(({ _id }) => {
        optionIds.push(_id);
      });
      const postData = {
        content: question,
        authorId: userId,
        survey: optionIds,
      };
      postsData.push(postData);
    }
    return postsData;
  } catch (err) {
    console.log("Crawl post with survey error: ", err);
  }
};

export const crawlPosts = async () => {
  try {
    const gifPosts = await crawlPostsWithGif();
    const surveyPosts = await crawlPostsWithSurvey();
    const imgPosts = await crawlPostsWithImg();
    const totalCrawl = [...imgPosts, ...surveyPosts, ...gifPosts];
    await createPosts(totalCrawl);
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
