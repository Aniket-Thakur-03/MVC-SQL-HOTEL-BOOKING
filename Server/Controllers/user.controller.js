import dotenv from "dotenv";
dotenv.config();
import { User } from "../Models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/email.js";

export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email is already registered! Please login" });
    }
    const newUser = await User.create({
      username,
      email,
      password,
      role: "simple_user",
    });
    await sendVerificationEmail(newUser.email, newUser.verification_token);
    return res
      .status(201)
      .json({ message: "User created successfully", email: newUser.email });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found! Please create account" });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Incorrect Password" });
    }
    if (!user.is_verified) {
      return res
        .status(400)
        .json({ message: "Please verify your email first!" });
    }
    const token = jwt.sign(
      {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );

    return res.status(200).json({ message: "Login Success", token: token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const verifyUserEmail = async (req, res) => {
  if (!req.query.token) {
    return res.status(400).json({ message: "Token not provided" });
  }
  try {
    const verifiedemail = await User.update(
      { verification_token: null, is_verified: true },
      { where: { verification_token: req.query.token } }
    );
    if (!verifiedemail) {
      return res.status(400).json({ message: "Invalid Token" });
    }
    return res.status(200).json({ message: "verification successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserInfo = async (req, res) => {
  const { user_id } = req.user;
  if (req.params.id !== user_id) {
    return res
      .status(400)
      .json({ message: "access unauthorized, id different" });
  }
  try {
    const { newusername, newpassword } = req.body;
    if (!password) {
      const [rowsUpdated, updatedRows] = await User.update(
        { username: newusername },
        { where: { user_id: user_id }, returning: true }
      );
      if (rowsUpdated === 0)
        return res.status(400).message({ message: "No user updated" });
      const token = jwt.sign({
        user_id: updatedRows[0].user_id,
        username: updatedRows[0].username,
        role: updatedRows[0].role,
        email: updatedRows[0].email,
      });
      return res
        .status(200)
        .json({ message: "User updated successfully", token: token });
    }
    if (!newusername) {
      const [rowsUpdated, updatedRows] = await User.update(
        { password: newpassword },
        { where: { user_id: user_id }, returning: true }
      );
      if (rowsUpdated === 0)
        return res.status(400).message({ message: "No user updated" });
      return res
        .status(200)
        .json({ message: "User updated successfully", user: updatedRows[0] });
    }
    if (newpassword && newusername) {
      const [rowsUpdated, updatedRows] = await User.update(
        { username: newusername, password: newpassword },
        { where: { user_id: user_id }, returning: true }
      );
      if (rowsUpdated === 0)
        return res.status(400).message({ message: "No user updated" });
      const token = jwt.sign({
        user_id: updatedRows[0].user_id,
        username: updatedRows[0].username,
        role: updatedRows[0].role,
        email: updatedRows[0].email,
      });
      return res
        .status(200)
        .json({ message: "User updated successfully", token: token });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const findUser = async (req, res) => {
  const { email } = req.user;
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json({ message: "user does not exist" });
    }
    return res.status(200).json({ user: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
