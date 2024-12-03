import { Router } from "express";
import {
  createBooking,
  getAllBookings,
  getAllBookingsCheckIns,
  getAllBookingsCheckOuts,
  getBookingDetailsBookingId,
  getBookingDetailsUserId,
  updateCancelBookingStatus,
  updateCheckedStatus,
  updateConfirmBookingStatus,
  updatePaymentStatus,
} from "../Controllers/booking.controller.js";
import {adminOnly, authenticateTokenUser } from "../Middleware/tokenverify.js";

const bookingRouter = Router();

bookingRouter.post("/createbooking",authenticateTokenUser, createBooking);
bookingRouter.get("/details/user/:id", authenticateTokenUser,getBookingDetailsUserId);
bookingRouter.get("/details/booking/:id",adminOnly, getBookingDetailsBookingId);
bookingRouter.get("/details/booking/",adminOnly, getAllBookings);
bookingRouter.get("/details/checkins",adminOnly, getAllBookingsCheckIns);
bookingRouter.get("/details/checkouts",adminOnly, getAllBookingsCheckOuts);
bookingRouter.patch("/update/payment/:id",adminOnly, updatePaymentStatus);
bookingRouter.patch("/update/booking/confirm/:id",adminOnly, updateConfirmBookingStatus);
bookingRouter.patch("/update/booking/cancel/:id",authenticateTokenUser, updateCancelBookingStatus);
bookingRouter.patch("/update/checked/:id",adminOnly, updateCheckedStatus);

export {bookingRouter};