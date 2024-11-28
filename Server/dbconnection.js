import { Sequelize } from "sequelize";
const sequelize = new Sequelize({
    host:"localhost",
    dialect:"postgres",
    username:"postgres",
    password:"123456789",
    database:"hotelbooking"
})

export default sequelize;