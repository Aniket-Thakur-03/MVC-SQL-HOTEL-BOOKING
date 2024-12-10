import { DataTypes } from "sequelize";
import sequelize from "../dbconnection.js";
import { Room } from "./room.model.js";

const Roomtype = sequelize.define("Roomtype", {
    roomtype_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    room_name:{
        type:DataTypes.STRING,
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
},{
    tableName:"roomtypes",
    schema:"hotel_booking",
    timestamps:true,
    createdAt:"created_at",
    updatedAt:"updated_at"
})

Roomtype.belongsTo(Room,{foreignKey:"roomtype_id"})

export {Roomtype}