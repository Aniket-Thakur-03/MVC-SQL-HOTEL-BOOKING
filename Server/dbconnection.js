import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";
const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  dialect: "postgres",
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

export default sequelize;
