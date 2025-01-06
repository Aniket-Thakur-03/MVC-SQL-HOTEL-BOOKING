import axios from "axios";
import React, { useEffect, useState } from "react";
import CustomAlert from "./Notification/CustomAlert";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function HistoryBook() {
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
  const [loading, setLoading] = useState(false);
  const [showbookings, setShowbookings] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [selectLocationId, setSelectLocationId] = useState(null);
  const locationId = jwtDecode(localStorage.getItem("token")).location_id;
  const adminId = jwtDecode(localStorage.getItem("token")).admin_id;
  const fetchHistory = async (location) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8000/api/booking/details/all/history/booking/${
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
            feature_id: 12,
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
  );
}

export default HistoryBook;
