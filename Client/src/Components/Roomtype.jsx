import axios from "axios";
import { useEffect, useState } from "react";
import CustomAlert from "./Notification/CustomAlert";

export const Roomtype = () => {
  const token = localStorage.getItem("token");
  const [roomtypes, setRoomtypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    room_name: "",
    max_adults: 0,
    max_persons: 0,
    isactive: false,
  });
  const [editRoomtypeId, setEditRoomtypeId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const triggerAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };
  async function fetchRoomtypes() {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/rooms/type/get/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        setRoomtypes(response.data.roomtypes);
      }
    } catch (error) {
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
      setRoomtypes([]);
    } finally {
      setLoading(false);
    }
  }
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  async function handleSave() {
    try {
      setLoading(true);
      if (isAdding) {
        const response = await axios.post(
          "http://localhost:8000/api/rooms/type/create/type",
          formValues,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status == 200) {
          triggerAlert(`${response.data.message}`, "success");
          setIsAdding(false);
          fetchRoomtypes();
        }
      }
      if (isEditing) {
        const response = await axios.patch(
          `http://localhost:8000/api/rooms/type/edit/room/type/${editRoomtypeId}`,
          formValues,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status == 200) {
          triggerAlert(`${response.data.message}`, "success");
          setIsEditing(false);
          fetchRoomtypes();
        }
      }
    } catch (error) {
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchRoomtypes();
  }, []);
  return (
    <div>
      <button
        onClick={() => setIsAdding(true)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Room Type
      </button>
      <div className="max-w-4xl mx-auto">
        <div className="border rounded-lg shadow bg-white">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 py-3.5 px-4 text-center text-sm font-semibold w-1/4">
                      Room Name
                    </th>
                    <th className="border border-gray-300 py-3.5 px-4 text-center text-sm font-semibold w-1/6">
                      Max Adults
                    </th>
                    <th className="border border-gray-300 py-3.5 px-4 text-center text-sm font-semibold w-1/6">
                      Max Persons
                    </th>
                    <th className="border border-gray-300 py-3.5 px-4 text-center text-sm font-semibold w-1/6">
                      State
                    </th>
                    <th className="border border-gray-300 py-3.5 px-4 text-center text-sm font-semibold w-1/6">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {roomtypes.map((roomtype) => (
                    <tr key={roomtype.roomtype_id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 py-4 px-4 text-sm text-center">
                        {roomtype.room_name}
                      </td>
                      <td className="border border-gray-300 py-4 px-4 text-sm text-center">
                        {roomtype.max_adults}
                      </td>
                      <td className="border border-gray-300 py-4 px-4 text-sm text-center">
                        {roomtype.max_persons}
                      </td>
                      <td className="border border-gray-300 py-4 px-4 text-sm text-center">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            roomtype.isactive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {roomtype.isactive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="border border-gray-300 py-4 px-4 text-sm flex justify-center">
                        <button
                          onClick={() => {
                            setFormValues({
                              room_name: roomtype.room_name,
                              max_adults: roomtype.max_adults,
                              max_persons: roomtype.max_persons,
                              isactive: roomtype.isactive,
                            });
                            setEditRoomtypeId(roomtype.roomtype_id);
                            setIsEditing(true);
                          }}
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
          </div>
        </div>
      </div>
      {(isAdding || isEditing) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isAdding ? "Add Room Type" : "Edit Room Type"}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Room Name:
                </label>
                <input
                  type="text"
                  name="room_name"
                  value={formValues.room_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Max Adults:
                </label>
                <input
                  type="number"
                  name="max_adults"
                  value={formValues.max_adults}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Max Persons:
                </label>
                <input
                  type="number"
                  name="max_persons"
                  value={formValues.max_persons}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Active:
                </label>
                <input
                  type="checkbox"
                  name="isactive"
                  checked={formValues.isactive}
                  onChange={handleInputChange}
                  className="h-5 w-5"
                />
              </div>
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
                  setIsAdding(false);
                  setIsEditing(false);
                  setFormValues({
                    room_name: "",
                    max_adults: 0,
                    max_persons: 0,
                    isactive: false,
                  });
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
};
