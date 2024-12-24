import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomAlert from "./Notification/CustomAlert";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function AllBookings() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    bookingId: "",
    guestName: "",
    checkInDate: "",
  });
  const [locations, setLocations] = useState([]);
  const [errors, setErrors] = useState({});
  const location_id = jwtDecode(localStorage.getItem("token")).location_id;
  const issuper = jwtDecode(localStorage.getItem("token")).issuper;
  const [showbookings, setShowbookings] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectLocationId, setSelectLocationId] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const locationId = jwtDecode(localStorage.getItem("token")).location_id;
  const adminId = jwtDecode(localStorage.getItem("token")).admin_id;
  const fetchHistory = async (location) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8000/api/booking/details/all/booking/${
          location || location_id
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowbookings(true);
      setData(response.data.bookings);
      setFilteredData(response.data.bookings);
      setErrors({});
    } catch (error) {
      setErrors({
        api: error.response?.data.message,
      });
    }
  };
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      triggerAlert("User logged off, Please sign in again", "error");
      window.location.href = "/";
      return;
    }
    if (issuper) {
      fetchLocations();
      setShowbookings(false);
    } else {
      fetchHistory();
    }
    (async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/preference/search/feature/access/v1/admin",
          {
            feature_id: 1,
            admin_id: adminId,
            location_id: locationId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status == 200) {
          return;
        }
      } catch (error) {
        navigate("/unauthorized", { replace: true });
        return;
      }
    })();
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
  async function fetchLocations() {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/location/get/admin/location",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setLocations(response.data.locations);
      }
    } catch (error) {
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
    }
  }

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

  const openModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCancellationReason("");
    setCustomReason("");
    setSelectedBookingId(null);
  };

  const handleCancelBooking = async () => {
    if (!cancellationReason) {
      toast.error("Please select a cancellation reason.");
      return;
    }

    const reason =
      cancellationReason === "Other" ? customReason : cancellationReason;

    try {
      const response = await axios.patch(
        `http://localhost:8000/api/booking/update/booking/cancel/${selectedBookingId}`,
        { booking_status: "cancelled", cancellation_reason: reason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setData((prevData) =>
        prevData.map((booking) =>
          booking.booking_id === selectedBookingId
            ? { ...booking, booking_status: "cancelled" }
            : booking
        )
      );
      toast.success(`${response.data.message}`);
      closeModal();
    } catch (error) {
      toast.error(`Error: ${error.response?.data.message || error.message}`);
    }
  };
  const handleLocationChange = (e) => {
    const selectedValue = e.target.value ? parseInt(e.target.value, 10) : null;
    setSelectLocationId(selectedValue);
    console.log(selectedValue);
    if (selectedValue) {
      fetchHistory(selectedValue);
      // Fetch rooms for the selected location
    } else {
      setData([]);
      setFilteredData([]); // Clear rooms if no location is selected
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      {issuper ? (
        <div>
          <div>
            <label htmlFor="locationid">Select Location</label>
            <select
              className="mb-4 px-4 py-2 border rounded w-full"
              name="location"
              id="locationid"
              onChange={handleLocationChange}
              value={selectLocationId || ""}
            >
              <option value="">Select location</option>
              {locations.map((location) => (
                <option
                  key={location.location_id}
                  value={location.location_id.toString()}
                >
                  {`${location.location_name}-${location.city}(${location.pincode})`}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}
      {showbookings ? (
        <div className="flex-grow container mx-auto px-4 py-8">
          {/* Filter Inputs */}
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
          {/* Bookings List */}
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
                <h2 className="font-semibold text-lg mb-2 text-primary">
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
                <p className="text-sm text-gray-600">
                  Room Price: ₹{item.room_price}
                </p>
                {item.meal_chosen && (
                  <div>
                    <p className="text-sm text-gray-600">
                      Meals Price: {item.meal_price}
                    </p>
                    <p className="text-sm text-gray-600">
                      Meal Type: {item.meal_type}
                    </p>
                    <p className="text-sm text-gray-600">
                      Meal Time:
                      {item.breakfast && (
                        <p className="text-sm text-gray-600">Breakfast</p>
                      )}
                      {item.lunch && (
                        <p className="text-sm text-gray-600">Lunch</p>
                      )}
                      {item.dinner && (
                        <p className="text-sm text-gray-600">Dinner</p>
                      )}
                    </p>
                  </div>
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
                    className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded hover:bg-red-600"
                    onClick={() => openModal(item.booking_id)}
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
                            `${error.response?.data.message || error.message}`
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
          {/* Error Display */}
          {errors.api && (
            <p className="text-red-500 mt-4">Error: {errors.api}</p>
          )}
        </div>
      ) : null}

      {/* Toast Notifications */}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        theme="colored"
      />
      {/* Cancellation Reason Modal */}
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
