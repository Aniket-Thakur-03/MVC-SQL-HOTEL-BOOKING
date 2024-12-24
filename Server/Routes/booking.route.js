import { Router } from "express";
import {
  createBooking,
  getAllBookings,
  getAllBookingsCheckIns,
  getAllBookingsCheckInsSuper,
  getAllBookingsCheckOuts,
  getAllBookingsCheckOutsSuper,
  getAllBookingsSuper,
  getBookingDetailsBookingId,
  getBookingDetailsUserId,
  updateCancelBookingStatus,
  updateCheckedStatus,
  updateConfirmBookingStatus,
  updatePaymentStatus,
} from "../Controllers/booking.controller.js";
import { adminOnly, authenticateTokenUser } from "../Middleware/tokenverify.js";

const bookingRouter = Router();

bookingRouter.post("/createbooking", authenticateTokenUser, createBooking);
bookingRouter.get(
  "/details/user/:id",
  authenticateTokenUser,
  getBookingDetailsUserId
);
bookingRouter.get(
  "/details/booking/:id",
  adminOnly,
  getBookingDetailsBookingId
);
bookingRouter.get("/details/all/booking/:id", adminOnly, getAllBookings);
bookingRouter.get(
  "/details/all/super/admin/booking/:id",
  adminOnly,
  getAllBookingsSuper
);
bookingRouter.get("/details/:id/checkins", adminOnly, getAllBookingsCheckIns);
bookingRouter.get(
  "/details/super/admin/checkins",
  adminOnly,
  getAllBookingsCheckInsSuper
);
bookingRouter.get("/details/:id/checkouts", adminOnly, getAllBookingsCheckOuts);
bookingRouter.get(
  "/details/super/admin/checkouts",
  adminOnly,
  getAllBookingsCheckOutsSuper
);
bookingRouter.patch("/update/payment/:id", adminOnly, updatePaymentStatus);
bookingRouter.patch(
  "/update/booking/confirm/:id",
  adminOnly,
  updateConfirmBookingStatus
);
bookingRouter.patch(
  "/update/booking/cancel/:id",
  authenticateTokenUser,
  updateCancelBookingStatus
);
bookingRouter.patch("/update/checked/:id", adminOnly, updateCheckedStatus);

export { bookingRouter };
