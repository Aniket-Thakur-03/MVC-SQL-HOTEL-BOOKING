import { sequelize } from './connection.js';
import express from 'express';
import { userRouter } from './Routes/user.route.js';
import { roomRouter } from './Routes/room.route.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use("/api/users", userRouter);
app.use("/api/rooms", roomRouter);

app.listen(3000,"0.0.0.0", async()=>{
    console.log("Server Started at 3000");
    try {
        await sequelize.authenticate();
        console.log("DB Connected");
        
    } catch (error) {
        console.error(error);
    }
})