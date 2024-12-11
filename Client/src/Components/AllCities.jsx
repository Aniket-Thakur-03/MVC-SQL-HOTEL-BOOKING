import { useEffect, useState } from "react";
import axios from "axios";

export const AllCities = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [errors, setErrors] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    city_name: "",
    city_std_code: "",
    isActive: false,
  });
  const [editCityId, setEditCityId] = useState(null);

  // Fetch countries for dropdown
  async function fetchCountries() {
    try {
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
    }
  }

  // Fetch states for selected country
  async function fetchStates(countryId) {
    try {
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
    }
  }

  // Fetch cities for selected state
  async function fetchCities(stateId) {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/city/get/${stateId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setCities(response.data.cities);
        setErrors("");
      } else {
        setCities([]);
      }
    } catch (error) {
      setErrors(`${error.response?.data.message || error.message}`);
    }
  }

  useEffect(() => {
    fetchCountries();
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
      if (isAdding) {
        // Add City
        await axios.post(
          "http://localhost:8000/api/city/create/city",
          { ...formValues, state_id: selectedStateId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        fetchCities(selectedStateId);
        setIsAdding(false);
      } else if (isEditing) {
        // Edit City
        await axios.patch(
          `http://localhost:8000/api/city/edit/city/${editCityId}`,
          formValues,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        fetchCities(selectedStateId);
        setIsEditing(false);
      }
      setFormValues({ city_name: "", city_std_code: "", isActive: false });
    } catch (error) {
      setErrors(`${error.response?.data.message || error.message}`);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Cities</h1>
      {errors && <p className="text-red-500">{errors}</p>}

      {/* Country Selection Dropdown */}
      <select
        className="mb-4 px-4 py-2 border rounded w-full"
        onChange={(e) => {
          const countryId = e.target.value;
          setSelectedCountryId(countryId);
          setSelectedStateId(null);
          setCities([]);
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

      {/* State Selection Dropdown */}
      {selectedCountryId && (
        <select
          className="mb-4 px-4 py-2 border rounded w-full"
          onChange={(e) => {
            const stateId = e.target.value;
            setSelectedStateId(stateId);
            if (stateId) {
              fetchCities(stateId);
            } else {
              setCities([]);
            }
          }}
          value={selectedStateId || ""}
        >
          <option value="" disabled>
            Select a State & UTs'
          </option>
          {states.map((state) => (
            <option key={state.state_id} value={state.state_id}>
              {state.state_name}({state.state_code})
            </option>
          ))}
        </select>
      )}

      {/* Cities Table */}
      {selectedStateId && (
        <>
          <button
            onClick={() => {
              setFormValues({
                city_name: "",
                city_std_code: "",
                isActive: false,
              });
              setIsAdding(true);
            }}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add City
          </button>

          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">STD Code</th>
                <th className="px-4 py-2 border">Active</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city) => (
                <tr key={city.city_id} className="text-center">
                  <td className="px-4 py-2 border">{city.city_name}</td>
                  <td className="px-4 py-2 border">{city.city_std_code}</td>
                  <td
                    className={`px-4 py-2 border text-white ${
                      city.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {city.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => {
                        setFormValues({
                          city_name: city.city_name,
                          city_std_code: city.city_std_code,
                          isActive: city.isActive,
                        });
                        setEditCityId(city.city_id);
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
              {isAdding ? "Add City" : "Edit City"}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  City Name:
                </label>
                <input
                  type="text"
                  name="city_name"
                  value={formValues.city_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  STD Code:
                </label>
                <input
                  type="text"
                  name="city_std_code"
                  value={formValues.city_std_code}
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
                  className="w-4 h-4"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setIsEditing(false);
                    setFormValues({
                      city_name: "",
                      city_std_code: "",
                      isActive: false,
                    });
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
