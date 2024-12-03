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
    meals_price:{
      type:DataTypes.INTEGER,
      allowNull:false,
      defaultValue:200,
      validate:{
        min:100
      }
    },
    retail_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate:{
        min:0
      }
    },
    selling_price:{
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        min:0,
      }
    },
    no_of_rooms: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
      allowNull: false,
      validate: {
        min: 0,
        max: 5,
      },
    },
    image_link:{
      type:DataTypes.STRING,
      allowNull:false
    }
  },
  {
    timestamps: true,
    tableName: "rooms",
    schema: "hotel_booking",
    createdAt:"created_at",
    updatedAt:"updated_at",
    hooks: {
      beforeValidate: (room) => {
        if (room.no_of_rooms < 0 || room.no_of_rooms > 5) {
          throw new Error("no_of_rooms must be between 0 and 5");
        }
        if(room.meals_price<100){
          throw new Error("Meals price must be atleast ₹100");
        }
        if(room.retail_price<0){
          throw new Error("Retail price must be greater than ₹0");
        }
        if(room.selling_price>room.retail_price){
          throw new Error("Selling price must be less than retail price");
        }
      },
    },
  }
);
