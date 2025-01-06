import { useState, useEffect } from "react";
import axios from "axios";

export const AddServices = ({ booking, room, handleEditing, showModal }) => {
  const [newdata, setNewData] = useState({
    meal_chosen: booking.meal_chosen,
    meal_type: booking.meal_type,
    meal_price: booking.meal_price,
    breakfast: booking.breakfast,
    lunch: booking.lunch,
    dinner: booking.dinner,
    persons: booking.no_of_adults + booking.no_of_kids,
    no_of_days: booking.no_of_days,
    total: booking.meal_price + booking.services_price,
    selected_services: booking.selected_services || [],
  });

  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/extra/get/all/extra/active/services/${booking.location_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setServices(response.data.services);
        setFilteredServices(response.data.services);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, [booking.location_id]);

  useEffect(() => {
    const calculateMealPrice = () => {
      let basePrice = 0;
      const { breakfast, lunch, dinner, meal_type, persons, no_of_days } =
        newdata;

      const mealUnitPrice =
        meal_type === "veg" ? room.veg_meals_price : room.non_veg_meals_price;

      if (breakfast) basePrice += mealUnitPrice;
      if (lunch) basePrice += mealUnitPrice;
      if (dinner) basePrice += mealUnitPrice;

      // Calculate service price with GST
      let servicePrice = newdata.selected_services.reduce((acc, service) => {
        const gstMultiplier = 1 + service.gst_rate / 100; // Convert GST rate to multiplier
        return acc + service.total_price * gstMultiplier;
      }, 0);

      // Calculate meal price with GST (assuming 12% GST on meals)
      const mealPriceBeforeTax = basePrice * persons * no_of_days;
      const mealPriceWithTax = mealPriceBeforeTax + mealPriceBeforeTax * 0.12;

      const totalPrice = parseInt(mealPriceWithTax + servicePrice);

      setNewData((prev) => ({
        ...prev,
        meal_price: mealPriceBeforeTax,
        total: totalPrice,
      }));
    };

    calculateMealPrice();
  }, [
    newdata.breakfast,
    newdata.lunch,
    newdata.dinner,
    newdata.meal_type,
    newdata.selected_services,
  ]);

  useEffect(() => {
    const isChanged =
      newdata.meal_chosen !== booking.meal_chosen ||
      newdata.meal_type !== booking.meal_type ||
      newdata.breakfast !== booking.breakfast ||
      newdata.lunch !== booking.lunch ||
      newdata.dinner !== booking.dinner ||
      newdata.total !== booking.meal_price ||
      newdata.selected_services.length > 0;

    setIsConfirmEnabled(isChanged);
  }, [newdata, booking]);

  const handleInputChange = (field, value) => {
    setNewData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleServiceSelection = (service, isChecked, quantity = 1) => {
    setNewData((prev) => {
      const existingService = prev.selected_services.find(
        (s) => s.service_id === service.service_id
      );

      if (isChecked) {
        if (existingService) {
          // Update the existing service
          return {
            ...prev,
            selected_services: prev.selected_services.map((s) =>
              s.service_id === service.service_id
                ? {
                    ...s,
                    quantity,
                    total_price: s.service_price * quantity,
                  }
                : s
            ),
          };
        } else {
          // Add new service to selected_services
          return {
            ...prev,
            selected_services: [
              ...prev.selected_services,
              {
                ...service,
                quantity,
                total_price: service.service_price * quantity,
              },
            ],
          };
        }
      } else {
        // Remove the service if unchecked
        return {
          ...prev,
          selected_services: prev.selected_services.filter(
            (s) => s.service_id !== service.service_id
          ),
        };
      }
    });
  };
  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    setFilteredServices(
      services.filter((service) =>
        service.service_name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-md overflow-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add Services
          </h2>
          <div className="space-y-4">
            <div className="space-y-4">
              {room.meals_available && !newdata.meal_chosen && (
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 focus:ring-green-500"
                      onChange={(e) =>
                        handleInputChange("meal_chosen", e.target.checked)
                      }
                    />
                    <span className="text-sm text-gray-700">Add Meal</span>
                  </label>
                </div>
              )}

              {newdata.meal_chosen && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Meal Type
                    </label>
                    <select
                      className="mt-1 block w-full px-3 py-2 border rounded shadow-sm focus:ring-green-500 focus:border-green-500"
                      value={newdata.meal_type}
                      onChange={(e) =>
                        handleInputChange("meal_type", e.target.value)
                      }
                    >
                      <option value="">Select Meal Type</option>
                      <option value="veg">
                        Veg {`(₹${room.veg_meals_price} for 1 person)`}
                      </option>
                      <option value="non-veg">
                        Non-Veg {`(₹${room.non_veg_meals_price} for 1 person)`}
                      </option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-gray-300 focus:ring-green-500"
                        checked={newdata.breakfast}
                        disabled={!newdata.meal_chosen}
                        onChange={(e) =>
                          handleInputChange("breakfast", e.target.checked)
                        }
                      />
                      <span className="text-sm text-gray-700">
                        Add Breakfast
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-gray-300 focus:ring-green-500"
                        checked={newdata.lunch}
                        disabled={!newdata.meal_chosen}
                        onChange={(e) =>
                          handleInputChange("lunch", e.target.checked)
                        }
                      />
                      <span className="text-sm text-gray-700">Add Lunch</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-gray-300 focus:ring-green-500"
                        checked={newdata.dinner}
                        disabled={!newdata.meal_chosen}
                        onChange={(e) =>
                          handleInputChange("dinner", e.target.checked)
                        }
                      />
                      <span className="text-sm text-gray-700">Add Dinner</span>
                    </label>
                  </div>
                </>
              )}
            </div>
            {services.length > 0 && (
              <div>
                <div>
                  <input
                    type="text"
                    placeholder="Filter services by name"
                    value={filter}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border rounded shadow-sm focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="max-h-40 overflow-y-auto space-y-2 border p-2 rounded">
                  {filteredServices.map((service) => {
                    const isSelected = newdata.selected_services.some(
                      (s) => s.service_id === service.service_id
                    );

                    const quantity =
                      newdata.selected_services.find(
                        (s) => s.service_id === service.service_id
                      )?.quantity || 1;

                    return (
                      <div
                        key={service.service_id}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          className="h-5 w-5 rounded border-gray-300 focus:ring-green-500"
                          checked={isSelected}
                          onChange={(e) =>
                            handleServiceSelection(
                              service,
                              e.target.checked,
                              quantity
                            )
                          }
                        />
                        <span className="text-sm text-gray-700">
                          {service.service_name} (₹{service.service_price} per
                          unit)
                        </span>
                        {isSelected && (
                          <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) =>
                              handleServiceSelection(
                                service,
                                true,
                                Number(e.target.value) || 1
                              )
                            }
                            className="w-16 px-2 py-1 border rounded"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 text-gray-800">
            <p className="text-sm">
              <span className="font-medium">Total: </span>₹{newdata.total}
            </p>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => showModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-300 rounded hover:bg-gray-400 focus:ring focus:ring-gray-400"
            >
              Close
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium text-white rounded focus:ring ${
                isConfirmEnabled
                  ? "bg-green-500 hover:bg-green-600 focus:ring-green-500"
                  : "bg-green-300 cursor-not-allowed"
              }`}
              onClick={() => handleEditing(newdata, booking.booking_id)}
              disabled={!isConfirmEnabled}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
