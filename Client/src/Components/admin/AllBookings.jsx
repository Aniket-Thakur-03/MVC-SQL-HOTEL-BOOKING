import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomAlert from "../Notification/CustomAlert";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AddServices } from "../AddServices";
import ConfirmationPopup from "../Notification/ConfirmationPopup";

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
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddServiceModel, setIsAddServiceModel] = useState(false);
  const [editBooking, setEditBooking] = useState({});
  const [roomBooking, setRoomBooking] = useState({});
  const [selectLocationId, setSelectLocationId] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const locationId = jwtDecode(localStorage.getItem("token")).location_id;
  const adminId = jwtDecode(localStorage.getItem("token")).admin_id;
  const fetchHistory = async (location) => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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
        setLoading(true);
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
      } finally {
        setLoading(false);
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
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }
  async function fetchRoomPrice(id) {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/rooms/get/one/room/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status == 200) {
        setRoomBooking(response.data.room);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
    setEditBooking({});
    setIsAddServiceModel(false);
    setIsModalOpen(false);
    setCancellationReason("");
    setCustomReason("");
    setSelectedBookingId(null);
  };
  const handleEditing = async (data, id) => {
    try {
      setLoading(true);
      const response = await axios.patch(
        "http://localhost:8000/api/booking/edit/add/services",
        { newData: { ...data }, booking_id: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status == 200) {
        triggerAlert(`${response.data.message}`, "success");
        fetchHistory(selectLocationId);
      }
    } catch (error) {
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
    } finally {
      setIsAddServiceModel(false);
      setLoading(false);
    }
  };
  const handleCancelBooking = async () => {
    if (!cancellationReason) {
      toast.error("Please select a cancellation reason.");
      return;
    }

    const reason =
      cancellationReason === "Other" ? customReason : cancellationReason;

    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectCheckoutBookingId, setSelectCheckoutBookingId] = useState(null);
  
    const handleOpenPopup = () => setPopupOpen(true);
    const handleClosePopup = () => setPopupOpen(false);
  
    const handleConfirm = () => {
      handleCheckout(selectCheckoutBookingId);
      setPopupOpen(false);
    };
  const handleCheckout = async(id) => {
    try {
      setLoading(true);
      const response = await axios.patch(
        `http://localhost:8000/api/booking/update/checked/${id}`,
        { checked_status: "checked_out" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
          responseType: "blob",
        }
      );
      if (
        response.headers["content-type"].includes(
          "application/pdf"
        )
      ) {
        const blob = new Blob([response.data], {
          type: "application/pdf",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `INVOICE${item.booking_id}.pdf`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // if Open in new tab (uncommment if you prefer this)
        // window.open(url, '_blank');

        // Cleanup
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 100);
        setData((prevData) =>
          prevData.map((booking) =>
            booking.booking_id === item.booking_id
              ? {
                  ...booking,
                  checked_status: "checked_out",
                }
              : booking
          )
        );

        toast.success("Checkout successful");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      if (error.response?.data instanceof Blob) {
        const text = await new Response(
          error.response.data
        ).text();
        try {
          const errorData = JSON.parse(text);
          toast.error(errorData.message);
        } catch (e) {
          toast.error("Error processing the response");
        }
      } else {
        toast.error(
          error.response?.data?.message || error.message
        );
      }
    } finally {
      setLoading(false);
    }
  }
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
                    <>
                    <button
                      className="px-4 py-2 ml-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onClick={()=>{
                        setSelectCheckoutBookingId(item.booking_id)
                        handleOpenPopup()
                      }}
                    >
                      Checkout
                    </button>
                    <ConfirmationPopup
                    isOpen={isPopupOpen}
                    onClose={handleClosePopup}
                    onConfirm={handleConfirm}
                    message="Are you sure you want to checkout?"
                  />
                    </>
                  )}
                {item.booking_status === "confirmed" && item.payment_status !="paid" &&
                  item.checked_status === "checked_in" && (
                    <button
                      onClick={() => {
                        setIsAddServiceModel(true);
                        setEditBooking(item);
                        fetchRoomPrice(item.room_id);
                      }}
                      className="px-4 py-2 ml-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      Add Services
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
      {isAddServiceModel && (
        <AddServices
          room={roomBooking}
          booking={editBooking}
          handleEditing={handleEditing}
          showModal={setIsAddServiceModel}
        />
      )}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="animate-spin h-16 w-16 border-t-4 border-b-4 border-white rounded-full"></div>
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
