import { useEffect, useState } from "react";
import axios from "axios";
import CustomAlert from "./Notification/CustomAlert";

function UpdatePayment() {
  const [id, setId] = useState(0);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [amount, setAmount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
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
        `http://localhost:8000/api/booking/details/booking/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setData(response.data.booking);
      setError(null);
    } catch (error) {
      setData(null);
      setError(`${error.response?.data?.message || error.message}`);
    }
  };
  const triggerAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
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
            data.payment_status === "paid"
              ? "bg-green-100 border-green-500"
              : "bg-white border-gray-300"
          }`}
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
            <strong>Guest Email:</strong> {data.guest_email}
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
            <strong>Booking Status:</strong>
            {data.booking_status}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Room Type:</strong> {data.Room.room_type}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Price:</strong> ₹{data.Room.price}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Payment Due:</strong> ₹{data.payment_due}
          </p>
          <p
            className={`text-sm font-semibold ${
              data.payment_status === "paid" ? "text-green-600" : "text-red-600"
            }`}
          >
            <strong>Payment Status:</strong> {data.payment_status}
          </p>
          {data.payment_status !== "paid" && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const response = await axios.patch(
                    `http://localhost:8000/api/booking/update/payment/${id}`,
                    { price: data.Room.price, amount: Number(amount) },
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
                    payment_status: response.data.booking.payment_status,
                    payment_due: response.data.booking.payment_due,
                  }));
                  triggerAlert(
                    "Payment status updated successfully!",
                    "success"
                  );
                } catch (error) {
                  triggerAlert(
                    `${error.response?.data.message || error.message}`,
                    "error"
                  );
                }
              }}
            >
              <input
                type="number"
                name="amount_paid"
                id="amount_paid"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-48 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                required
              />
              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-accent text-white rounded hover:bg-accent-dark transition"
              >
                Update Payment
              </button>
            </form>
          )}
        </div>
      ) : (
        <p>
          <strong>No Booking with this id</strong>
        </p>
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

export default UpdatePayment;
