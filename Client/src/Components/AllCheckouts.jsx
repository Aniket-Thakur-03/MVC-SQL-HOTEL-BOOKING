import axios from "axios";
import React, { useEffect, useState } from "react";

function AllCheckouts() {
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("");

  const fetchCheckouts = async () => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    console.log(today, formattedDate);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/booking/${formattedDate}/checkouts`,
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
      setError(`${error.response?.data?.message || error.message}`);
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

  const handleCheckout = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/booking/${id}/staystatus`,
        { stay_status: "stayed" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setFilteredData((prevData) =>
        prevData.map((item) =>
          item.booking_id === id
            ? { ...item, stay_status: response.data.stay_status }
            : item
        )
      );
      alert("Checkout completed successfully!");
    } catch (error) {
      alert(`${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    fetchCheckouts();
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
        <div className="flex items-center gap-2">
          <input
            type="number"
            id="filter"
            className="border border-gray-300 rounded px-4 py-2"
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
      </div>

      <div className="grid gap-4">
        {filteredData.map((item) => (
          <div
            key={item.booking_id}
            className={`border rounded-lg p-4 ${
              item.stay_status === "stayed" ? "bg-green-100" : "bg-white"
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
              <strong>Payment Due:</strong> ₹{item.payment_due}
            </p>
            <p
              className={`text-sm font-semibold ${
                item.stay_status === "stayed"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <strong>Check Status:</strong> {item.stay_status}
            </p>

            {item.stay_status !== "stayed" && (
              <button
                className="mt-4 px-4 py-2 bg-accent text-white rounded hover:bg-accent-dark transition"
                onClick={() => handleCheckout(item.booking_id)}
              >
                Checkout
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllCheckouts;
