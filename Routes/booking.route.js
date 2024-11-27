import { Router } from "express";
import { createBooking } from "../Controllers/booking.controller.js";

const bookingRouter = Router();

bookingRouter.post("createbooking",createBooking)