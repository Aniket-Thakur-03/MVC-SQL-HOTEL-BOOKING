import dotenv from 'dotenv';
dotenv.config({
  path:"./.env"
})
import nodemailer from "nodemailer";
import {
  // sendBookingCancellationEmailHTMLFormat,
  // sendBookingCreationEmailHTMLFormat,
  sendVerificationEmailHTMLFormat,
} from "./emailHTMLformat.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GOOGLE_MAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export const sendVerificationEmail = async (userEmail, verification_token) => {
  const subject = "Verify Your Email Address";
  const html = sendVerificationEmailHTMLFormat(verification_token);

  return await sendEmail(userEmail, subject, html);
};

// export const sendBookingCreationEmail = async (guest_email, booking_id) => {
//   const subject = "Booking Created";
//   const html = sendBookingCreationEmailHTMLFormat(booking_id);
//   return await sendEmail(guest_email, subject, html);
// };

// export const sendBookingCancellationEmail = async (guest_email, booking_id) => {
//   const subject = "Booking Cancelled";
//   const html = sendBookingCancellationEmailHTMLFormat(booking_id);
//   return await sendEmail(guest_email, subject, html);
// };

export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.GOOGLE_MAIL,
      to,
      subject,
      html,
    });

    console.log("Email sent: ", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
