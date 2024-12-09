import express from "express";
import cors from "cors";
import { userRouter } from "./Routes/user.route.js";
import { roomRouter } from "./Routes/room.route.js";
import { bookingRouter } from "./Routes/booking.route.js";
// import path from 'path';
// import { fileURLToPath } from 'url';
// const __filename =fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/public",express.static(path.join(__dirname,"public")))

app.use("/api/users", userRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/booking", bookingRouter);
// app.get("/uploads", (req,res)=>{
//     const filePath= path.join(__dirname,"uploads","room.jpg");
//     res.sendFile(filePath,(err)=>{
//         console.log(err);
//     })
// })

export default app;
