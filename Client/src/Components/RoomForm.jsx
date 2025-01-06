import React, { useEffect } from "react";

const RoomForm = ({
  isOpen,
  onClose,
  onSubmit,
  isEditing,
  initialValues,
  roomtypes,
}) => {
  const [formValues, setFormValues] = React.useState(initialValues);
  useEffect(() => {
    if (initialValues) {
      setFormValues(initialValues);
    }
  }, [initialValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formValues);
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormValues((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "file") {
      setFormValues((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{ zIndex: 1000, marginTop: "2rem" }}
    >
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isEditing ? "Edit Room" : "Add Room"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Roomtype Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Room Type</label>
            <select
              name="roomtype_id"
              value={formValues.roomtype_id || ""} // Ensure the initial value is handled for both adding and editing
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Select Room Type</option>
              {roomtypes.map((type) => (
                <option key={type.roomtype_id} value={type.roomtype_id}>
                  {`Name:${type.room_name} - Adults:${type.max_adults} - Persons:${type.max_persons}`}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Prices */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Retail Price
              </label>
              <input
                type="number"
                name="retail_price"
                value={formValues.retail_price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Selling Price
              </label>
              <input
                type="number"
                name="selling_price"
                value={formValues.selling_price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Meals Section */}
          <div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="meals_available"
                name="meals_available"
                checked={formValues.meals_available}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="meals_available" className="text-sm font-medium">
                Meals Available
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Veg Meals Price
                </label>
                <input
                  type="number"
                  name="veg_meals_price"
                  value={formValues.veg_meals_price}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Non-Veg Meals Price
                </label>
                <input
                  type="number"
                  name="non_veg_meals_price"
                  value={formValues.non_veg_meals_price}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Number of Rooms */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Number of Rooms
            </label>
            <input
              type="number"
              name="no_of_rooms"
              value={formValues.no_of_rooms}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Room Images */}
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num}>
                <label className="block text-sm font-medium mb-1">
                  Room Image {num}
                </label>
                <input
                  type="file"
                  name={`room_image_${num}`}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                  accept="image/*"
                  required={!isEditing}
                />
              </div>
            ))}
          </div>

          {/* State Radio Buttons */}
          <div>
            <label className="block text-sm font-medium mb-2">State</label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="active"
                  name="state"
                  value="active"
                  checked={formValues.state === "active"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="active" className="text-sm">
                  Active
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="inactive"
                  name="state"
                  value="inactive"
                  checked={formValues.state === "inactive"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="inactive" className="text-sm">
                  Inactive
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isEditing ? "Update Room" : "Add Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomForm;
