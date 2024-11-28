import express from 'express';
import cors from 'cors';
import { userRouter } from './Routes/user.route.js';
import { roomRouter } from './Routes/room.route.js';
import { bookingRouter } from './Routes/booking.route.js';
const app=express();

app.use(cors({
    origin:"*",
    methods:['GET','POST','PATCH','DELETE'],
    credentials:true,
    allowedHeaders:['Authorization','Content-Type']
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use("/api/users",userRouter);
app.use("/api/rooms",roomRouter);
app.use("/api/booking",bookingRouter);


export default app;