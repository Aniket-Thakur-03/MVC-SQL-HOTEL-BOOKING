import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

import sequelize from "./dbconnection.js";
import app from "./app.js";

await sequelize
  .authenticate()
  .then(() => {
    console.log("DB connected");
    return sequelize.sync({ force: false });
  })
  .then(() => {
    console.log("Database synced");
    app.listen(process.env.PORT, "0.0.0.0", () => {
      console.log(`Server started at port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });
