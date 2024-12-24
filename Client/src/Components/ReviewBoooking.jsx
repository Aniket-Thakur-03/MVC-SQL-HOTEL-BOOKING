import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomAlert from "./Notification/CustomAlert";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function ReviewBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingData, room, csc } = location.state;
  const {
    selling_price,
    veg_meals_price,
    non_veg_meals_price,
    meals_available,
    location_id,
  } = room;
  console.log(room);
  function getUserRole(token) {
    const decoded = jwtDecode(token);
    return decoded.role;
  }
  const [selectedMeals, setSelectedMeals] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });
  const [mealsChosen, setMealsChosen] = useState(false);
  const [mealType, setMealType] = useState(""); // "veg" or "non-veg"
  const [mealsPrice, setMealsPrice] = useState(0);
  const [totalPayment, setTotalPayment] = useState(selling_price);
  const [tax, setTax] = useState(0);
  const [noOfDays, setNoOfDays] = useState(1);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("simple_user");
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
    setRole(getUserRole(localStorage.getItem("token")));
  }, []);

  useEffect(() => {
    const calculateNoOfDays = () => {
      const checkInDate = new Date(bookingData.check_in_date);
      const checkOutDate = new Date(bookingData.check_out_date);
      const diffTime = Math.abs(checkOutDate - checkInDate);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const days = calculateNoOfDays();
    setNoOfDays(days);

    const mealPricePerPerson =
      mealType === "veg" ? veg_meals_price : non_veg_meals_price;
    const totalSelectedMealsPrice =
      (selectedMeals.breakfast + selectedMeals.lunch + selectedMeals.dinner) *
      mealPricePerPerson *
      (bookingData.no_of_adults + bookingData.no_of_kids) *
      days;

    const taxAmount = (selling_price * days + totalSelectedMealsPrice) * 0.12;
    setMealsPrice(totalSelectedMealsPrice);
    setTax(taxAmount);
    setTotalPayment(selling_price * days + totalSelectedMealsPrice + taxAmount);
  }, [
    selectedMeals,
    mealsChosen,
    mealType,
    selling_price,
    bookingData,
    veg_meals_price,
    non_veg_meals_price,
  ]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (mealsChosen && (!mealType || mealsPrice === 0)) {
        throw new Error(
          "Please select a meal type and at least one meal option."
        );
      }
      const response = await axios.post(
        "http://localhost:8000/api/booking/createbooking",
        {
          bookingData: {
            ...bookingData,
            payment_due: totalPayment,
            room_price: selling_price,
            meal_price: meals_available ? mealsPrice : 0,
            meal_chosen: meals_available ? mealsChosen : 0,
            meal_type: meals_available ? mealType : null,
            breakfast: meals_available ? selectedMeals.breakfast : false,
            lunch: meals_available ? selectedMeals.lunch : false,
            dinner: meals_available ? selectedMeals.dinner : false,
            no_of_days: noOfDays,
            location_id: location_id,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success(`${response.data.message}`);
        setTimeout(() => navigate("/", { replace: true }), 2000);
      }
    } catch (error) {
      console.error("Booking failed", error);
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };
  console.log(bookingData);
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
            <strong>Hotel Location:</strong>{" "}
            {`${csc.locationRoom.location_name} -${csc.locationRoom.city}`}
          </p>
          <p>
            <strong>Country:</strong> {csc.country}
          </p>
          <p>
            <strong>State:</strong> {csc.state}
          </p>
          <p>
            <strong>City:</strong> {csc.city}
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
      {meals_available ? (
        <div>
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
                    setMealType("");
                    setMealsPrice(0); // Reset meal price when unchecked
                  }}
                />
                Do you want meals?
              </label>
            </div>

            {mealsChosen && (
              <div>
                <div className="mb-4">
                  <label>
                    <input
                      type="radio"
                      name="mealType"
                      value="veg"
                      checked={mealType === "veg"}
                      onChange={(e) => setMealType(e.target.value)}
                      className="mr-2"
                      defaultChecked
                    />
                    Veg
                  </label>
                  <label className="ml-4">
                    <input
                      type="radio"
                      name="mealType"
                      value="non-veg"
                      checked={mealType === "non-veg"}
                      onChange={(e) => setMealType(e.target.value)}
                      className="mr-2"
                    />
                    Non-Veg
                  </label>
                </div>
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
                    onChange={(e) =>
                      handleMealChange("lunch", e.target.checked)
                    }
                  />
                  Lunch
                </label>
                <label className="block">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedMeals.dinner}
                    onChange={(e) =>
                      handleMealChange("dinner", e.target.checked)
                    }
                  />
                  Dinner
                </label>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mx-auto text-center text-xl text-red-500">
          Meal Not avaiable
        </div>
      )}
      {/* Meals Selection */}

      {/* Payment Summary */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
        <p>
          <strong>Room Price:</strong> ₹{selling_price} x {noOfDays} days
        </p>
        <p>
          <strong>Meals Price:</strong> ₹{mealsPrice}
        </p>
        <p>
          <strong>Taxes:</strong> ₹{tax}
        </p>
        <p className="font-bold">
          <strong>Total Payment:</strong> ₹{totalPayment}
        </p>
      </div>

      {role === "simple_user" ? (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          onClick={handleSubmit}
        >
          Confirm Booking
        </button>
      ) : (
        <div className="text-red-500 text-center">
          {" "}
          Admins Not allowed to book
        </div>
      )}
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
