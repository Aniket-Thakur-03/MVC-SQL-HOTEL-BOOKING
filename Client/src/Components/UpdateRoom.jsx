import axios from "axios";
import { useEffect, useState } from "react";
import CustomAlert from "./Notification/CustomAlert";
import { Logs } from "lucide-react";

function UpdateRoom() {
  const [error, setError] = useState("");
  const [rooms, setRooms] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [loading, setLoading] = useState(false);

  const initialFormState = {
    room_id: "",
    room_name: "",
    retail_price: "",
    selling_price: "",
    max_adults: "",
    max_persons: "",
    veg_meals_price: "",
    non_veg_meals_price: "",
    no_of_rooms: "",
    meals_available: true,
    state: "inactive",
    room_image_small: null,
    room_image_large: null,
  };

  const triggerAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      alert("Please log in");
      window.location.href = "/";
    }
  }, [error]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/rooms/get", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200) {
        setRooms(response.data.rooms);
        setError("");
      }
    } catch (err) {
      setError(`${error.response?.data.message || error.message}`);
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleEdit = (room) => {
    setFormValues({ ...room, room_name: room.Roomtype.room_name }); // Reset the form to empty
    setIsEditing(true);
  };

  const handleSave = () => {
    const formData = new FormData();
    console.log("value", formValues);
    // Append all keys from formValues
    for (const key in formValues) {
      if (key === "room_image_small" || key === "room_image_large") {
        // If it's a file input, get the file from the input
        const fileInput = document.querySelector(`input[name="${key}"]`);
        if (fileInput && fileInput.files.length > 0) {
          formData.append(key, fileInput.files[0]); // Append file
        }
        // console.log();
      } else {
        // For other fields, append directly
        formData.append(key, formValues[key]);
      }
    }

    // Debug FormData
    console.log(formData);
    // Make API call
    if (isEditing) {
      axios
        .patch(
          `http://localhost:8000/api/rooms/update/room/${formValues.room_id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          console.log("Room updated:", response.data);
          setIsEditing(false);
          setFormValues(initialFormState);
          fetchRooms();
          triggerAlert(`${response.data.message}`, "success");
        })
        .catch((error) => {
          triggerAlert(
            `${error.response?.data.message || error.message}`,
            "error"
          );
          console.error("Error updating room:", error);
        });
    } else if (isAdding) {
      console.log("Add", formData);
      for (const fr in formData) {
        console.log(fr);
      }
      axios
        .post("http://localhost:8000/api/rooms/create/room", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          console.log("Room added:", response.data);
          setIsAdding(false);
          fetchRooms();
          setFormValues(initialFormState);
          triggerAlert(`${response.data.message}`, "success");
        })
        .catch((error) => {
          triggerAlert(
            `${error.response?.data.message || error.message}`,
            "error"
          );
          console.error("Error adding room:", error);
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Rooms</h1>
      <button
        onClick={() => {
          setIsAdding(true);
          setFormValues(initialFormState);
        }}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Room
      </button>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Room ID</th>
              <th className="border border-gray-300 px-4 py-2">Room Name</th>
              <th className="border border-gray-300 px-4 py-2">Retail Price</th>
              <th className="border border-gray-300 px-4 py-2">
                Selling Price
              </th>
              <th className="border border-gray-300 px-4 py-2">
                Veg Meal Price
              </th>
              <th className="border border-gray-300 px-4 py-2">
                Non-Veg Meal Price
              </th>
              <th className="border border-gray-300 px-4 py-2">
                Meals Available
              </th>
              <th className="border border-gray-300 px-4 py-2">Max Adults</th>
              <th className="border border-gray-300 px-4 py-2">Max Persons</th>
              <th className="border border-gray-300 px-4 py-2">No of Rooms</th>
              <th className="border border-gray-300 px-4 py-2">State</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.room_id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {room.room_id}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {room.Roomtype.room_name}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  ₹{room.retail_price}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  ₹{room.selling_price}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  ₹{room.veg_meals_price}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  ₹{room.non_veg_meals_price}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {room.meals_available ? "Yes" : "No"}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {room.max_adults}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {room.max_persons}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {room.no_of_rooms}
                </td>
                <td
                  className={`border border-gray-300 text-white px-4 py-2 ${
                    room.state == "active" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {room.state}
                </td>
                <td className="border border-gray-300 px-8 flex py-4">
                  <button
                    onClick={() => handleEdit(room)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(isEditing || isAdding) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">
              {isAdding ? "Add Room" : "Edit Room"}
            </h2>
            <form className="grid grid-cols-2 gap-4 md:grid-cols-1">
              {Object.keys(initialFormState).map((key) => {
                if (key === "room_id") {
                  // Skip the room_id field for the add form
                  if (isAdding) return null;
                  // Show room_id as read-only for the edit form
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium capitalize mb-2">
                        {key.replace(/_/g, " ")}:
                      </label>
                      <input
                        type="text"
                        name={key}
                        value={formValues[key] || ""}
                        readOnly
                        className="border border-gray-300 rounded px-3 py-2 w-full bg-gray-100 cursor-not-allowed focus:outline-none"
                      />
                    </div>
                  );
                }
                if (key === "meals_available") {
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium capitalize mb-2">
                        Meals Available:
                      </label>
                      <input
                        type="checkbox"
                        name={key}
                        checked={formValues[key]}
                        onChange={(e) =>
                          setFormValues((prev) => ({
                            ...prev,
                            [key]: e.target.checked,
                          }))
                        }
                        className="h-5 w-5"
                      />
                    </div>
                  );
                }
                if (key === "state") {
                  if (!isAdding) {
                    return (
                      <div key={key} className="col-span-2">
                        <label className="block text-sm font-medium capitalize mb-2">
                          State:
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="state"
                              value="active"
                              checked={formValues.state === "active"}
                              onChange={() =>
                                setFormValues((prev) => ({
                                  ...prev,
                                  state: "active",
                                }))
                              }
                            />
                            Active
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="state"
                              value="inactive"
                              checked={formValues.state === "inactive"}
                              onChange={() =>
                                setFormValues((prev) => ({
                                  ...prev,
                                  state: "inactive",
                                }))
                              }
                            />
                            Inactive
                          </label>
                        </div>
                      </div>
                    );
                  }
                  return null; // Skip "state" for the add form
                }
                if (key === "room_image_small" || key === "room_image_large") {
                  return (
                    <div key={key} className="col-span-2">
                      <label className="block text-sm font-medium capitalize mb-2">
                        {key.replace(/_/g, " ")}:
                      </label>
                      <input
                        type="file"
                        name={key}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  );
                }
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium capitalize mb-2">
                      {key.replace(/_/g, " ")}:
                    </label>
                    <input
                      type="text"
                      name={key}
                      value={formValues[key] || ""}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                );
              })}
            </form>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setIsAdding(false);
                  setFormValues(initialFormState);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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

export default UpdateRoom;
