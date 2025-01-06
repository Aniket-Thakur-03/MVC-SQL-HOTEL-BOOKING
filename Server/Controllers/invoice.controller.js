import puppeteer from "puppeteer";
import fs from "fs";
import { Booking } from "../Models/bookings.model.js";
import { Invoice } from "../Models/invoices.model.js";
import { Location } from "../Models/location.model.js";
import { Room } from "../Models/room.model.js";
import { Roomtype } from "../Models/roomtype.model.js";
import { Country } from "../Models/country.model.js";
import { State } from "../Models/state.model.js";
import { City } from "../Models/city.model.js";
import { InvoiceFormat } from "../utils/invoiceFormat.js";
import sequelize from "../dbconnection.js";

export const InvoiceGenerator = async (booking, username, transaction, res) => {
  const date = new Date();
  const formattedDate = date.toISOString();
  try {
    await Invoice.create(
      {
        booking_id: booking.booking_id,
        location_id: booking.location_id,
        room_id: booking.room_id,
        invoice_date: formattedDate,
        invoice_url: "",
        created_by: username,
      },
      {
        transaction: transaction,
      }
    );
    return;
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const ViewInvoice = async (booking, res, transaction) => {
  try {
    const checkInvoice = await Invoice.findOne({
      where: { booking_id: booking.booking_id },
      transaction: transaction,
    });

    if (!checkInvoice) {
      await transaction.rollback();
      return res.status(400).json({ message: "No Invoice" });
    }
    const query ="SELECT * FROM hotel_booking.invoice_details WHERE invoice_id =:invoice_id";
    const invoice = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { invoice_id: checkInvoice.invoice_id },
      transaction:transaction
    });
    // Generate PDF from HTML content
    let browser;
    try {
      const html = InvoiceFormat(invoice[0]);
      browser = await puppeteer.launch({
        headless: "new", // Use new headless mode
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();
      await page.setContent(html, {
        waitUntil: "networkidle0", // Wait for network to be idle
      });

      // Generate PDF with specific settings
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: "15px",
          bottom: "15px",
          left: "15px",
          right: "15px",
        },
      });

      // Set correct headers
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="INVOICE${checkInvoice.invoice_id}.pdf"`,
        "Content-Length": pdfBuffer.length,
        "Cache-Control": "no-cache",
        "Accept-Ranges": "bytes",
      });
      const filePath = `./invoices/INVOICE${checkInvoice.invoice_id}.pdf`;
      fs.writeFileSync(filePath, pdfBuffer);
      await Invoice.update(
        { invoice_url: filePath },
        {
          where: { invoice_id: checkInvoice.invoice_id },
          transaction: transaction,
        }
      );
      await transaction.commit();

      // Send buffer directly
      return res.end(pdfBuffer);
    } finally {
      if (browser) {
        await browser.close().catch(console.error);
      }
    }
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const showInvoicesAll = async (req, res) => {
  try {
    const { issuper } = req.user;
    const locationId = Number(req.params.id);
    const query = issuper
      ? "SELECT * FROM hotel_booking.invoice_details ORDER BY invoice_date DESC, invoice_id DESC"
      : "SELECT * FROM hotel_booking.invoice_details WHERE location_id = :locationId ORDER BY invoice_date DESC, invoice_id DESC";
    const invoices = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      ...(issuper ? {} : { replacements: { location_id: locationId } }),
    });
    if (invoices.length === 0) {
      return res.status(400).json({ message: "No invoices" });
    }
    return res.status(200).json({ invoices });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};