import express from "express";
import cors from "cors";
import { userRouter } from "./Routes/user.route.js";
import { roomRouter } from "./Routes/room.route.js";
import { bookingRouter } from "./Routes/booking.route.js";
import { countryRouter } from "./Routes/country.route.js";
import { stateRouter } from "./Routes/state.route.js";
import { cityRouter } from "./Routes/city.route.js";
import { locationRouter } from "./Routes/location.route.js";
import { featureRouter } from "./Routes/feature.route.js";
import { preferenceRouter } from "./Routes/preference.route.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api/users", userRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/country", countryRouter);
app.use("/api/state", stateRouter);
app.use("/api/city", cityRouter);
app.use("/api/location", locationRouter);
app.use("/api/feature", featureRouter);
app.use("/api/preference", preferenceRouter);

export default app;
