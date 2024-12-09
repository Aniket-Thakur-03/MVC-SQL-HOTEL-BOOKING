import { DataTypes } from "sequelize";
import sequelize from "../dbconnection.js";

export const Room = sequelize.define(
  "Room",
  {
    room_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    room_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    max_adults: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_persons: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    meals_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 200,
      validate: {
        min: {
          args: [[100]],
          msg: "Meals price must be atleast ₹100",
        },
      },
    },
    retail_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [[0]],
          msg: "Retail price can't be negative",
        },
      },
    },
    selling_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [[0]],
          msg: "Selling price can't be negative",
        },
      },
    },
    no_of_rooms: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
      allowNull: false,
      validate: {
        min: {
          args: [[0]],
          msg: "The number of rooms must not decrease more than 0",
        },
        max: {
          args: [[5]],
          msg: "The number of rooms must not exceed 5.",
        },
      },
    },
    image_link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    big_image_link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state:{
      type:DataTypes.BOOLEAN,
      allowNull:false
    },
    created_by:{
      type:DataTypes.STRING,
      allowNull:false
    },
    updated_by:{
      type:DataTypes.STRING,
      allowNull:false
    }
  },
  {
    timestamps: true,
    tableName: "rooms",
    schema: "hotel_booking",
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
      beforeValidate: (room) => {
        if (room.selling_price > room.retail_price) {
          throw new Error("Selling price must be less than retail price");
        }
      },
    },
  }
);
