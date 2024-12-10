import { DataTypes } from "sequelize";
import sequelize from "../dbconnection.js";
import { State } from "./state.model.js";

export const City = sequelize.define("City",{
    city_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    state_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:"states",
            key:"state_id"
        }
    },
    city_std_code:{
        type:DataTypes.STRING(2),
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
    tableName:"cities",
    schema:"hotel_booking",
    timestamps:true,
    createdAt:"created_at",
    updatedAt:"updated_at"
})

City.belongsTo(State,{foreignKey:'state_id'})