import { Booking } from "../Models/bookings.model.js";
import { Room } from "../Models/room.model.js";
import { User } from "../Models/user.model.js";

export const createBooking = async (req, res) => {
  const { bookingData } = req.body;
  if (!bookingData) {
    return res.status(400).json({ message: "No data provided for booking" });
  }
  try {
    const checkRoomAvailability = await Room.findOne({
      where: { room_id: bookingData.room_id },
    });
    if (!checkRoomAvailability) {
      return res.status(400).json({ message: "Room does not exist" });
    }
    if (checkRoomAvailability.no_of_rooms === 0) {
      return res.status(409).json({ message: "Room not Available" });
    }
    if (checkRoomAvailability.max_adults < bookingData.no_of_adults) {
      return res
        .status(400)
        .json({
          message: `This room can have max ${checkRoomAvailability.max_adults} Adults`,
        });
    }
    if (
      checkRoomAvailability.max_persons <
      bookingData.no_of_adults + bookingData.no_of_kids
    ) {
      return res
        .status(400)
        .json({
          message: `Total People can't be more than ${checkRoomAvailability.max_persons}`,
        });
    }
    await Booking.create({
      user_id: bookingData.user_id,
      room_id: bookingData.room_id,
      payment_due: bookingData.payment_due,
      booking_status: bookingData.booking_status,
      payment_status: bookingData.payment_status,
      checked_status: bookingData.checked_status,
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
    });
    await Room.update(
      { no_of_rooms: checkRoomAvailability.no_of_rooms - 1 },
      { where: { room_id: bookingData.room_id } }
    );

    return res.status(201).json({ message: "Booking created successfully" });
  } catch (error) {
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
      where: { user_id: req.params.id },include:[
        {
          model:Room,
          attributes:['room_type', 'price']
        }
      ]
    });
    if (bookings.length === 0) {
      return res.status(200).json({ message: "No Booking Done" });
    }
    return res
      .status(200)
      .json({ bookings: bookings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
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
  try {
    const bookings = await Booking.findAll({
      where: { check_in_date: req.query.date },
    });
    if (bookings.length === 0) {
      return res
        .status(200)
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
  try {
    const bookings = await Booking.findAll({
      where: { check_out_date: req.query.date },
    });
    if (bookings.length === 0) {
      return res
        .status(200)
        .json({ message: `No Bookings for ${req.query.date}` });
    }
    return res.status(200).json({ bookings: bookings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  const { payment_due, payment_status } = req.body;
  if (!req.params.id) {
    return res.status(400).json({ message: "No booking id provided" });
  }
  if (!payment_due && !payment_status) {
    return res.status(400).json({ message: "Payment Information Incomplete" });
  }
  try {
    await Booking.update(
      { payment_due: payment_due, payment_status: payment_status },
      { where: { booking_id: req.params.id } }
    );
    return res.status(200).json({message:"Payment Info updated"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({message:error.message});
  }
};
export const updateConfirmBookingStatus = async (req, res) => {
  const { booking_status } = req.body;
  if (!req.params.id) {
    return res.status(400).json({ message: "No booking id provided" });
  }
  if (!booking_status) {
    return res.status(400).json({ message: "Please provide Booking Status" });
  }
  if (booking_status!=='cancelled' || booking_status !=='pending') {
    return res.status(400).json({ message: "Booking Status Incorrect" });
  }
  try {
    await Booking.update(
      { booking_status:booking_status },
      { where: { booking_id: req.params.id } }
    );
    return res.status(200).json({message:"Booking Status updated"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({message:error.message});
  }
};

export const updateCancelBookingStatus = async (req,res) => {
    const {booking_status} = req.body;
    if (!req.params.id) {
        return res.status(400).json({ message: "No booking id provided" });
    }
    if (!booking_status) {
        return res.status(400).json({ message: "Please provide Booking Status" });
    }
    if (booking_status ==='confirmed' || booking_status !=='pending') {
        return res.status(400).json({ message: "Booking Status Incorrect" });
    }
    try {
        const cancelBooking= await Booking.update(
          { booking_status:booking_status },
          { where: { booking_id: req.params.id } }
        );
        if(!cancelBooking){
            return res.status(400).json({message:"Booking does not exist"});
        }
        const no_of_rooms = await Room.findOne({where:{room_id:cancelBooking.room_id},attributes:['no_of_rooms']});
        await Room.update({no_of_rooms:no_of_rooms+1},{where:{room_id:cancelBooking.room_id}});
        return res.status(200).json({message:"Booking Status updated"});
      } catch (error) {
        console.error(error);
        return res.status(500).json({message:error.message});
      }
}

export const updateCheckedStatus = async (req, res) => {
    const { checked_status } = req.body;
    if (!req.params.id) {
      return res.status(400).json({ message: "No booking id provided" });
    }
    if (!checked_status) {
      return res.status(400).json({ message: "Please provide Checked Status" });
    }
    try {
        if(checked_status === 'checked_in'){
            await Booking.update(
                { checked_status:checked_status },
                { where: { booking_id: req.params.id } }
              );
        }
        else if(checked_status === 'checked_out'){
            const checkpayment = await Booking.findOne({where:{booking_id:req.params.id}, attributes:['payment_status','payment_due']});
            if(checkpayment.payment_status === 'unpaid'){
                return res.status(400).json({message:`Please take ₹${checkpayment.payment_due} rent from guest and update payment status`});
            }
            if(checkpayment.payment_status === 'partial'){
                return res.status(400).json({message:`Please take ${checkpayment.payment_due} rent from guest and update payment status`});
            }

            await Booking.update(
                { checked_status:checked_status },
                { where: { booking_id: req.params.id,payment_status:"paid" } }
              );
        }
      
      return res.status(200).json({message:"Checked Status updated"});
    } catch (error) {
      console.error(error);
      return res.status(500).json({message:error.message});
    }
  };