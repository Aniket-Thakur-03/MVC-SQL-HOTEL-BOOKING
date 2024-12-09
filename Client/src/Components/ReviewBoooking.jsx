import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomAlert from "./Notification/CustomAlert";
function ReviewBooking() {
  const location = useLocation();
  const { bookingData, room } = location.state;
  const { room_type, selling_price, meals_price, max_persons } = room;

  const [selectedMeals, setSelectedMeals] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });
  const [mealsChosen, setMealsChosen] = useState(false);
  const [mealsPrice, setMealsPrice] = useState(0);
  const [totalPayment, setTotalPayment] = useState(selling_price);
  const [tax, setTax] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const handleMealChange = (meal, isChecked) => {
    const updatedMeals = { ...selectedMeals, [meal]: isChecked };
    setSelectedMeals(updatedMeals);
  };
  const triggerAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };
  useEffect(() => {
    const totalSelectedMealsPrice =
      (selectedMeals.breakfast + selectedMeals.lunch + selectedMeals.dinner) *
      meals_price *
      (bookingData.no_of_adults + bookingData.no_of_kids);
    const taxAmount = (selling_price + totalSelectedMealsPrice) * 0.12;
    setMealsPrice(totalSelectedMealsPrice);
    setTax(taxAmount);
    setTotalPayment(selling_price + totalSelectedMealsPrice + taxAmount);
  }, [selectedMeals, mealsChosen, selling_price, bookingData, meals_price]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (mealsChosen && mealsPrice == 0) {
        throw new Error(
          "You have chosen meals.please select atleast 1 option from Breakfast, Lunch and Dinner"
        );
      }
      const response = await axios.post(
        "http://localhost:8000/api/booking/createbooking",
        {
          bookingData: {
            ...bookingData,
            payment_due: totalPayment,
            room_price: selling_price,
            meal_price: mealsPrice,
            meal_chosen: mealsChosen,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status == 201) {
        toast.success(`${response.data.message}`);
      }
    } catch (error) {
      console.error("Booking failed", error);
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Review Your Booking
      </h2>

      {/* Booking Details */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p>
            <strong>Guest Name:</strong> {bookingData.guest_name}
          </p>
          <p>
            <strong>Email:</strong> {bookingData.guest_email}
          </p>
          <p>
            <strong>Phone No:</strong> {bookingData.guest_phone_no}
          </p>
          <p>
            <strong>Address:</strong> {bookingData.address}
          </p>
          <p>
            <strong>Check-in Date:</strong>{" "}
            {bookingData.check_in_date.toLocaleDateString()}
          </p>
          <p>
            <strong>Check-out Date:</strong>{" "}
            {bookingData.check_out_date.toLocaleDateString()}
          </p>
          <p>
            <strong>Special Requests:</strong> {bookingData.special_requests}
          </p>
          <p>
            <strong>Aadhar Card:</strong> {bookingData.guest_aadhar_card}
          </p>
          <p>
            <strong>No. of Adults:</strong> {bookingData.no_of_adults}
          </p>
          <p>
            <strong>No. of Kids:</strong> {bookingData.no_of_kids}
          </p>
        </div>
      </div>

      {/* Meals Selection */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Meals</h3>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={mealsChosen}
              onChange={(e) => {
                setMealsChosen(e.target.checked);
                setSelectedMeals({
                  breakfast: false,
                  lunch: false,
                  dinner: false,
                });
                setMealsPrice(0); // Reset meal price when unchecked
              }}
            />
            Do you want meals?
          </label>
        </div>

        {mealsChosen && (
          <div>
            <p className="text-sm mb-2 text-gray-600">
              Price per meal per person: ₹{meals_price}
            </p>
            <label className="block">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedMeals.breakfast}
                onChange={(e) =>
                  handleMealChange("breakfast", e.target.checked)
                }
              />
              Breakfast
            </label>
            <label className="block">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedMeals.lunch}
                onChange={(e) => handleMealChange("lunch", e.target.checked)}
              />
              Lunch
            </label>
            <label className="block">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedMeals.dinner}
                onChange={(e) => handleMealChange("dinner", e.target.checked)}
              />
              Dinner
            </label>
          </div>
        )}
      </div>

      {/* Payment Summary */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
        <p>
          <strong>Room Price:</strong> ₹{selling_price}
        </p>
        <p>
          <strong>Meals Price:</strong> ₹{mealsPrice}
        </p>
        <p>
          <strong>GST (12%):</strong> ₹{tax}
        </p>
        <p className="font-bold">
          <strong>Total Payment:</strong> ₹{totalPayment}
        </p>
      </div>

      {/* Confirm Button */}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        onClick={handleSubmit}
      >
        Confirm Booking
      </button>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="animate-spin h-16 w-16 border-t-4 border-b-4 border-white rounded-full"></div>
        </div>
      )}
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

export default ReviewBooking;
