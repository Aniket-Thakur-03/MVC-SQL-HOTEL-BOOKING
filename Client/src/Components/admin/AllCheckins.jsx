import axios from "axios";
import React, { useEffect, useState } from "react";
import CustomAlert from "../Notification/CustomAlert";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import ConfirmationPopup from "../Notification/ConfirmationPopup";
function AllCheckins() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("");
  const location_id = jwtDecode(localStorage.getItem("token")).location_id;
  const locationId = jwtDecode(localStorage.getItem("token")).location_id;
  const adminId = jwtDecode(localStorage.getItem("token")).admin_id;
  const issuper = jwtDecode(localStorage.getItem("token")).issuper;
  const [loading, setLoading] = useState(false);
  const [showbookings, setShowbookings] = useState(true);
  const [selectLocationId, setSelectLocationId] = useState(null);
  const [locations, setLocations] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
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
  const fetchCheckins = async (location) => {
    const today = new Date();
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/booking/details/${
          issuper ? location : location_id
        }/checkins?date=${today.toISOString().split("T")[0]}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status == 200) {
        setData(response.data.bookings);
        setFilteredData(response.data.bookings);
        setShowbookings(true);
        console.log(response.data.bookings);
      }
    } catch (error) {
      setShowbookings(false);
      console.error("Error fetching booking details:", error);
      setError(`${error.response?.data.message || error.message}`);
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };
  const handleFilter = () => {
    if (filter === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(
        (item) => item.booking_id === Number(filter)
      );
      setFilteredData(filtered);
    }
  };

  const handleConfirmBooking = async (id) => {
    try {
      setLoading(true);
      const response = await axios.patch(
        `http://localhost:8000/api/booking/update/booking/confirm/${id}`,
        { booking_status: "confirmed", checked_status: "checked_in" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status == 200) {
        setFilteredData((prevData) =>
          prevData.map((item) =>
            item.booking_id === id
              ? {
                  ...item,
                  booking_status: response.data.booking.booking_status,
                }
              : item
          )
        );
        triggerAlert(`${response.data.message}`, "success");
      }
    } catch (error) {
      triggerAlert(`${error.response?.data.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "http://localhost:8000/api/preference/search/feature/access/v1/admin",
          {
            feature_id: 2,
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
    if (issuper) {
      fetchLocations();
      setShowbookings(false);
    } else {
      fetchCheckins();
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      alert("Please log in");
      window.location.href = "/";
    }
    if (error === "Session expired. Please log in again.") {
      alert(`${error}`);
      localStorage.removeItem("token");
      window.location.href = "/";
    } else if (error === "Access denied. No token provided.") {
      alert(`${error}`);
      localStorage.removeItem("token");
      window.location.href = "/";
    } else if (error === "Invalid Token") {
      alert(`${error} Please sign in again.`);
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  }, [error]);
  const handleLocationChange = (e) => {
    const selectedValue = e.target.value ? parseInt(e.target.value, 10) : null;
    setSelectLocationId(selectedValue);
    console.log(selectedValue);
    if (selectedValue) {
      fetchCheckins(selectedValue);
      // Fetch rooms for the selected location
    } else {
      setData([]);
      setFilteredData([]); // Clear rooms if no location is selected
    }
  };
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const handleOpenPopup = () => setPopupOpen(true);
  const handleClosePopup = () => setPopupOpen(false);

  const handleConfirm = () => {
    handleConfirmBooking(selectedBookingId);
    setPopupOpen(false);
  };
  return (
    <div className="container mx-auto px-4 py-8">
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
        <div>
          <div className="mb-6">
            <label htmlFor="filter" className="block mb-2 font-medium">
              Filter by Booking ID:
            </label>
            <input
              type="number"
              id="filter"
              className="w-full border border-gray-300 rounded px-4 py-2"
              placeholder="Enter Booking ID"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-accent text-white rounded hover:bg-accent-dark transition"
              onClick={handleFilter}
            >
              Search
            </button>
          </div>

          <div className="grid gap-4">
            {filteredData.map((item) => (
              <div
                key={item.booking_id}
                className={`border rounded-lg p-4 ${
                  item.booking_status === "confirmed"
                    ? "bg-green-100"
                    : "bg-white"
                }`}
              >
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Booking ID:</strong> {item.booking_id}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>User Id:</strong> {item.user_id}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Guest Phone No:</strong> {item.guest_phone_no}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Guest Email:</strong> {item.guest_email}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Guest Name:</strong> {item.guest_name}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Check-in Date:</strong>{" "}
                  {new Date(item.check_in_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Check-out Date:</strong>{" "}
                  {new Date(item.check_out_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Payment Due:</strong> ₹{item.payment_due}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Room Price:</strong> ₹{item.room_price}
                </p>
                {item.meal_chosen && (
                  <div>
                    <p className="text-sm text-gray-600">
                      <strong>Meals Price:</strong> ₹{item.meal_price}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Meal Type: </strong>
                      {item.meal_type == "veg" ? (
                        <span className="text-green-500">veg</span>
                      ) : (
                        <span className="text-red-500">nonveg</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Meal Time:</strong>
                      {item.breakfast && "Breakfast"}
                      {item.lunch && "Lunch"}
                      {item.dinner && "Dinner"}
                    </p>
                  </div>
                )}

                <p className="text-sm text-gray-600 mb-1">
                  <strong>Payment status:</strong> {item.payment_status}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Booking status:</strong>{" "}
                  <span
                    className={`${
                      item.booking_status === "cancelled"
                        ? "text-red-600"
                        : item.booking_status === "confirmed"
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {item.booking_status}
                  </span>
                </p>

                {item.booking_status === "pending" && (
                  <>
                  <button
                    className="mt-4 px-4 py-2 bg-accent text-white rounded hover:bg-accent-dark transition"
                    onClick={()=>{
                      setSelectedBookingId(item.booking_id)
                      handleOpenPopup()
                    }}
                  >
                    Confirm Booking
                  </button>
        
                  <ConfirmationPopup
                    isOpen={isPopupOpen}
                    onClose={handleClosePopup}
                    onConfirm={handleConfirm}
                    message="Are you sure you want to confirm this booking?"
                  />
                </>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null}
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

export default AllCheckins;
