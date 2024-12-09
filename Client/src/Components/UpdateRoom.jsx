import axios from "axios";
import { useEffect, useState } from "react";
import CustomAlert from "./Notification/CustomAlert";

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
    room_type: "",
    retail_price: "",
    selling_price: "",
    max_adults: "",
    max_persons: "",
    veg_meals_price: "",
    non_veg_meals_price: "",
    no_of_rooms: "",
    state: "",
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
      setError(`${err.response?.data.message || err.message}`);
      triggerAlert(`${err.response?.data.message || err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleEdit = (room) => {
    setFormValues({ ...room });
    setIsEditing(true);
  };

  const handleDelete = async (roomId) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:8000/api/rooms/delete/${roomId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        triggerAlert("Room deleted successfully", "success");
        fetchRooms();
      } catch (err) {
        triggerAlert(`${err.response?.data.message || err.message}`, "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const endpoint = isAdding
        ? "http://localhost:8000/api/rooms/add"
        : `http://localhost:8000/api/rooms/update/room/${formValues.room_id}`;
      const method = isAdding ? "post" : "patch";
      await axios[method](endpoint, formValues, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      triggerAlert(
        isAdding ? "Room added successfully" : "Room updated successfully",
        "success"
      );
      fetchRooms();
      setIsEditing(false);
      setIsAdding(false);
      setFormValues(initialFormState);
    } catch (err) {
      triggerAlert(`${err.response?.data.message || err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
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
              <th className="border border-gray-300 px-4 py-2">Room Type</th>
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
              <th className="border border-gray-300 px-4 py-2">No of Rooms</th>
              <th className="border border-gray-300 px-4 py-2">State</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.room_id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {room.room_id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {room.room_type}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ₹{room.retail_price}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ₹{room.selling_price}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ₹{room.veg_meals_price}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ₹{room.non_veg_meals_price}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {room.no_of_rooms}
                </td>
                <td
                  className={`border border-gray-300 text-white px-4 py-2 ${
                    room.state == "active" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {room.state}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleEdit(room)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(room.room_id)}
                    className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(isEditing || isAdding) && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          <h2 className="text-xl font-bold mb-4">
            {isAdding ? "Add Room" : "Edit Room"}
          </h2>
          <form className="space-y-4">
            {Object.keys(initialFormState).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium capitalize mb-1">
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
            ))}
          </form>
          <div className="mt-4">
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
              className="ml-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
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
    </div>
  );
}

export default UpdateRoom;
