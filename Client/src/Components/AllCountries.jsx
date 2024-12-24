import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
export const AllCountries = () => {
  const [countries, setCountries] = useState([]);
  const [errors, setErrors] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    country_iso_code: "",
    country_name: "",
    isActive: false,
  });
  const [editCountryId, setEditCountryId] = useState(null);
  const locationId = jwtDecode(localStorage.getItem("token")).location_id;
  const adminId = jwtDecode(localStorage.getItem("token")).admin_id;
  const navigate = useNavigate();

  // Fetch countries
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

  useEffect(() => {
    fetchCountries();
    (async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/preference/search/feature/access/v1/admin",
          {
            feature_id: 6,
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
      if (isAdding) {
        // Add Country
        await axios.post(
          "http://localhost:8000/api/country/create/country",
          formValues,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        fetchCountries();
        setIsAdding(false);
      } else if (isEditing) {
        // Edit Country
        await axios.patch(
          `http://localhost:8000/api/country/edit/country/${editCountryId}`,
          formValues,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        fetchCountries();
        setIsEditing(false);
      }
      setFormValues({
        country_iso_code: "",
        country_name: "",
        isActive: false,
      });
    } catch (error) {
      setErrors(`${error.response?.data.message || error.message}`);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Countries</h1>

      {/* Add Country Button */}
      <button
        onClick={() => {
          setFormValues({
            country_iso_code: "",
            country_name: "",
            isActive: false,
          });
          setIsAdding(true);
        }}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Country
      </button>

      {/* Countries Table */}
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">ISO Code</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">State</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country) => (
            <tr key={country.country_id} className="text-center">
              <td className="px-4 py-2 border">{country.country_id}</td>
              <td className="px-4 py-2 border">{country.country_iso_code}</td>
              <td className="px-4 py-2 border">{country.country_name}</td>
              <td
                className={`px-4 py-2 border text-white ${
                  country.isActive ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {country.isActive ? "Active" : "Inactive"}
              </td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => {
                    setFormValues({
                      country_iso_code: country.country_iso_code,
                      country_name: country.country_name,
                      isActive: country.isActive,
                    });
                    setEditCountryId(country.country_id);
                    setIsEditing(true);
                  }}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Form */}
      {(isAdding || isEditing) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isAdding ? "Add Country" : "Edit Country"}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  ISO Code:
                </label>
                <input
                  type="text"
                  name="country_iso_code"
                  value={formValues.country_iso_code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name:</label>
                <input
                  type="text"
                  name="country_name"
                  value={formValues.country_name}
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
                    country_iso_code: "",
                    country_name: "",
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
    </div>
  );
};
