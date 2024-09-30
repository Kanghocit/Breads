import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import { Constants } from "../../../../share/Constants/index.js";
import HTTPStatus from "../../util/httpStatus.js";
import { ObjectId } from "../../util/index.js";
import User from "../models/user.model.js";
import { getUserInfo } from "../services/user.js";
import generateTokenAndSetCookie from "../utils/genarateTokenAndSetCookie.js";
import Collection from "../models/collection.model.js";
import { uploadFile } from "../utils/index.js";
import { crawlUser } from "../crawl.js";

export const getAdminAccount = async (req, res) => {
  try {
    let adminAccount = await User.findOne({
      role: Constants.USER_ROLE.ADMIN,
    });
    if (!adminAccount) {
      const newAdmin = new User({
        email: "admin@gmail.com",
        name: "Admin",
        username: "Admin",
        password: "123456",
        role: Constants.USER_ROLE.ADMIN,
      });
      const result = await newAdmin.save();
      return res.status(HTTPStatus.CREATED).json(result);
    }
    const adminCollection = await Collection.findOne(
      { userId: adminAccount._id },
      { postsId: 1 }
    );
    adminAccount.collection = adminCollection;
    res.status(HTTPStatus.OK).json(adminAccount);
  } catch (err) {
    console.log(err);
    res.status(HTTPStatus.SERVER_ERR).json(err);
  }
};
//sign up
export const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user?._id) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ error: "User already exists!" });
    }

    // const salt = await bcrypt.genSalt(10);
    // const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      username,
      password: password,
    });
    await newUser.save();
    if (newUser) {
      // generateTokenAndSetCookie(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio,
        profilePicture: newUser.profilePicture,
      });
    } else {
      res.status(HTTPStatus.BAD_REQUEST).json({ error: "Invalid user data" });
    }
  } catch (err) {
    res.status(HTTPStatus.SERVER_ERR).json({ error: err.message });
    console.log("Error in Signup User", err.message);
  }
};

//login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    const isPasswordCorrect = true;
    // await bcrypt.compare(
    //   password,
    //   user?.password || ""
    // );

    if (!user || !isPasswordCorrect) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ error: "Invalid username or password" });
    }

    // generateTokenAndSetCookie(user._id, res);

    const result = await getUserInfo(user._id);

    res.status(HTTPStatus.OK).json(result);
  } catch (err) {
    res.status(HTTPStatus.SERVER_ERR).json({ error: err.message });
    console.log("Error in loginUser", err.message);
  }
};

// logout
export const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(HTTPStatus.OK).json({ message: "User log out successfully!" });
  } catch (err) {
    res.status(HTTPStatus.SERVER_ERR).json({ error: err.message });
    console.log("Error in logoutUser", err.message);
  }
};

//follow and unfollow
export const followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (!userToModify || !currentUser) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ error: "User not found" });
    }

    if (id === req.user._id.toString()) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ error: "You can't follow/unfollow yourself" });
    }

    // Ensure `following` is initialized
    // if (!Array.isArray(currentUser.following)) {
    //     currentUser.following = [];
    // }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow user
      await User.findByIdAndUpdate(id, { $pull: { followed: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res
        .status(HTTPStatus.OK)
        .json({ message: "User unfollowed successfully" });
    } else {
      // Follow user
      await User.findByIdAndUpdate(id, { $push: { followed: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      res.status(HTTPStatus.OK).json({ message: "User followed successfully" });
    }
  } catch (err) {
    res.status(HTTPStatus.SERVER_ERR).json({ error: err.message });
    console.log("Error in followUnFollowUser", err.message);
  }
};

// update
export const updateUser = async (req, res) => {
  const { name, bio, links, avatar } = req.body;
  const userId = req.params.id;

  try {
    let user = await User.findById(userId);

    if (!user)
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ error: "User not found" });

    if (req.params.id !== userId.toString())
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ error: "You can't update other user's profile!" });

    // if (password) {
    //   const salt = await bcrypt.genSalt(10);
    //   const hashedPassword = await bcrypt.hash(password, salt);
    //   user.password = hashedPassword;
    // }

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    if (avatar.match(urlRegex)?.length === 0) {
      const avatarUrl = await uploadFile({
        base64: avatar,
      });
      user.avatar = avatarUrl;
    }
    if (links.length) {
      const checkLinks = links.every(
        (link) => link.match(urlRegex)?.length > 0
      );
      console.log("checkLinks: ", checkLinks);
      if (checkLinks) {
        user.links = links;
      }
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;

    user = await user.save();
    const result = JSON.parse(JSON.stringify(user));
    delete result.password;

    res.status(HTTPStatus.OK).json(result);
  } catch (err) {
    res.status(HTTPStatus.SERVER_ERR).json({ error: err.message });
    console.log("Can't updateUser", err.message);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPW, newPW } = req.body;
    const userId = req.params.id;
    if (!userId) {
      return res.status(HTTPStatus.BAD_REQUEST).json("Empty userId");
    }
    if (!currentPW || !newPW) {
      return res.status(HTTPStatus.BAD_REQUEST).json("Empty payload");
    }
    const user = await User.findOne({ _id: ObjectId(userId) });
    if (!user) {
      return res.status(HTTPStatus.BAD_REQUEST).json("User not found");
    }
    if (user.password !== currentPW) {
      return res.status(HTTPStatus.UNAUTHORIZED).json("Wrong password");
    } else if (newPW.length < 6) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json("Password must be at least 6 characters");
    } else if (currentPW === newPW) {
      return res.status(HTTPStatus.BAD_REQUEST).json("Nothing change");
    }
    await User.updateOne(
      { _id: ObjectId(userId) },
      {
        password: newPW,
      }
    );
    return res.status(HTTPStatus.OK).json("Success");
  } catch (err) {
    console.log(err);
    res.status(HTTPStatus.SERVER_ERR).json(err);
  }
};

//get user profile

export const getUserProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    let user = null;
    if (!userId) {
      return res.status(HTTPStatus.NO_CONTENT).json("Empty payload");
    }
    user = await getUserInfo(userId);
    if (!user)
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ error: "User not found!" });
    res.status(HTTPStatus.OK).json(user);
  } catch (err) {
    res.status(HTTPStatus.SERVER_ERR).json({ error: err.message });
    console.log("Can't be get your userProfile!!");
  }
};

export const getUserToFollows = async (req, res) => {
  try {
    const { userId, page, limit } = req.query;
    if (!userId) {
      return res.status(HTTPStatus.UNAUTHORIZED).json("Unauthorize");
    }
    if (!page || !limit) {
      return res.status(HTTPStatus.BAD_REQUEST).json("Need page and limit");
    }
    const userFollowed =
      (await User.findOne({ _id: ObjectId(userId) }))?.followed ?? [];
    const invalidToFollow = [...userFollowed, userId];
    const skip = (page - 1) * limit;
    const data = await User.find(
      {
        _id: { $nin: invalidToFollow },
      },
      {
        _id: 1,
        avatar: 1,
        username: 1,
        name: 1,
      }
    )
      .skip(skip)
      .limit(limit);
    res.status(HTTPStatus.OK).json(data);
  } catch (err) {
    res.status(HTTPStatus.SERVER_ERR).json(err);
  }
};

export const handleCrawlFakeUsers = async (req, res) => {
  try {
    await crawlUser();
    res.status(HTTPStatus.OK).json("Crawl success");
  } catch (err) {
    console.log(err);
    res.status(HTTPStatus.SERVER_ERR).json(err);
  }
};
