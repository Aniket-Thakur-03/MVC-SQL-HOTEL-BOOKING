import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
export const ExtraServices = () => {
  const [services, setServices] = useState([]);
  const [errors, setErrors] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    service_name: "",
    service_price: 0,
    gst_rate: 0,
    isactive: false,
  });
  const [editServiceId, setEditServiceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectLocationId, setSelectLocationId] = useState(null);
  const locationId = jwtDecode(localStorage.getItem("token")).location_id;
  const adminId = jwtDecode(localStorage.getItem("token")).admin_id;
  const issuper = jwtDecode(localStorage.getItem("token")).issuper;
  const [showServices, setShowServices] = useState(true);
  const navigate = useNavigate();
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
  async function fetchServices(location) {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/extra/get/all/extra/services/${
          location || selectLocationId
        }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setServices(response.data.services);
        setErrors("");
        setShowServices(true);
      } else {
        setShowServices(true);
        setServices([]);
      }
    } catch (error) {
      setErrors(`${error.response?.data.message || error.message}`);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/preference/search/feature/access/v1/admin",
          {
            feature_id: 13,
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
    if (issuper) {
      setShowServices(false);
      fetchLocations();
    } else {
      fetchServices(locationId);
    }
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
    console.log("add", formValues);
    try {
      const updatedFormValues = {
        ...formValues,
        service_price: Number(formValues.service_price),
        locationId: locationId || selectLocationId, // Include locationId explicitly
      };
      if (isAdding) {
        // Add Country
        await axios.post(
          "http://localhost:8000/api/extra/create/extra/services",
          updatedFormValues,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        fetchServices(locationId);
        setIsAdding(false);
      } else if (isEditing) {
        // Edit Country
        await axios.patch(
          `http://localhost:8000/api/extra/update/extra/services/${editServiceId}`,
          updatedFormValues,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        fetchServices(locationId);
        setIsEditing(false);
      }
      setFormValues({
        service_name: "",
        service_price: 0,
        gst_rate: 0,
        isactive: false,
      });
    } catch (error) {
      console.log(error);
      setErrors(`${error.response?.data.message || error.message}`);
    }
  };
  const handleLocationChange = (e) => {
    const selectedValue = e.target.value ? parseInt(e.target.value, 10) : null;
    setSelectLocationId(selectedValue);
    console.log(selectedValue);
    if (selectedValue) {
      fetchServices(selectedValue);
      // Fetch rooms for the selected location
    } else {
      setServices([]); // Clear rooms if no location is selected
    }
  };

  return (
    <div className="p-4">
      {issuper ? (
        <div>
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
      {showServices ? (
        <div>
          <button
            onClick={() => {
              setFormValues({
                service_name: "",
                service_price: 0,
                gst_rate: 0,
                isactive: false,
              });
              setIsAdding(true);
            }}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Extra Service
          </button>

          {/* Countries Table */}
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Price</th>
                <th className="px-4 py-2 border">GST</th>
                <th className="px-4 py-2 border">State</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.service_id} className="text-center">
                  <td className="px-4 py-2 border">{service.service_id}</td>
                  <td className="px-4 py-2 border">{service.service_name}</td>
                  <td className="px-4 py-2 border">{service.service_price}</td>
                  <td className="px-4 py-2 border">{service.gst_rate}</td>
                  <td
                    className={`px-4 py-2 border text-white ${
                      service.isactive ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {service.isactive ? "Active" : "Inactive"}
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => {
                        setFormValues({
                          service_name: service.service_name,
                          service_price: service.service_price,
                          gst_rate: service.gst_rate,
                          isactive: service.isactive,
                        });
                        setEditServiceId(service.service_id);
                        setSelectLocationId(service.location_id);
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
        </div>
      ) : null}

      {/* Add/Edit Form */}
      {(isAdding || isEditing) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isAdding ? "Add Extra Service" : "Edit Extra Service"}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name:</label>
                <input
                  type="text"
                  name="service_name"
                  value={formValues.service_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price:</label>
                <input
                  type="number"
                  name="service_price"
                  value={formValues.service_price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{`GST(in %):`}</label>
                <input
                  type="number"
                  name="gst_rate"
                  value={formValues.gst_rate}
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
                  setEditServiceId(null);
                  setIsAdding(false);
                  setIsEditing(false);
                  setFormValues({
                    service_name: "",
                    service_price: 0,
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
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="animate-spin h-16 w-16 border-t-4 border-b-4 border-white rounded-full"></div>
        </div>
      )}
    </div>
  );
};
