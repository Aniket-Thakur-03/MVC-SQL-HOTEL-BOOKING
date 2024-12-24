import dotenv from "dotenv";
dotenv.config();
import { User } from "../Models/user.model.js";
import { Useradmin } from "../Models/useradmin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendResetEmail, sendVerificationEmail } from "../utils/email.js";
import sequelize from "../dbconnection.js";
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
  const transaction = await sequelize.transaction();
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email: email },
      transaction: transaction,
    });
    if (!user) {
      throw new Error("User not found! Please create account");
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new Error("Incorrect Password");
    }
    if (!user.is_verified) {
      throw new Error("Please verify your email first!");
    }

    const checkAdmin = await Useradmin.findOne({
      where: { user_id: user.user_id },
      transaction: transaction,
    });
    if (!checkAdmin) {
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
      await transaction.commit();
      return res.status(200).json({ message: "Login Success", token: token });
    } else if (checkAdmin && checkAdmin.isActive) {
      const token = jwt.sign(
        {
          user_id: checkAdmin.user_id,
          admin_id: checkAdmin.admin_id,
          username: checkAdmin.admin_username,
          email: checkAdmin.email,
          role: user.role,
          issuper: checkAdmin.issuper,
          location_id: checkAdmin.location_id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
      );
      await transaction.commit();
      return res.status(200).json({ message: "Login Success", token: token });
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    await transaction.rollback();
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
  if (Number(req.params.id) !== user_id) {
    return res
      .status(400)
      .json({ message: "access unauthorized, id different" });
  }
  const transaction = await sequelize.transaction();
  const { fullName, phoneNo, newusername, newpassword } = req.body;
  try {
    const user = await User.findByPk(user_id, { transaction: transaction });
    if (!user) {
      throw new Error("User not found");
    }

    if (newusername) user.username = newusername;
    if (newpassword) user.password = newpassword;
    if (fullName) user.full_name = fullName;
    if (phoneNo) user.phone_no = phoneNo;
    await user.save({ transaction: transaction });
    const checkAdmin = await Useradmin.findOne({
      where: { user_id: user.user_id },
      transaction: transaction,
    });
    if (!checkAdmin) {
      const token = jwt.sign(
        {
          user_id: user_id,
          username: newusername || user.username,
          email: user.email,
          role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
      );
      await transaction.commit();
      return res
        .status(200)
        .json({ message: "User updated successfully", token: token });
    } else {
      const admin = await Useradmin.findByPk(checkAdmin.admin_id, {
        transaction: transaction,
      });
      if (newusername) admin.admin_username = newusername;
      if (newpassword) admin.password = user.password;
      if (fullName) admin.full_name = fullName;
      if (phoneNo) admin.phone_no = phoneNo;
      await admin.save();
      const token = jwt.sign(
        {
          user_id: user_id,
          admin_id: admin.admin_id,
          username: newusername || user.username,
          email: user.email,
          role: user.role,
          issuper: admin.issuper,
          location_id: admin.location_id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
      );
      await transaction.commit();
      return res.status(200).json({ message: "User Updated", token: token });
    }
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res
      .status(500)
      .json({ message: `Something went wrong, ${error.message}` });
  }
};

export const verifyPassword = async (req, res) => {
  const { user_id } = req.user;
  const { password } = req.body;
  try {
    const checkUser = await User.findOne({ where: { user_id: user_id } });
    if (!checkUser) {
      return res.status(400).json({ message: "User doesn't exist" });
    }
    const passCheck = await bcrypt.compare(password, checkUser.password);
    if (passCheck) {
      return res.status(200).json({ message: "User password verified" });
    } else return res.status(400).json({ message: "Password Incorrect" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const sendforgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User doesn't exist, Please sign up" });
    }
    console.log(user.user_id, user.email);
    const token = jwt.sign(
      {
        id: user.user_id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
    await sendResetEmail(email, token);
    return res
      .status(200)
      .json({ message: "Reset Email password sent, check your inbox" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const resetPasswordToken = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const decoded = jwt.verify(id, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded);
    const user = await User.findByPk(decoded.id);
    console.log(user);
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }
    await user.save();
    console.log("verified");
    return res.status(200).json({ message: "Token verified", id: decoded.id });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: `Invalid or Expired Token` });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password, id } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }
    user.password = password;
    await user.save();
    return res.status(200).json({ message: "Password Reset Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

export const sendInfo = async (req, res) => {
  const { user_id } = req.user;
  try {
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(400).json({ message: "No user exists" });
    }
    return res.status(200).json({ user: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const createAdmin = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { adminusername, fullname, email, password, phoneno } = req.body;
    const { username } = req.user;
    const newUser = await User.create(
      {
        username: adminusername,
        full_name: fullname,
        email: email,
        password: password,
        phone_no: phoneno,
        role: "admin",
        is_verified: true,
        verification_token: null,
      },
      { transaction: transaction }
    );

    await Useradmin.create(
      {
        user_id: newUser.user_id,
        full_name: fullname,
        email: email,
        admin_username: adminusername,
        phoneno: phoneno,
        password: newUser.password,
        created_by: username,
        updated_by: username,
      },
      { transaction: transaction }
    );
    await transaction.commit();
    return res.status(200).json({ message: "Admin Created Successfully" });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ message: error.message });
  }
};

export const showAdmins = async (req, res) => {
  try {
    const allAdmins = await Useradmin.findAll();
    if (allAdmins.length === 0) {
      return res.status(400).json({ message: "No Admins Exist" });
    }
    const filteredAdmins = allAdmins.filter(
      (admin) => !admin.dataValues.issuper
    );
    return res.status(200).json({ admins: filteredAdmins });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const checkLocation = async (req, res) => {
  try {
    const { location_id, admin_id } = req.body;
    const passCheck = await Useradmin.findByPk(Number(admin_id));
    if (!passCheck) {
      return res.status(400).json({ message: "No user exists" });
    }
    if (!passCheck.location_id) {
      return res.status(400).json({
        message: "No location assigned, please assign location first",
      });
    }
    if (passCheck.location_id !== Number(location_id)) {
      return res.status(400).json({ message: "Location not same" });
    }
    return res
      .status(200)
      .json({ message: "Admin is assigned to this location" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
