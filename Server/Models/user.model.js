import { DataTypes } from "sequelize";
import sequelize from "../dbconnection.js";
import bcrypt from 'bcrypt';

const User = sequelize.define('User',{
    user_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    role:{
        type:DataTypes.STRING(50),
        defaultValue:'simple_user',
        allowNull:false,
        validate:{
            isIn:[['simple_user','admin']]
        }
    },
    is_verified:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false
    },
    verification_token:{
        type:DataTypes.STRING,
        allowNull:true
    }
},{
    timestamps:true,
    tableName:"users",
    schema:"hotel_booking",
    createdAt:"created_at",
    updatedAt:"updated_at",
    hooks:{
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
            user.verification_token = crypto.randomUUID();
        },
        beforeUpdate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
})

export {User};