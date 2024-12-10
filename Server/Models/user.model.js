import { DataTypes } from "sequelize";
import sequelize from "../dbconnection.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { Booking } from "./bookings.model.js";

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    full_name:{
      type:DataTypes.STRING,
      allowNull:true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Email must be of standard format",
        },
      },
    },
    phone_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    otp_phone: {
      type: DataTypes.INTEGER(6),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(50),
      defaultValue: "simple_user",
      allowNull: false,
      validate: {
        isIn: {
          args: [["simple_user", "admin"]],
          msg: "Role must be user or admin",
        },
      },
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verification_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "users",
    schema: "hotel_booking",
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
        user.verification_token = uuidv4();
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
        if(user.changed("phone_no")){
          
        }
      },
    },
  }
);

User.hasMany(Booking,{foreignKey:"user_id"})

export { User };
