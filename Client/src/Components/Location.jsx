import React, { useState, useEffect } from "react";
import CustomAlert from "./Notification/CustomAlert";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
function Locations() {
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [locationId, setLocationId] = useState("");
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    locationname: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    phoneno: "",
    isActive: false,
  });
  const currentlocationId = jwtDecode(
    localStorage.getItem("token")
  ).location_id;
  const currentadminId = jwtDecode(localStorage.getItem("token")).admin_id;
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const triggerAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };
  const fetchLocations = async () => {
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
        setError("");
      }
    } catch (error) {
      setError(`${error.response?.data.message || error.message}`);
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (isAdding) {
        await axios.post(
          "http://localhost:8000/api/location/create/location",
          { loactionData: formValues },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        fetchLocations();
        setIsAdding(false);
      } else if (isEditing) {
        await axios.patch(
          `http://localhost:8000/api/location/edit/location/${locationId}`,
          formValues,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        fetchLocations();
        setIsEditing(false);
      }
      setFormValues({
        locationname: "",
        address: "",
        country: "",
        state: "",
        city: "",
        pincode: "",
        phoneno: "",
        isActive: false,
      });
    } catch (error) {
      setError(`${error.response?.data.message || error.message}`);
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  useEffect(() => {
    fetchLocations();
    const fetchPreferences = async () => {
      try {
        console.log({ currentadminId, currentlocationId });
        const response = await axios.post(
          "http://localhost:8000/api/preference/search/feature/access/v1/admin",
          {
            feature_id: 11,
            admin_id: currentadminId,
            location_id: currentlocationId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          return; // Do nothing if authorized
        }
      } catch (error) {
        navigate("/unauthorized", { replace: true });
      }
    };
    fetchPreferences(); // Properly invoking the function
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Locations</h1>
      <button
        onClick={() => {
          setFormValues({
            locationname: "",
            address: "",
            country: "",
            state: "",
            city: "",
            pincode: "",
            phoneno: "",
            isActive: false,
          });
          setIsAdding(true);
        }}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Location
      </button>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">
                Location Name
              </th>
              <th className="border border-gray-300 px-4 py-2">Address</th>
              <th className="border border-gray-300 px-4 py-2">Country</th>
              <th className="border border-gray-300 px-4 py-2">State</th>
              <th className="border border-gray-300 px-4 py-2">City</th>
              <th className="border border-gray-300 px-4 py-2">Pincode</th>
              <th className="border border-gray-300 px-4 py-2">Phoneno</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => (
              <tr key={location.location_id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {location.location_id}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {location.location_name}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {location.address}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {location.country}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {location.state}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {location.city}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {location.pincode}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {location.phoneno}
                </td>
                <td
                  className={`border border-gray-300 text-white px-4 py-2 ${
                    location.isActive ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {location.isActive ? "Active" : "Inactive"}
                </td>
                <td className="border border-gray-300 px-8 flex py-4">
                  <button
                    onClick={() => {
                      setFormValues({
                        locationname: location.location_name,
                        address: location.address,
                        country: location.country,
                        state: location.state,
                        city: location.city,
                        pincode: location.pincode,
                        phoneno: location.phoneno,
                        isActive: location.isActive,
                      });
                      setLocationId(location.location_id);
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
      {(isAdding || isEditing) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {isAdding ? "Add Location" : "Edit Location"}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Location Name:
                </label>
                <input
                  type="text"
                  name="locationname"
                  value={formValues.locationname}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Address:
                </label>
                <input
                  type="text"
                  name="address"
                  value={formValues.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Country:
                </label>
                <input
                  type="text"
                  name="country"
                  value={formValues.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State:</label>
                <input
                  type="text"
                  name="state"
                  value={formValues.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City:</label>
                <input
                  type="text"
                  name="city"
                  value={formValues.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Pincode:
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formValues.pincode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phoneno:
                </label>
                <input
                  type="text"
                  name="phoneno"
                  value={formValues.phoneno}
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
                  name="isActive"
                  checked={formValues.isActive}
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
                    locationname: "",
                    address: "",
                    country: "",
                    state: "",
                    city: "",
                    pincode: "",
                    phoneno: "",
                    isActive: false,
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
}

export { Locations };
