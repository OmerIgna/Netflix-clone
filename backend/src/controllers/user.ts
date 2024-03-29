import User from "../models/user/user";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils";
import { Request, Response } from "express";
import { RequestWithUser } from "../types/requests-type";
import { IUser } from "../types/user-type";
import { JwtPayload } from "jsonwebtoken";
import { log } from "console";
import Content from "../models/content/content";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, profilePicture } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const newUser = new User({
    name: name,
    email: email,
    profilePicture: profilePicture,
    password: bcrypt.hashSync(password),
  });

  const user = await newUser.save();

  res.status(201).send({ message: "successfully registered" });
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  const { password, email } = req.body;

  const user = await User.findOne({ email }).populate("likedContents")
  .exec();;

  if (user && bcrypt.compareSync(password, user.password)) {
    const userToSend: IUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      likedContent: user.likedContents,
    };

    res.send({
      user: userToSend,
      token: generateToken(user),
    });
  } else {
    res.status(401).send({ message: "Invalid User/Password" });
  }
};

//@desc get current user
//@route GET /api/users/auth-me
//@access private
export const getUser = async (
  req: RequestWithUser,
  res: Response
): Promise<void> => {
  const token = req.headers.authorization;
  const email = req.user?.email;

  if (!token) {
    res.status(401).send({ message: "Not authorized, no token" });
  }
  const user = await User.findOne({ email }).populate("likedContents").exec();
  if (user) {
    const userToSend: IUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      likedContent: user.likedContents,
    };
    res.status(200).send({ user: userToSend });
  }
};

export const likeContent = async (
  req: RequestWithUser,
  res: Response
): Promise<void> => {
  const { contentId } = req.body;
  const user = req.user;

  const userDB = await User.findById(user?._id)
    .populate("likedContents")
    .exec();

  if (!userDB) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const contentToAdd: any = await Content.findById(contentId);
  if (!contentToAdd) {
    res.status(404).json({ message: "Content not found" });
    return;
  }

  const contentIndex = userDB.likedContents.findIndex(
    (content: any) => String(content._id) === contentId
  );

  if (contentIndex === -1) {
    // If contentId not found, add it to the list
    userDB.likedContents.push(contentToAdd);
  } else {
    // If contentId found, remove it from the list
    userDB.likedContents.splice(contentIndex, 1);
  }

  await userDB.save();

  const userToSend: IUser = {
    _id: userDB._id,
    name: userDB.name,
    email: userDB.email,
    likedContent: userDB.likedContents,
  };

  res.status(200).json({ id: contentId, user: userToSend });
};

export const getUsersLikedContents = async (
  req: RequestWithUser,
  res: Response
): Promise<void> => {
  const user = req.user;

  const userDB = await User.findById(user?._id)
    .populate("likedContents")
    .exec();

  if (!userDB) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.status(200).json(userDB.likedContents);
};
