import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomAlert from "../Notification/CustomAlert";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
function AdminControl() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const locationId = jwtDecode(token).location_id;
  const adminId = jwtDecode(token).admin_id;
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState([]);
  const [allpreferences, setAllPreferences] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [selectEditAdminId, setSelectEditAdminId] = useState(null);
  const [selectEditLocationId, setSelectEditLocationId] = useState(null);
  const [selectPreference, setSelectPreference] = useState([]);
  const [editIsActive, setEditIsActive] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const triggerAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };
  async function fetchFeatures() {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/feature/get",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        setFeatures(response.data.features);
        console.log(response.data.features);
      }
    } catch (error) {
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
    } finally {
      setLoading(false);
    }
  }
  async function fetchAllPreferences() {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/preference/get/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        setAllPreferences(response.data.preferences);
      }
    } catch (error) {
      triggerAlert(`${error.response?.data.message || error.message}`);
    } finally {
      setLoading(false);
    }
  }
  async function fetchAdmins() {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/users/admin/get",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        setAdmins(response.data.admins);
      } else {
        setAdmins([]);
      }
    } catch (error) {
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
    } finally {
      setLoading(false);
    }
  }
  async function fetchLocations() {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/location/get/admin/location",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        setLocations(response.data.locations);
      } else {
        setLocations([]);
      }
    } catch (error) {
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
    } finally {
      setLoading(false);
    }
  }
  async function handleAssign() {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/preference/assign/location",
        { admin_id: selectedAdminId, location_id: selectedLocationId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        triggerAlert(`${response.data.message}`, "success");
        fetchAllPreferences();
      }
    } catch (error) {
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
    } finally {
      setLoading(false);
    }
  }
  async function handleCheck(aid, lid) {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/users/admin/check/location",
        { location_id: lid, admin_id: aid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        return true;
      }
    } catch (error) {
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
      return false;
    } finally {
      setLoading(false);
    }
  }
  async function handleEdit(editData) {
    // console.log(editData);
    try {
      setLoading(true);
      const response = await axios.patch(
        "http://localhost:8000/api/preference/edit/admin/preference",
        { editData: editData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        triggerAlert(`${response.data.message}`, "success");
        fetchAllPreferences();
      }
    } catch (error) {
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
    } finally {
      setLoading(false);
    }
  }
  const [editData, setEditData] = useState({
    adminId: selectEditAdminId,
    locationId: selectEditLocationId,
    preference: selectPreference,
    isActive: editIsActive,
  });

  useEffect(() => {
    fetchFeatures();
    fetchAllPreferences();
    (async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/preference/search/feature/access/v1/admin",
          {
            feature_id: 10,
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
  return (
    <div className="max-w-full">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Control</h1>

        <button
          onClick={() => {
            setIsAdding(true);
            fetchAdmins();
            fetchLocations();
          }}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Assign Location to Admin
        </button>
        <div className="border rounded-lg shadow bg-white">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th
                      scope="col"
                      className="border border-gray-300 py-3.5 px-4 text-left text-sm font-semibold"
                    >
                      Admin Username
                    </th>
                    <th
                      scope="col"
                      className="border border-gray-300 py-3.5 px-4 text-left text-sm font-semibold"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="border border-gray-300 py-3.5 px-4 text-left text-sm font-semibold"
                    >
                      Location Assigned
                    </th>
                    {features.map((feature) => (
                      <th
                        scope="col"
                        className="border border-gray-300 py-3.5 px-4 text-left text-sm font-semibold"
                        key={feature.feature_id}
                      >
                        {feature.feature_name}
                      </th>
                    ))}
                    <th
                      scope="col"
                      className="border border-gray-300 py-3.5 px-4 text-left text-sm font-semibold"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allpreferences.map((allpreference) => (
                    <tr
                      key={allpreference.admin_id}
                      className="hover:bg-gray-50"
                    >
                      <td className="border border-gray-300 whitespace-nowrap py-4 px-4 text-sm">
                        {allpreference.admin_username}
                      </td>
                      <td className="border border-gray-300 whitespace-nowrap py-4 px-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            allpreference.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {allpreference.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="border border-gray-300 whitespace-nowrap py-4 px-4 text-sm">
                        {allpreference.location_assigned}
                      </td>
                      {features.map((feature) => (
                        <td
                          key={feature.feature_id}
                          className="border border-gray-300 whitespace-nowrap py-4 px-4 text-sm text-center"
                        >
                          {allpreference.preference.find(
                            (p) => p.feature_id === feature.feature_id
                          ) ? (
                            <input
                              type="checkbox"
                              checked={
                                allpreference.preference.find(
                                  (p) => p.feature_id === feature.feature_id
                                ).isgranted
                              }
                              className="h-5 w-5"
                              disabled
                            />
                          ) : (
                            <input
                              type="checkbox"
                              checked={false}
                              className="h-5 w-5"
                              disabled
                            />
                          )}
                        </td>
                      ))}
                      <td className="border border-gray-300 whitespace-nowrap py-4 px-4 text-sm">
                        <button
                          onClick={() => {
                            setEditData({
                              adminId: allpreference.admin_id,
                              locationId: allpreference.location_id,
                              preference: allpreference.preference,
                              isActive: allpreference.isActive,
                            });
                            setSelectEditAdminId(allpreference.admin_id);
                            setSelectEditLocationId(allpreference.location_id);
                            setSelectPreference(allpreference.preference);
                            setEditIsActive(allpreference.isActive);
                            const state = handleCheck(
                              allpreference.admin_id,
                              allpreference.location_id
                            );
                            if (state) {
                              fetchLocations();
                              fetchFeatures();
                              setIsEditing(true);
                            } else {
                              setSelectEditAdminId(null);
                              setSelectEditLocationId(null);
                              setSelectPreference([]);
                              setEditData({
                                adminId: selectEditAdminId,
                                locationId: selectEditLocationId,
                                preference: selectPreference,
                                isActive: editIsActive,
                              });
                            }
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
      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Assign Location to Admin</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Admin:
                </label>
                <select
                  className="mb-4 px-4 py-2 border rounded w-full"
                  onChange={(e) => {
                    const adminId = e.target.value;
                    setSelectedAdminId(adminId);
                  }}
                  value={selectedAdminId || ""}
                >
                  <option value="" disabled>
                    Select Admin
                  </option>
                  {admins.map((admin) => (
                    <option key={admin.admin_id} value={admin.admin_id}>
                      {`${admin.admin_username}(${admin.full_name})`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Location:
                </label>
                <select
                  className="mb-4 px-4 py-2 border rounded w-full"
                  onChange={(e) => {
                    const locationId = e.target.value;
                    setSelectedLocationId(locationId);
                  }}
                  value={selectedLocationId || ""}
                >
                  <option value="" disabled>
                    Select location
                  </option>
                  {locations.map((location) => (
                    <option
                      key={location.location_id}
                      value={location.location_id}
                    >
                      {`${location.location_name}-${location.city}(${location.pincode})`}
                    </option>
                  ))}
                </select>
              </div>
            </form>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={handleAssign}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setSelectedAdminId(null);
                  setSelectedLocationId(null);
                  setAdmins([]);
                  setLocations([]);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl mx-auto my-4">
            <div className="p-6">
              <div className="space-y-6">
                {/* Header */}
                <div className="border-b pb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Edit Feature Permissions and Status
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Admin: {editData.adminId}
                  </p>
                </div>

                {/* Form Content */}
                <form className="space-y-6">
                  {/* Location Select */}
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Location
                    </label>
                    <select
                      id="location"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      value={editData.locationId}
                      disabled={true}
                    >
                      {locations.map((location) => (
                        <option
                          key={location.location_id}
                          value={location.location_id}
                          disabled={true}
                        >
                          {`${location.location_name}-${location.city}(${location.pincode})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Features Checkboxes */}
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Feature Permissions
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {features.map((feature) => {
                        const isGranted =
                          editData.preference.find(
                            (prefer) => prefer.feature_id === feature.feature_id
                          )?.isgranted || false;

                        return (
                          <div
                            key={feature.feature_id}
                            className="flex items-center space-x-3"
                          >
                            <input
                              type="checkbox"
                              id={`feature-${feature.feature_id}`}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              checked={isGranted}
                              onChange={(e) => {
                                setEditData((prev) => {
                                  const updatedPreferences =
                                    prev.preference.map((prefer) =>
                                      prefer.feature_id === feature.feature_id
                                        ? {
                                            ...prefer,
                                            isgranted: e.target.checked,
                                          }
                                        : prefer
                                    );

                                  if (
                                    !prev.preference.some(
                                      (prefer) =>
                                        prefer.feature_id === feature.feature_id
                                    )
                                  ) {
                                    updatedPreferences.push({
                                      feature_id: feature.feature_id,
                                      isgranted: e.target.checked,
                                    });
                                  }

                                  return {
                                    ...prev,
                                    preference: updatedPreferences,
                                  };
                                });
                              }}
                            />
                            <label
                              htmlFor={`feature-${feature.feature_id}`}
                              className="text-sm text-gray-700"
                            >
                              {feature.feature_name}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Status Radio Buttons */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Change State
                    </p>
                    <div className="flex space-x-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="state"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          checked={editData.isActive === true}
                          onChange={() =>
                            setEditData((prev) => ({ ...prev, isActive: true }))
                          }
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Active
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="state"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          checked={editData.isActive === false}
                          onChange={() =>
                            setEditData((prev) => ({
                              ...prev,
                              isActive: false,
                            }))
                          }
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Inactive
                        </span>
                      </label>
                    </div>
                  </div>
                </form>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleEdit(editData);
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
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

export { AdminControl };
