import { jwtDecode } from "jwt-decode";
import { Roomtype } from "./Roomtype";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoomForm from "./RoomForm";
import CustomAlert from "./Notification/CustomAlert";

export const CreateEditRoom = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const locationId = jwtDecode(token).location_id;
  const adminId = jwtDecode(token).admin_id;
  const issuper = jwtDecode(token).issuper;
  const [showroom, setShowroom] = useState(true);
  const [locations, setLocations] = useState([]);
  const [selectLocationId, setSelectLocationId] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [roomtypes, setRoomtypes] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [loading, setLoading] = useState(false);
  const triggerAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };
  const initialFormState = {
    room_id: "",
    roomtype_id: "",
    retail_price: "",
    selling_price: "",
    veg_meals_price: "",
    non_veg_meals_price: "",
    no_of_rooms: "",
    meals_available: true,
    state: "inactive",
    room_image_small: null,
    room_image_large: null,
  };
  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);

      // Create FormData object for file uploads
      const submitData = new FormData();
      for (const key in formData) {
        if (formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      }
      submitData.append(
        "location_id",
        locationId ? locationId : Number(selectLocationId)
      );
      if (selectedRoom) {
        // Handle Edit
        const response = await axios.patch(
          `http://localhost:8000/api/rooms/update/room/${selectedRoom.room_id}`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200) {
          triggerAlert("Room updated successfully!", "success");
          fetchRooms(selectLocationId);
        }
      } else {
        // Handle Create
        const response = await axios.post(
          "http://localhost:8000/api/rooms/create/room",
          submitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200) {
          triggerAlert("Room created successfully!", "success");
          fetchRooms(selectLocationId);
        }
      }

      // Close form and refresh room list
      setIsFormOpen(false);
      setSelectedRoom(null);
      fetchRooms();
    } catch (error) {
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (room) => {
    console.log("Editing Room:", room);
    setSelectedRoom(room);
    setIsFormOpen(true);
    fetchRoomtypes();
  };
  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedRoom(null);
  };
  async function fetchLocations() {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/location/get/admin/location",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setLocations(response.data.locations);
      }
    } catch (error) {
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
    } finally {
      setLoading(false);
    }
  }
  async function fetchRoomtypes() {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/rooms/type/get/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        setRoomtypes(response.data.roomtypes);
      } else {
        setRoomtypes([]);
      }
    } catch (error) {
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
      setRoomtypes([]);
    } finally {
      setLoading(false);
    }
  }
  async function fetchRooms(location) {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/rooms/get/all/rooms/admin",
        { locationid: Number(location) || locationId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        setShowroom(true);
        setRooms(response.data.rooms);
      } else {
        setShowroom(false);
        setRooms([]);
      }
    } catch (error) {
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/preference/search/feature/access/v1/admin",
          {
            feature_id: 5,
            admin_id: adminId,
            location_id: locationId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status == 200) {
          return;
        }
      } catch (error) {
        alert("Error getting permisssion");
        navigate("/unauthorized", { replace: true });
      }
    })();
    if (issuper) {
      fetchLocations();
      setShowroom(false);
    } else {
      fetchRooms();
    }
  }, []);
  const handleLocationChange = (e) => {
    const selectedValue = e.target.value ? parseInt(e.target.value, 10) : null;
    setSelectLocationId(selectedValue);
    console.log(selectedValue);
    if (selectedValue) {
      fetchRooms(selectedValue);
      // Fetch rooms for the selected location
    } else {
      setRooms([]); // Clear rooms if no location is selected
    }
  };
  return (
    <div className="p-6">
      {issuper ? (
        <div>
          <Roomtype />
          <div>
            <label htmlFor="locationid">Select Location</label>
            <select
              className="mb-4 px-4 py-2 border rounded w-full"
              name="location"
              id="locationid"
              onChange={handleLocationChange}
              value={selectLocationId || ""}
            >
              <option value="">Select location</option>
              {locations.map((location) => (
                <option
                  key={location.location_id}
                  value={location.location_id.toString()}
                >
                  {`${location.location_name}-${location.city}(${location.pincode})`}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}
      {showroom ? (
        <div>
          {" "}
          <button
            onClick={() => {
              setIsFormOpen(true);
              fetchRoomtypes();
            }}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Room
          </button>
          <div className="border rounded-lg shadow bg-white">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th
                        scope="col"
                        className="border border-gray-300 py-3.5 px-4 text-center text-sm font-semibold"
                      >
                        Room Name
                      </th>
                      <th
                        scope="col"
                        className="border border-gray-300 py-3.5 px-4 text-center text-sm font-semibold"
                      >
                        Max Adults
                      </th>
                      <th
                        scope="col"
                        className="border border-gray-300 py-3.5 px-4 text-center text-sm font-semibold"
                      >
                        Max Persons
                      </th>
                      <th
                        scope="col"
                        className="border border-gray-300 py-3.5 px-4 text-center text-sm font-semibold"
                      >
                        Retail Price
                      </th>
                      <th
                        scope="col"
                        className="border border-gray-300 py-3.5 px-4 text-center text-sm font-semibold"
                      >
                        Selling Price
                      </th>
                      <th
                        scope="col"
                        className="border border-gray-300 py-3.5 px-4 text-center text-sm font-semibold"
                      >
                        Meals Available
                      </th>
                      <th
                        scope="col"
                        className="border border-gray-300 py-3.5 px-4 text-center text-sm font-semibold"
                      >
                        Veg Meals Price
                      </th>
                      <th
                        scope="col"
                        className="border border-gray-300 py-3.5 px-4 text-center text-sm font-semibold"
                      >
                        Non Veg Meals Price
                      </th>
                      <th
                        scope="col"
                        className="border border-gray-300 py-3.5 px-4 text-center text-sm font-semibold"
                      >
                        No of rooms
                      </th>
                      <th
                        scope="col"
                        className="border border-gray-300 py-3.5 px-4 text-center text-sm font-semibold"
                      >
                        State
                      </th>
                      <th
                        scope="col"
                        className="border border-gray-300 py-3.5 px-4 text-center text-sm font-semibold"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {rooms.map((room) => (
                      <tr key={room.room_id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 whitespace-nowrap py-4 px-4 text-sm">
                          {room.room_name}
                        </td>
                        <td className="border border-gray-300 whitespace-nowrap py-4 px-4 text-sm">
                          {room.max_adults}
                        </td>
                        <td className="border border-gray-300 whitespace-nowrap py-4 px-4 text-sm">
                          {room.max_persons}
                        </td>
                        <td className="border border-gray-300 whitespace-nowrap py-4 px-4 text-sm">
                          ₹{room.retail_price}
                        </td>
                        <td className="border border-gray-300 whitespace-nowrap py-4 px-4 text-sm">
                          ₹{room.selling_price}
                        </td>
                        <td className="border border-gray-300 whitespace-nowrap py-4 px-4 text-sm">
                          {room.meals_available ? "Yes" : "No"}
                        </td>
                        <td className="border border-gray-300 whitespace-nowrap py-4 px-4 text-sm">
                          ₹{room.veg_meals_price}
                        </td>
                        <td className="border border-gray-300 whitespace-nowrap py-4 px-4 text-sm">
                          ₹{room.non_veg_meals_price}
                        </td>
                        <td className="border border-gray-300 whitespace-nowrap py-4 px-4 text-sm">
                          {room.no_of_rooms}
                        </td>
                        <td className="border border-gray-300 whitespace-nowrap py-4 px-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              room.state === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {room.state}
                          </span>
                        </td>
                        <td className="border border-gray-300 whitespace-nowrap py-4 px-4 text-sm">
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
            </div>
          </div>
        </div>
      ) : null}

      <RoomForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        isEditing={!!selectedRoom}
        initialValues={selectedRoom || initialFormState}
        roomtypes={roomtypes}
      />
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
