import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomAlert from "./Notification/CustomAlert";

function AllBookings() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    bookingId: "",
    guestName: "",
    checkInDate: "",
  });
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      triggerAlert("User logged off, Please sign in again", "error");
      window.location.href = "/";
      return;
    }

    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8000/api/booking/details/booking/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response.data);
        setData(response.data.bookings);
        setFilteredData(response.data.bookings);
        setErrors({});
      } catch (error) {
        console.error("Api error:", error.message);
        setErrors({
          api: error.response?.data.message,
        });
      }
    };

    fetchHistory();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  const triggerAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };
  useEffect(() => {
    const filtered = data.filter((item) => {
      const matchesBookingId = filters.bookingId
        ? item.booking_id.toString().includes(filters.bookingId)
        : true;
      const matchesGuestName = filters.guestName
        ? item.guest_name
            .toLowerCase()
            .includes(filters.guestName.toLowerCase())
        : true;
      const matchesCheckInDate = filters.checkInDate
        ? new Date(item.check_in_date).toLocaleDateString("en-CA") ===
          filters.checkInDate
        : true;
      return matchesBookingId && matchesGuestName && matchesCheckInDate;
    });
    setFilteredData(filtered);
  }, [filters, data]);
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-accent mb-6">Booking History</h1>
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
            placeholder="Filter by Guest Name"
            name="guestName"
            value={filters.guestName}
            onChange={handleFilterChange}
            className="border px-3 py-2 rounded w-full"
          />
          <input
            type="date"
            title="Filter by Check-In Date"
            name="checkInDate"
            value={filters.checkInDate}
            onChange={handleFilterChange}
            className="border px-3 py-2 rounded w-full"
          />
        </div>
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div
              key={item.booking_id}
              className={`border rounded-lg shadow-md p-4 ${
                item.booking_status === "cancelled"
                  ? "bg-red-100 border-red-400"
                  : item.booking_status === "confirmed"
                  ? "bg-green-100 border-green-400"
                  : "bg-white"
              }`}
            >
              <h2
                className={`font-semibold text-lg mb-2 ${
                  item.booking_status === "cancelled"
                    ? "text-red-600"
                    : item.booking_status === "confirmed"
                    ? "text-green-600"
                    : "text-primary"
                }`}
              >
                Booking ID: {item.booking_id}
              </h2>
              <p className="text-sm text-gray-600">
                Payment Status:{" "}
                <span
                  className={`font-semibold text-accent ${
                    item.payment_status === "unpaid"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {item.payment_status}
                </span>
              </p>
              <p className="text-sm text-gray-600">User Id: {item.user_id}</p>
              <p className="text-sm text-gray-600">
                Guest Name: {item.guest_name}
              </p>
              <p className="text-sm text-gray-600">
                Check-in Date:{" "}
                {new Date(item.check_in_date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                Check-out Date:{" "}
                {new Date(item.check_out_date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                Room Type: {item.Room.room_type} |Room Price: ₹{item.room_price}
              </p>
              {item.meal_chosen && (
                <p className="text-sm text-gray-600">
                  Meals Price: ₹{item.meal_price}
                </p>
              )}

              <p className="text-sm text-gray-600">
                Booking Status: {item.booking_status}
              </p>
              <p
                className={`text-sm font-semibold ${
                  item.checked_status === "checked_out"
                    ? "text-green-600"
                    : "text-black" || item.checked_status === "not_checked"
                    ? "text-red-600"
                    : "text-black" || item.checked_status === "checked_in"
                    ? "text-blue-600"
                    : "text-black"
                }`}
              >
                Checked Status:{" "}
                {item.checked_status === "not_checked"
                  ? `Not Checked`
                  : item.checked_status === "checked_in"
                  ? `Checked In`
                  : item.checked_status === "checked_out"
                  ? `Checked Out`
                  : null}
              </p>
              {item.special_requests && (
                <p className="text-sm text-gray-600">
                  Special Requests: {item.special_requests}
                </p>
              )}
              <p className="text-sm text-gray-600">
                Payment Due: ₹{item.payment_due}
              </p>
              {item.booking_status === "pending" && (
                <button
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      const response = await axios.patch(
                        `http://localhost:8000/api/booking/update/booking/cancel/${item.booking_id}`,
                        { booking_status: "cancelled" },
                        {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                              "token"
                            )}`,
                          },
                        }
                      );
                      setData((prevData) =>
                        prevData.map((booking) =>
                          booking.booking_id === item.booking_id
                            ? { ...booking, booking_status: "cancelled" }
                            : booking
                        )
                      );
                      toast.success(`${response.data.message}`);
                    } catch (error) {
                      toast.error(
                        `Error: ${
                          error.response?.data.message || error.message
                        }`
                      );
                    }
                  }}
                >
                  Cancel Booking
                </button>
              )}
              {item.booking_status === "confirmed" &&
                item.checked_status === "checked_in" && (
                  <button
                    className="px-4 py-2 ml-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        const response = await axios.patch(
                          `http://localhost:8000/api/booking/update/checked/${item.booking_id}`,
                          { checked_status: "checked_out" },
                          {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem(
                                "token"
                              )}`,
                            },
                          }
                        );
                        setData((prevData) =>
                          prevData.map((booking) =>
                            booking.booking_id === item.booking_id
                              ? { ...booking, checked_status: "checked_out" }
                              : booking
                          )
                        );
                        toast.success(`${response.data.message}`);
                      } catch (error) {
                        toast.error(
                          `Error: ${
                            error.response?.data.message || error.message
                          }`
                        );
                      }
                    }}
                  >
                    Checkout
                  </button>
                )}
            </div>
          ))
        ) : (
          <p className="text-gray-600">No matching records found.</p>
        )}
        {errors.api && <p className="text-red-500 mt-4">Error: {errors.api}</p>}
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}

export default AllBookings;
