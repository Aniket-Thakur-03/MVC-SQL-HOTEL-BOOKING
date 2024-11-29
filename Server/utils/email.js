import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import nodemailer from "nodemailer";
import {
  sendBookCancelEmailHTMLFormat,
  sendBookCreateHTMLFormat,
  sendVerificationEmailHTMLFormat,
} from "./emailHTMLformat.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "thakur02aniket@gmail.com",
    pass: "wyqqhmgslwfoiwtu",
  },
});

export const sendVerificationEmail = async (userEmail, verification_token) => {
  const subject = "Verify Your Email Address";
  const html = sendVerificationEmailHTMLFormat(verification_token);

  return await sendEmail(userEmail, subject, html);
};

export const sendBookingCreationEmail = async (guest_email, booking_id) => {
  const subject = `Booking Created `;
  const html = sendBookCreateHTMLFormat(booking_id);
  return await sendEmail(guest_email, subject, html);
};

export const sendBookingCancellationEmail = async (
  guest_email,
  booking_id,
  cancellation_reasons
) => {
  const subject = "Booking Cancelled";
  const html = sendBookCancelEmailHTMLFormat(booking_id, cancellation_reasons);
  return await sendEmail(guest_email, subject, html);
};

export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: "thakur02aniket@gmail.com",
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
