import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomAlert from "./Notification/CustomAlert";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { InvoiceFormat } from "../Format/InvoiceFormat";
import ExcelSVG from "../assets/xls-svgrepo-com.svg";
import PDFSVG from "../assets/pdf-svgrepo-com.svg";
export const ViewInvoices = () => {
  const token = localStorage.getItem("token");
  const locationId = jwtDecode(token).location_id;
  const issuper = jwtDecode(token).issuper;
  const adminId = jwtDecode(token).admin_id;
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const [filters, setFilters] = useState({
    bookingId: "",
    invoiceId: "",
    roomName: "",
    locationId: "",
  });

  const triggerAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    console.log(`${name}: ${value}`);
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const filtered = invoices.filter((invoice) => {
      const matchBookingId = invoice.booking_id
        ?.toString()
        .toLowerCase()
        .includes(filters.bookingId.toLowerCase());
      const matchInvoiceId = invoice.invoice_id
        ?.toString()
        .toLowerCase()
        .includes(filters.invoiceId.toLowerCase());
      const matchRoomName = invoice.room_name
        ?.toLowerCase()
        .includes(filters.roomName.toLowerCase());
      const matchLocationId =
        !filters.locationId ||
        invoice.location_id === parseInt(filters.locationId);

      return (
        matchBookingId && matchInvoiceId && matchRoomName && matchLocationId
      );
    });

    setFilteredInvoices(filtered);
  }, [filters, invoices]);

  async function fetchInvoices() {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/invoices/get/all/${locationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setInvoices(response.data.invoices);
        setFilteredInvoices(response.data.invoices);
      } else {
        setInvoices([]);
        setFilteredInvoices([]);
      }
    } catch (error) {
      console.log(error);
      setInvoices([]);
      setFilteredInvoices([]);
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
    }
  }

  async function fetchLocations() {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/location/get/admin/location",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setLocations(response.data.locations);
      }
    } catch (error) {
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInvoices();
    if (issuper) {
      fetchLocations();
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "http://localhost:8000/api/preference/search/feature/access/v1/admin",
          {
            feature_id: 14,
            admin_id: adminId,
            location_id: locationId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          return;
        }
      } catch (error) {
        navigate("/unauthorized", { replace: true });
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  function handleSingleExcel(invoice) {
    try {
      const services = invoice.selected_services.length> 0 ? `${invoice.selected_services.map((item)=>{
        return `${item.service_name}(${item.quantity}),`
      })}`:null
      // Create a single-row array with the invoice data
      const formattedData = [{
        "Invoice ID": invoice.invoice_id,
        "Location":`${invoice.location_name}-${invoice.location_city}-${invoice.location_pincode}`,
        "Guest Name": invoice.guest_name,
        "Check-In Date": invoice.check_in_date,
        "Check-Out Date": invoice.check_out_date,
        "Room Name": invoice.room_name,
        "Room Price": invoice.room_price,
        "Meals": `${
          invoice.meal_chosen
            ? `${invoice.breakfast ? "Breakfast" : ""} ${
                invoice.lunch ? "Lunch" : ""
              } ${invoice.dinner ? "Dinner" : ""}`.trim()
            : "None"
        }`,
        "Meal Price": invoice.meal_price || 0,
        "Services Price": invoice.services_price || 0,
        "Services":services, 
        "Total Amount": invoice.amount_paid,
      }];

      // Create worksheet from the array of data
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Invoice");

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // Create Blob and save file
      const blob = new Blob([excelBuffer], { 
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
      });
      saveAs(blob, `invoice_${invoice.invoice_id}.xlsx`);
    } catch (error) {
      console.error("Excel export error:", error);
      triggerAlert("Failed to generate Excel file", "error");
    }
  }
  async function handleSinglePDF(invoice) {
    try {
      // Create temporary container
      const invoiceHTML = InvoiceFormat(invoice);
      const invoiceContainer = document.createElement("div");
      invoiceContainer.style.position = "absolute";
      invoiceContainer.style.left = "-9999px";
      invoiceContainer.style.top = "0";
      invoiceContainer.innerHTML = invoiceHTML;
      document.body.appendChild(invoiceContainer);

      // Wait for any images to load
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate PDF
      const canvas = await html2canvas(invoiceContainer, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");

      // Add image to PDF (handle multiple pages if needed)
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save(`invoice_${invoice.invoice_id}.pdf`);
      
      // Cleanup
      document.body.removeChild(invoiceContainer);
    } catch (error) {
      console.error("PDF export error:", error);
      triggerAlert("Failed to generate PDF file", "error");
    }
  }
  function handleMultipleExcel(invoiceDataArray) {
    const formattedData = invoiceDataArray.map((invoice) => {
      const services = invoice.selected_services.length> 0 ? `${invoice.selected_services.map((item)=>{
        return `${item.service_name}(${item.quantity}),`
      })}`:null
      return{
      "Invoice ID": invoice.invoice_id,
      "Location":`${invoice.location_name}-${invoice.location_city}-${invoice.location_pincode}`,
      "Guest Name": invoice.guest_name,
      "Check-In Date": invoice.check_in_date,
      "Check-Out Date": invoice.check_out_date,
      "Room Name": invoice.room_name,
      "Room Price": invoice.room_price,
      "Meals": `${
        invoice.meal_chosen
          ? `${invoice.breakfast ? "Breakfast" : ""} ${
              invoice.lunch ? "Lunch" : ""
            } ${invoice.dinner ? "Dinner" : ""}`.trim()
          : "None"
      }`,
      "Meal Price": invoice.meal_price || 0,
      "Services":services,
      "Services Price": invoice.services_price || 0,
      "Total Amount": invoice.amount_paid,
    }});

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `invoices.xlsx`);
  }
  return (
    <>
      <div>
        <div className="mb-4 flex flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Filter by Booking ID"
            name="bookingId"
            value={filters.bookingId}
            onChange={handleFilterChange}
            className="border px-3 py-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Filter by Invoice ID"
            name="invoiceId"
            value={filters.invoiceId}
            onChange={handleFilterChange}
            className="border px-3 py-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Filter by Room Name"
            name="roomName"
            value={filters.roomName}
            onChange={handleFilterChange}
            className="border px-3 py-2 rounded w-full"
          />
          {issuper && (
            <select
              name="locationId"
              value={filters.locationId}
              onChange={handleFilterChange}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location.id} value={location.location_id}>
                  {`${location.location_name}-${location.city}-${location.pincode}`}
                </option>
              ))}
            </select>
          )}
        </div>
        <button disabled={filteredInvoices.length >0 ? false:true} onClick={() => handleMultipleExcel(filteredInvoices)} className={`flex items-center px-4 py-2 bg-blue-500 text-white rounded shadow ${filteredInvoices.length > 0? "hover:bg-blue-600":"cursor-not-allowed"}`}>
      Download Excel<img src={ExcelSVG} alt="Excel button" className="w-6 h-6" />
        </button>
        <div className="border rounded-lg shadow bg-white">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th
                      scope="col"
                      className="border border-gray-300 py-3.5 px-4 text-left text-sm font-semibold"
                    >
                      Invoice Id
                    </th>
                    <th
                      scope="col"
                      className="border border-gray-300 py-3.5 px-4 text-left text-sm font-semibold"
                    >
                      Booking Id
                    </th>
                    {issuper && (
                      <th
                        scope="col"
                        className="border border-gray-300 py-3.5 px-4 text-left text-sm font-semibold"
                      >
                        Location
                      </th>
                    )}
                    <th
                      scope="col"
                      className="border border-gray-300 py-3.5 px-4 text-left text-sm font-semibold"
                    >
                      Room
                    </th>
                    <th
                      scope="col"
                      className="border border-gray-300 py-3.5 px-4 text-left text-sm font-semibold"
                    >
                      Check-In-Date
                    </th>
                    <th
                      scope="col"
                      className="border border-gray-300 py-3.5 px-4 text-left text-sm font-semibold"
                    >
                      Check-Out-Date
                    </th>
                    <th
                      scope="col"
                      className="border border-gray-300 py-3.5 px-4 text-left text-sm font-semibold"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice) => (
                      <tr key={invoice.invoice_id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 whitespace-nowrap py-4 px-4 text-sm">
                          {invoice.invoice_id}
                        </td>
                        <td className="border border-gray-300 whitespace-nowrap py-4 px-4 text-sm">
                          {invoice.booking_id}
                        </td>
                        {issuper && (
                          <td className="border border-gray-300 whitespace-nowrap py-4 px-4 text-sm">
                            {`${invoice.location_name}-${invoice.location_city}-${invoice.location_pincode}`}
                          </td>
                        )}
                        <td className="border border-gray-300 whitespace-nowrap py-4 px-4 text-sm">
                          {invoice.room_name}
                        </td>
                        <td className="border border-gray-300 whitespace-nowrap py-4 px-4 text-sm">
                          {invoice.check_in_date}
                        </td>
                        <td className="border border-gray-300 whitespace-nowrap py-4 px-4 text-sm">
                          {invoice.check_out_date}
                        </td>
                        <td className="flex items-center gap-4 border border-gray-300 whitespace-nowrap py-4 px-4 text-sm">
                          <button onClick={() => handleSingleExcel(invoice)}>
                            <img src={ExcelSVG} alt="" className="w-6 h-6" />
                          </button>
                          <button onClick={() => handleSinglePDF(invoice)}>
                            <img src={PDFSVG} alt="" className="w-6 h-6" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={issuper ? 7 : 6}
                        className="text-center py-4 text-gray-500 font-medium border border-gray-300"
                      >
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {showAlert && (
          <CustomAlert
            message={alertMessage}
            type={alertType}
            onClose={() => setShowAlert(false)}
          />
        )}
        {loading && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="animate-spin h-16 w-16 border-t-4 border-b-4 border-white rounded-full"></div>
          </div>
        )}
      </div>
    </>
  );
};
