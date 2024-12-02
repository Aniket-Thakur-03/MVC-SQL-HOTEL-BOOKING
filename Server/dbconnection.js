import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";
const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  dialect: "postgres",
  username: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

export default sequelize;
