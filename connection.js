import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
    host:'localhost',
    dialect:"postgres",
    username:'postgres',
    password:"123456789",
    database:"hotelbooking"
})

sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synced');
  })
  .catch((error) => {
    console.log('Error syncing database:', error);
  });

export { sequelize };