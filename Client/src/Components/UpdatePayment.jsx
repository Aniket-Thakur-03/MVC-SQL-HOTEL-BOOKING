import { useEffect, useState } from "react";
import axios from "axios";

function UpdatePayment() {
  const [id, setId] = useState(0);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [isClicked, setIsClicked] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:8000/api/booking/${id}/admin`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setData(response.data);
      setError(null);
      setIsClicked(false); // Reset clicked state for new search
    } catch (error) {
      setData(null);
      setError(`${error.response?.data?.message || "An error occurred"}`);
    }
  };

  const handleBoxClick = () => {
    setIsClicked(true);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <form onSubmit={handleSubmit} className="mb-6">
        <label
          htmlFor="bookingid"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Enter Booking ID
        </label>
        <div className="flex gap-4 items-center">
          <input
            type="number"
            id="bookingid"
            name="bookingid"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2 w-48 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-accent text-white rounded hover:bg-accent-dark transition"
          >
            Search
          </button>
        </div>
      </form>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {data ? (
        <div
          className={`p-4 border rounded shadow-md transition ${
            isClicked || data.payment_status === "paid"
              ? "bg-green-100 border-green-500"
              : "bg-white border-gray-300"
          }`}
          onClick={handleBoxClick}
        >
          <p className="text-sm text-gray-600 mb-1">
            <strong>Booking ID:</strong> {data.booking_id}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>User Id:</strong> {data.user_id}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Guest Name:</strong> {data.guest_name}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Check-in Date:</strong>{" "}
            {new Date(data.check_in_date).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Check-out Date:</strong>{" "}
            {new Date(data.check_out_date).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Room Type:</strong> {data.room_type}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Price:</strong> ₹{data.price}
          </p>
          <p
            className={`text-sm font-semibold ${
              data.payment_status === "paid" ? "text-green-600" : "text-red-600"
            }`}
          >
            <strong>Payment Status:</strong> {data.payment_status}
          </p>
          {data.payment_status !== "paid" && !isClicked && (
            <button
              className="mt-4 px-4 py-2 bg-accent text-white rounded hover:bg-accent-dark transition"
              onClick={async () => {
                try {
                  const response = await axios.patch(
                    `http://localhost:8000/api/booking/${id}/paymentstatus`,
                    { payment_status: "paid", payment_due: 0 },
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                    }
                  );
                  setData((prevData) => ({
                    ...prevData,
                    payment_status: response.data.payment_status,
                  }));
                  alert("Payment status updated successfully!");
                } catch (error) {
                  alert(`${error.message || error.response?.message}`);
                }
              }}
            >
              Change Payment Status
            </button>
          )}
        </div>
      ) : (
        <p>
          <strong>No Booking with this id</strong>
        </p>
      )}
    </div>
  );
}

export default UpdatePayment;
