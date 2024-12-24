import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomAlert from "./Notification/CustomAlert";

function BookHistory() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const [filters, setFilters] = useState({
    bookingId: "",
    guestName: "",
    checkInDate: "",
  });
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      triggerAlert("User logged off, Please sign in again", "error");
      window.location.href = "/";
      return;
    }

    function getUserId(token) {
      const decoded = jwtDecode(token);
      return decoded.user_id;
    }

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const userId = getUserId(token);
        const response = await axios.get(
          `http://localhost:8000/api/booking/details/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status == 200 && Array.isArray(response.data.bookings)) {
          setData(response.data.bookings);
          setFilteredData(response.data.bookings);
          setErrors({});
        } else {
          setData([]);
          setFilteredData([]);
        }
      } catch (error) {
        setErrors({
          api: error.response?.data.message,
        });
      } finally {
        setLoading(false);
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
  const openModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCancellationReason("");
    setCustomReason("");
  };

  const handleCancelBooking = async () => {
    if (!cancellationReason) {
      toast.error("Please select a cancellation reason");
      return;
    }

    try {
      setLoading(true);
      closeModal(); // Close the modal after successful cancellation
      const response = await axios.patch(
        `http://localhost:8000/api/booking/update/booking/cancel/${selectedBookingId}`,
        {
          booking_status: "cancelled",
          cancellation_reasons: cancellationReason,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update the data and filteredData state
      if (response.status == 200) {
        setData((prevData) =>
          prevData.map((booking) =>
            booking.booking_id === selectedBookingId
              ? { ...booking, booking_status: "cancelled" }
              : booking
          )
        );
        setFilteredData((prevData) =>
          prevData.map((booking) =>
            booking.booking_id === selectedBookingId
              ? { ...booking, booking_status: "cancelled" }
              : booking
          )
        );

        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(`Error: ${error.response?.data.message || error.message}`);
      closeModal();
    } finally {
      setLoading(false);
    }
  };
  console.log(filteredData, data);
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
        {filteredData && filteredData.length > 0 ? (
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
              <p className="text-sm text-gray-600">Location: {item.location}</p>
              <p className="text-sm text-gray-600">
                Room Price: ₹{item.room_price}
              </p>
              {item.meal_chosen && (
                <p className="text-sm text-gray-600">
                  Meals Price: ₹{item.meal_price}
                </p>
              )}
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
                  onClick={() => openModal(item.booking_id)}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600">No matching records found.</p>
        )}
        {errors.api && <p className="text-red-500 mt-4">Error: {errors.api}</p>}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Cancellation Reason</h2>
            <div className="mb-4">
              <label className="block mb-2">
                <input
                  type="radio"
                  name="cancellationReason"
                  value="Booking by mistake"
                  onChange={(e) => setCancellationReason(e.target.value)}
                />
                Booking by mistake
              </label>
              <label className="block mb-2">
                <input
                  type="radio"
                  name="cancellationReason"
                  value="Trip Cancelled"
                  onChange={(e) => setCancellationReason(e.target.value)}
                />
                Trip Cancelled
              </label>
              <label className="block mb-2">
                <input
                  type="radio"
                  name="cancellationReason"
                  value="Personal reasons"
                  onChange={(e) => setCancellationReason(e.target.value)}
                />
                Personal reasons
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="cancellationReason"
                  value="Other"
                  onChange={(e) => setCancellationReason(e.target.value)}
                />
                Other
              </label>
              {cancellationReason === "Other" && (
                <input
                  type="text"
                  placeholder="Enter your reason"
                  className="border px-3 py-2 rounded mt-2 w-full"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                />
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-300 rounded hover:bg-gray-400"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded hover:bg-red-600"
                onClick={handleCancelBooking}
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="animate-spin h-16 w-16 border-t-4 border-b-4 border-white rounded-full"></div>
        </div>
      )}
      <ToastContainer />
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

export default BookHistory;
