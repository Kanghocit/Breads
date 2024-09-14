import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import HTTPStatus from "../../util/httpStatus.js";
import { ObjectId } from "../../util/index.js";
import User from "../models/user.model.js";
import { getUserInfo } from "../services/user.js";
import generateTokenAndSetCookie from "../utils/genarateTokenAndSetCookie.js";

//sign up
const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user?._id) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ error: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      username,
      password: hashPassword,
    });
    await newUser.save();
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
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
const loginUser = async (req, res) => {
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
const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(HTTPStatus.OK).json({ message: "User log out successfully!" });
  } catch (err) {
    res.status(HTTPStatus.SERVER_ERR).json({ error: err.message });
    console.log("Error in logoutUser", err.message);
  }
};

//follow and unfollow
const followUnFollowUser = async (req, res) => {
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
    // if (!Array.isArray(currentUser.followings)) {
    //     currentUser.followings = [];
    // }

    const isFollowing = currentUser.followings.includes(id);

    if (isFollowing) {
      // Unfollow user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { followings: id } });
      res
        .status(HTTPStatus.OK)
        .json({ message: "User unfollowed successfully" });
    } else {
      // Follow user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { followings: id } });
      res.status(HTTPStatus.OK).json({ message: "User followed successfully" });
    }
  } catch (err) {
    res.status(HTTPStatus.SERVER_ERR).json({ error: err.message });
    console.log("Error in followUnFollowUser", err.message);
  }
};

// update
const updateUser = async (req, res) => {
  const { name, email, username, password, bio } = req.body;
  let { profilePicture } = req.body;
  const userId = req.user._id;

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

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    if (profilePicture) {
      if (user.profilePicture) {
        await cloudinary.uploader.destroy(
          user.profilePicture.split("/").pop().split(".")[0]
        );
      }
      const uploadedRespone = await cloudinary.uploader.upload(profilePicture);
      profilePicture = uploadedRespone.secure_url;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePicture = profilePicture || user.profilePicture;
    user.bio = bio || user.bio;

    user = await user.save();
    user.password = null;

    res.status(HTTPStatus.OK).json(user);
  } catch (err) {
    res.status(HTTPStatus.SERVER_ERR).json({ error: err.message });
    console.log("Can't updateUser", err.message);
  }
};

//get user profile

const getUserProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    let user = null;
    if (!userId) {
      res.status(HTTPStatus.NO_CONTENT).json("Empty payload");
    }
    user = await User.findOne(
      { _id: ObjectId(userId) },
      { password: 0, updatedAt: 0 }
    );
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

export {
  followUnFollowUser,
  getUserProfile,
  loginUser,
  logoutUser,
  signupUser,
  updateUser,
};
