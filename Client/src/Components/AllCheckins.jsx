import axios from "axios";
import React, { useEffect, useState } from "react";

function AllCheckins() {
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("");
  const fetchCheckins = async () => {
    const today = new Date();
    try {
      const response = await axios.get(
        `http://localhost:8000/api/booking/${
          today.toISOString().split("T")[0]
        }/checkins`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      setError(`${error.response?.message || error.message}`);
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
      const response = await axios.patch(
        `http://localhost:8000/api/booking/${id}/status`,
        { status: "confirmed" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setFilteredData((prevData) =>
        prevData.map((item) =>
          item.booking_id === id
            ? { ...item, status: response.data.status }
            : item
        )
      );
      alert("Booking confirmed successfully!");
    } catch (error) {
      alert(`${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    fetchCheckins();
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

  return (
    <div className="container mx-auto px-4 py-8">
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
              item.status === "confirmed" ? "bg-green-100" : "bg-white"
            }`}
          >
            <p className="text-sm text-gray-600 mb-1">
              <strong>Booking ID:</strong> {item.booking_id}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>User Id:</strong> {item.user_id}
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
              <strong>Room Type:</strong> {item.room_type}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Price:</strong> ₹{item.price}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Payment status:</strong> {item.payment_status}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>status:</strong> {item.status}
            </p>

            {item.status !== "confirmed" && (
              <button
                className="mt-4 px-4 py-2 bg-accent text-white rounded hover:bg-accent-dark transition"
                onClick={() => handleConfirmBooking(item.booking_id)}
              >
                Confirm Booking
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllCheckins;
