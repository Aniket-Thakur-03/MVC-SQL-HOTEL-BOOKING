import { DataTypes } from "sequelize";
import sequelize from "../dbconnection.js";
import { Country } from "./country.model.js";
import { City } from "./city.model.js";

export const State = sequelize.define("State",{
    state_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    country_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:"countries",
            key:"country_id"
        }
    },
    state_code:{
        type:DataTypes.STRING(2),
        allowNull:false
    },
    state_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    isActive:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
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
    tableName:"states",
    schema:"hotel_booking",
    timestamps:true,
    createdAt:"created_at",
    updatedAt:"updated_at"
})

State.belongsTo(Country,{foreignKey:"country_id"})
State.hasMany(City,{foreignKey:"state_id", onDelete:"CASCADE"})