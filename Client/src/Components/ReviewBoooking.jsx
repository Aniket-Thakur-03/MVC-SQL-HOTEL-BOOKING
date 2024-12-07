// ReviewBooking.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function ReviewBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingData, room } = location.state;
  const { room_type, selling_price, meals_price, max_persons } = room;

  const [selectedMeals, setSelectedMeals] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });

  const [mealPrice, setMealPrice] = useState(0);
  const [totalPayment, setTotalPayment] = useState(selling_price);
  const [tax, setTax] = useState(0);

  const handleMealChange = (meal, isChecked) => {
    const updatedMeals = { ...selectedMeals, [meal]: isChecked };
    setSelectedMeals(updatedMeals);
  };

  useEffect(() => {
    const totalMealsPrice =
      (selectedMeals.breakfast + selectedMeals.lunch + selectedMeals.dinner) *
      (mealPrice * (bookingData.no_of_adults + bookingData.no_of_kids));
    const taxAmount = (selling_price + totalMealsPrice) * 0.12;
    setMealPrice(totalMealsPrice);
    setTax(taxAmount);
    setTotalPayment(selling_price + totalMealsPrice + taxAmount);
  }, [selectedMeals, selling_price, bookingData]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/bookings", {
        ...bookingData,
        total_amount: totalPayment,
        meal_price: mealPrice,
        tax: tax,
        payment_status: "pending",
      });
      navigate("/confirmation", { state: response.data });
    } catch (error) {
      console.error("Booking failed", error);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <h2 className="text-2xl font-bold mb-6">Review Your Booking</h2>
      <div className="mb-6">
        <h3>Room Details</h3>
        <p>Room Type: {room_type}</p>
        <p>Price: ₹{selling_price}</p>
      </div>
      <div className="mb-6">
        <h3>Select Meals</h3>
        <label>
          <input
            type="checkbox"
            checked={selectedMeals.breakfast}
            onChange={(e) => handleMealChange("breakfast", e.target.checked)}
          />
          Breakfast
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={selectedMeals.lunch}
            onChange={(e) => handleMealChange("lunch", e.target.checked)}
          />
          Lunch
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={selectedMeals.dinner}
            onChange={(e) => handleMealChange("dinner", e.target.checked)}
          />
          Dinner
        </label>
      </div>
      <div className="mb-6">
        <h3>Total Payment</h3>
        <p>Room Price: ₹{selling_price}</p>
        <p>Meal Price: ₹{mealPrice}</p>
        <p>GST: ₹{tax}</p>
        <p>Total: ₹{totalPayment}</p>
      </div>
      <button className="btn btn-primary" onClick={handleSubmit}>
        Confirm Booking
      </button>
    </div>
  );
}

export default ReviewBooking;
