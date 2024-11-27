import { DataTypes } from "sequelize";
import { sequelize } from "./connection.js";

export const Room = sequelize.define("Room",{
    room_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    room_type:{
        type:DataTypes.STRING,
        allowNull:false
    },
    price:{
        type:DataTypes.FLOAT,
        allowNull:false,
    },
    max_adults:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    max_persons:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    no_of_rooms:{
        type:DataTypes.INTEGER,
        defaultValue:5,
        allowNull:false,
        validate:{
            min:0,
            max:5
        }
    }
},{
    timestamps:false,
    tableName:"rooms",
    schema:"hotel_booking",
    hooks: {
        beforeValidate: (room) => {
          if (room.no_of_rooms < 0 || room.no_of_rooms > 5) {
            throw new Error("no_of_rooms must be between 0 and 5");
          }
        },
      },
})