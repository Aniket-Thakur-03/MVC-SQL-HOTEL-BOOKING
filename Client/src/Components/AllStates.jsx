import { useEffect, useState } from "react";
import axios from "axios";
import CustomAlert from "./Notification/CustomAlert";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const AllStates = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [errors, setErrors] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    state_code: "",
    state_name: "",
    isActive: false,
  });
  const locationId = jwtDecode(localStorage.getItem("token")).location_id;
  const adminId = jwtDecode(localStorage.getItem("token")).admin_id;
  const [editStateId, setEditStateId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const triggerAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  // Fetch countries for dropdown
  async function fetchCountries() {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/country/get",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setCountries(response.data.countries);
        setErrors("");
      } else {
        setCountries([]);
      }
    } catch (error) {
      setErrors(`${error.response?.data.message || error.message}`);
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
    } finally {
      setLoading(false);
    }
  }

  // Fetch states for selected country
  async function fetchStates(countryId) {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/state/get/${countryId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setStates(response.data.states);
        setErrors("");
      } else {
        setStates([]);
      }
    } catch (error) {
      setErrors(`${error.response?.data.message || error.message}`);
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCountries();
    (async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/preference/search/feature/access/v1/admin",
          {
            feature_id: 7,
            admin_id: adminId,
            location_id: locationId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status == 200) {
          return;
        }
      } catch (error) {
        navigate("/unauthorized", { replace: true });
        return;
      }
    })();
  }, []);

  // Handle input change for form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle save for adding or editing
  const handleSave = async () => {
    try {
      setLoading(true);
      if (isAdding) {
        // Add State
        const response = await axios.post(
          "http://localhost:8000/api/state/create/state",
          { ...formValues, country_id: selectedCountryId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status == 200) {
          triggerAlert(`${response.data.message}`, "success");
          fetchStates(selectedCountryId);
        }
        setIsAdding(false);
      } else if (isEditing) {
        // Edit State
        const response = await axios.patch(
          `http://localhost:8000/api/state/edit/state/${editStateId}`,
          formValues,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status == 200) {
          triggerAlert(`${response.data.message}`, "success");
          fetchStates(selectedCountryId);
        }
        setIsEditing(false);
      }
      setFormValues({ state_code: "", state_name: "", isActive: false });
    } catch (error) {
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
      setErrors(`${error.response?.data.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All States and UTs</h1>

      {/* Country Selection Dropdown */}
      <select
        className="mb-4 px-4 py-2 border rounded w-full"
        onChange={(e) => {
          const countryId = e.target.value;
          setSelectedCountryId(countryId);
          if (countryId) {
            fetchStates(countryId);
          } else {
            setStates([]);
          }
        }}
        value={selectedCountryId || ""}
      >
        <option value="" disabled>
          Select a country
        </option>
        {countries.map((country) => (
          <option key={country.country_id} value={country.country_id}>
            {country.country_name}({country.country_iso_code})
          </option>
        ))}
      </select>

      {/* States Table */}
      {selectedCountryId && (
        <>
          <button
            onClick={() => {
              setFormValues({
                state_code: "",
                state_name: "",
                isActive: false,
              });
              setIsAdding(true);
            }}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add State
          </button>

          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">Code</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Active</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {states.map((state) => (
                <tr key={state.state_id} className="text-center">
                  <td className="px-4 py-2 border">{state.state_code}</td>
                  <td className="px-4 py-2 border">{state.state_name}</td>
                  <td
                    className={`px-4 py-2 border text-white ${
                      state.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {state.isActive ? "Active" : "InActive"}
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => {
                        setFormValues({
                          state_code: state.state_code,
                          state_name: state.state_name,
                          isActive: state.isActive,
                        });
                        setEditStateId(state.state_id);
                        setIsEditing(true);
                      }}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Add/Edit Form */}
      {(isAdding || isEditing) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isAdding ? "Add State" : "Edit State"}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  State Code:
                </label>
                <input
                  type="text"
                  name="state_code"
                  value={formValues.state_code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  State Name:
                </label>
                <input
                  type="text"
                  name="state_name"
                  value={formValues.state_name}
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
                    state_code: "",
                    state_name: "",
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
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="animate-spin h-16 w-16 border-t-4 border-b-4 border-white rounded-full"></div>
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
};
