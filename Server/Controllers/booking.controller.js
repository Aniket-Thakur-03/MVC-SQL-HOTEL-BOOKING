import sequelize from "../dbconnection.js";
import { Booking } from "../Models/bookings.model.js";
import { Location } from "../Models/location.model.js";
import { Room } from "../Models/room.model.js";
import { User } from "../Models/user.model.js";
import {
  sendBookingCancellationEmail,
  sendBookingCreationEmail,
} from "../utils/email.js";

export const createBooking = async (req, res) => {
  const { bookingData } = req.body;
  const { user_id } = req.user;
  if (!bookingData) {
    return res.status(400).json({ message: "No data provided for booking" });
  }
  if (bookingData.user_id !== user_id) {
    return res.status(400).json({ message: "User id not same" });
  }
  const transaction = await sequelize.transaction();
  try {
    const checkRoomAvailability = await Room.findOne({
      where: { room_id: bookingData.room_id },
      transaction: transaction,
    });
    if (!checkRoomAvailability) {
      return res.status(400).json({ message: "Room does not exist" });
    }
    if (checkRoomAvailability.no_of_rooms === 0) {
      return res.status(409).json({ message: "Room not Available" });
    }
    if (checkRoomAvailability.max_adults < bookingData.no_of_adults) {
      return res.status(400).json({
        message: `This room can have max ${checkRoomAvailability.max_adults} Adults`,
      });
    }
    if (
      checkRoomAvailability.max_persons <
      bookingData.no_of_adults + bookingData.no_of_kids
    ) {
      return res.status(400).json({
        message: `Total People can't be more than ${checkRoomAvailability.max_persons}`,
      });
    }
    const newBooking = await Booking.create(
      {
        user_id: bookingData.user_id,
        room_id: bookingData.room_id,
        payment_due: bookingData.payment_due,
        booking_status: bookingData.booking_status,
        payment_status: bookingData.payment_status,
        checked_status: bookingData.checked_status,
        room_price: bookingData.room_price,
        meal_chosen: bookingData.meal_chosen,
        meal_price: bookingData.meal_price,
        guest_name: bookingData.guest_name,
        guest_email: bookingData.guest_email,
        guest_phone_no: bookingData.guest_phone_no,
        check_in_date: bookingData.check_in_date,
        check_out_date: bookingData.check_out_date,
        no_of_adults: bookingData.no_of_adults,
        no_of_kids: bookingData.no_of_kids,
        guest_aadhar_card: bookingData.guest_aadhar_card,
        address: bookingData.address,
        special_requests: bookingData.special_requests,
        country_id: Number(bookingData.country),
        state_id: Number(bookingData.state),
        city_id: Number(bookingData.city),
        no_of_days: Number(bookingData.no_of_days),
        breakfast: bookingData.breakfast,
        lunch: bookingData.lunch,
        dinner: bookingData.dinner,
        meal_type: bookingData.meal_type,
        location_id: bookingData.location_id,
      },
      { transaction: transaction }
    );
    await Room.update(
      { no_of_rooms: checkRoomAvailability.no_of_rooms - 1 },
      { where: { room_id: bookingData.room_id }, transaction: transaction }
    );
    await transaction.commit();
    await sendBookingCreationEmail(
      newBooking.guest_email,
      newBooking.booking_id
    );

    return res.status(200).json({ message: "Booking created successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getBookingDetailsUserId = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "No UserId provided" });
  }
  try {
    const checkUser = await User.findOne({ where: { user_id: req.params.id } });
    if (!checkUser) {
      return res.status(400).json({ message: "User doesn't exist" });
    }
    const bookings = await Booking.findAll({
      where: { user_id: req.params.id },
      order: [["created_at", "DESC"]],
    });
    if (bookings.length === 0) {
      return res.status(200).json({ message: "No Booking Done" });
    }
    const obj = await Promise.all(
      bookings.map(async (booking) => {
        const location = await Location.findByPk(Number(booking.location_id));
        const locationAssigned = `${location.location_name} -${location.city}`;
        return {
          booking_id: booking.booking_id,
          guest_name: booking.guest_name,
          booking_status: booking.booking_status,
          payment_status: booking.payment_status,
          check_in_date: booking.check_in_date,
          check_out_date: booking.check_out_date,
          room_price: booking.room_price,
          meal_price: booking.meal_price,
          payment_due: booking.payment_due,
          location: locationAssigned,
          meal_chosen: booking.meal_chosen,
          special_requests: booking.special_requests,
        };
      })
    );
    return res.status(200).json({ bookings: obj });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
export const getAllBookings = async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await Booking.findAll({
      where: { location_id: Number(id) },
      order: [["created_at", "DESC"]],
    });
    return res.status(200).json({ bookings: bookings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getAllBookingsSuper = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      order: [["created_at", "DESC"]],
    });
    return res.status(200).json({ bookings: bookings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getBookingDetailsBookingId = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "No Booking Id provided" });
  }
  try {
    const booking = await Booking.findOne({
      where: { booking_id: req.params.id },
    });
    if (!booking) {
      return res.status(400).json({ message: "Booking does not exist" });
    }
    if (booking.booking_status === "cancelled") {
      return res.status(400).json({ message: "Booking has been cancelled" });
    }
    return res.status(200).json({ booking: booking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getAllBookingsCheckIns = async (req, res) => {
  if (!req.query.date) {
    return res.status(400).json({ message: "No Date provided" });
  }
  const { id } = req.params;
  console.log(id, req.query.date);
  try {
    const bookings = await Booking.findAll({
      where: {
        check_in_date: req.query.date,
        location_id: Number(id),
        booking_status: "pending",
      },
      order: [["created_at", "DESC"]],
    });
    if (bookings.length === 0) {
      return res
        .status(400)
        .json({ message: `No Bookings for ${req.query.date}` });
    }
    return res.status(200).json({ bookings: bookings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
export const getAllBookingsCheckInsSuper = async (req, res) => {
  if (!req.query.date) {
    return res.status(400).json({ message: "No Date provided" });
  }
  try {
    const bookings = await Booking.findAll({
      where: {
        check_in_date: req.query.date,
        booking_status: "pending",
      },
      order: [["created_at", "DESC"]],
    });
    if (bookings.length === 0) {
      return res
        .status(400)
        .json({ message: `No Bookings for ${req.query.date}` });
    }
    return res.status(200).json({ bookings: bookings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getAllBookingsCheckOuts = async (req, res) => {
  if (!req.query.date) {
    return res.status(400).json({ message: "No Date provided" });
  }
  const { id } = req.params;
  try {
    const bookings = await Booking.findAll({
      where: { check_out_date: req.query.date, location_id: Number(id) },
      order: [["created_at", "DESC"]],
    });
    if (bookings.length === 0) {
      return res
        .status(400)
        .json({ message: `No Bookings for ${req.query.date}` });
    }
    return res.status(200).json({ bookings: bookings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
export const getAllBookingsCheckOutsSuper = async (req, res) => {
  if (!req.query.date) {
    return res.status(400).json({ message: "No Date provided" });
  }
  try {
    const bookings = await Booking.findAll({
      where: { check_out_date: req.query.date },
      order: [["created_at", "DESC"]],
    });
    if (bookings.length === 0) {
      return res
        .status(400)
        .json({ message: `No Bookings for ${req.query.date}` });
    }
    return res.status(200).json({ bookings: bookings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  const { amount, price } = req.body;
  if (!req.params.id) {
    return res.status(400).json({ message: "No booking id provided" });
  }
  if (!amount && !price) {
    return res.status(400).json({ message: "Payment Information Incomplete" });
  }
  const transaction = await sequelize.transaction();
  try {
    const booking = await Booking.findOne({
      where: { booking_id: req.params.id },
      transaction: transaction,
    });
    let amount_paid = booking.amount_paid + Number(amount);
    let payment_due = parseInt(price * 1.12) - amount_paid;
    if (payment_due == 0) {
      const [rowsUpdated, updatedRows] = await Booking.update(
        { payment_status: "paid", payment_due: 0, amount_paid: amount_paid },
        {
          where: { booking_id: req.params.id },
          returning: true,
          transaction: transaction,
        }
      );
      return res
        .status(200)
        .json({ message: "Payment Info updated", booking: updatedRows[0] });
    } else if (payment_due > 0) {
      const [rowsUpdated, updatedRows] = await Booking.update(
        {
          payment_status: "partial",
          payment_due: payment_due,
          amount_paid: amount_paid,
        },
        {
          where: { booking_id: req.params.id },
          returning: true,
          transaction: transaction,
        }
      );
      await transaction.commit();
      return res
        .status(200)
        .json({ message: "Payment Info updated", booking: updatedRows[0] });
    } else if (payment_due < 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "Payment amount incorrect" });
    }
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
export const updateConfirmBookingStatus = async (req, res) => {
  const { booking_status, checked_status } = req.body;
  if (!req.params.id) {
    return res.status(400).json({ message: "No booking id provided" });
  }
  if (!booking_status) {
    return res.status(400).json({ message: "Please provide Booking Status" });
  }
  if (booking_status == "cancelled" || booking_status == "pending") {
    return res.status(400).json({ message: "Booking Status Incorrect" });
  }
  try {
    const [rowsUpdated, updatedRows] = await Booking.update(
      { booking_status: booking_status, checked_status: checked_status },
      { where: { booking_id: req.params.id }, returning: true }
    );
    return res
      .status(200)
      .json({ message: "Booking Status updated", booking: updatedRows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateCancelBookingStatus = async (req, res) => {
  const { booking_status, cancellation_reasons } = req.body;
  if (!req.params.id) {
    return res.status(400).json({ message: "No booking id provided" });
  }
  if (!booking_status) {
    return res.status(400).json({ message: "Please provide Booking Status" });
  }
  if (booking_status === "confirmed" || booking_status === "pending") {
    return res.status(400).json({ message: "Booking Status Incorrect" });
  }
  const transaction = await sequelize.transaction();
  try {
    const [rowsUpdated, updatedRows] = await Booking.update(
      {
        booking_status: booking_status,
        cancellation_reasons: cancellation_reasons,
      },
      {
        where: { booking_id: req.params.id },
        returning: true,
        transaction: transaction,
      }
    );
    if (!updatedRows) {
      await transaction.rollback();
      return res.status(400).json({ message: "Booking does not exist" });
    }
    const room = await Room.findOne({
      where: { room_id: updatedRows[0].room_id },
      attributes: ["no_of_rooms"],
      transaction: transaction,
    });
    await Room.update(
      { no_of_rooms: room.no_of_rooms + 1 },
      { where: { room_id: updatedRows[0].room_id }, transaction: transaction }
    );
    await transaction.commit();
    await sendBookingCancellationEmail(
      updatedRows[0].guest_email,
      updatedRows[0].booking_id,
      updatedRows[0].cancellation_reasons
    );
    return res.status(200).json({ message: "Booking Status updated" });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateCheckedStatus = async (req, res) => {
  const { checked_status } = req.body;
  if (!req.params.id) {
    return res.status(400).json({ message: "No booking id provided" });
  }
  if (!checked_status) {
    return res.status(400).json({ message: "Please provide Checked Status" });
  }
  const transaction = await sequelize.transaction();
  try {
    if (checked_status === "checked_in") {
      await Booking.update(
        { checked_status: checked_status },
        { where: { booking_id: req.params.id }, transaction: transaction }
      );
    } else if (checked_status === "checked_out") {
      const checkpayment = await Booking.findOne({
        where: { booking_id: req.params.id },
        attributes: ["payment_status", "payment_due"],
        transaction: transaction,
      });
      if (checkpayment.payment_status === "unpaid") {
        await transaction.rollback();
        return res.status(400).json({
          message: `Please take ₹${checkpayment.payment_due} rent from guest and update payment status`,
        });
      }
      if (checkpayment.payment_status === "partial") {
        await transaction.rollback();
        return res.status(400).json({
          message: `Please take ${checkpayment.payment_due} rent from guest and update payment status`,
        });
      }

      const [rowsUpdated, updatedRows] = await Booking.update(
        { checked_status: checked_status },
        {
          where: { booking_id: req.params.id, payment_status: "paid" },
          returning: true,
          transaction: transaction,
        }
      );

      const room = await Room.findOne({
        where: { room_id: updatedRows[0].room_id },
        attributes: ["no_of_rooms"],
        transaction: transaction,
      });
      await Room.update(
        { no_of_rooms: room.no_of_rooms + 1 },
        { where: { room_id: updatedRows[0].room_id }, transaction: transaction }
      );
      await transaction.commit();
      return res
        .status(200)
        .json({ message: "Checked Status updated", booking: updatedRows[0] });
    }
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
