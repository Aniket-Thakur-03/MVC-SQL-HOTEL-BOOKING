import { User } from "../user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if(!username || !email || !password){
      return res.status(400).json({message:"please fill all fields"})
    }
    const existingUser = await User.findOne({ where: { email:email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered! Please login" });
    }
    const newUser = await User.create({
      username,
      email,
      password,
      role: "simple_user",
    });
    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password){
      return res.status(400).json({message:"please fill all fields"})
    }
    const user = await User.findOne({ where:{email:email} });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found! Please create account" });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Incorrect Password" });
    }
    if (!user.is_verified) {
      return res.status(400).json({ message: "Please verify your email!" });
    }
    const token = jwt.sign({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role,
    },"an1ketthakur130301",{
      expiresIn:"1h"
    });

    return res.status(200).json({token: token});
  } catch (error) {
    console.error(error);
    return res.status(500).json({message:"Server Error"});
  }
};
