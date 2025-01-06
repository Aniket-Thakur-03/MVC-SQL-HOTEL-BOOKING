import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Features() {
  const token = localStorage.getItem("token");
  const issuper = jwtDecode(token).issuper;
  const navigate = useNavigate();
  const [features, setFeatures] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    feature_id: 0,
    feature_name: "",
    feature_url: "",
    isActive: false,
  });
  async function fetchFeatures() {
    try {
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
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (!issuper) {
      navigate("/unauthorized", { replace: true });
    } else {
      fetchFeatures();
    }
  }, []);
  return (
    <div className="p-4">
      <button
        onClick={() => {
          setFormValues({
            feature_name: "",
            feature_url: "",
            isActive: false,
          });
          setIsAdding(true);
        }}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Feature
      </button>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Feature Name</th>
            <th className="px-4 py-2 border">Feature URL</th>
            <th className="px-4 py-2 border">State</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature) => (
            <tr key={feature.feature_id} className="text-center">
              <td className="px-4 py-2 border">{feature.feature_id}</td>
              <td className="px-4 py-2 border">{feature.feature_name}</td>
              <td className="px-4 py-2 border">{feature.feature_url}</td>
              <td
                className={`px-4 py-2 border text-white ${
                  feature.isActive ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {feature.isActive ? "Active" : "Inactive"}
              </td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => {
                    setFormValues({
                      feature_id: feature.feature_id,
                      feature_name: feature.feature_name,
                      feature_url: feature.feature_url,
                      isActive: feature.isActive,
                    });
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
              {isAdding ? "Add Feature" : "Edit Feature"}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Feature Name:
                </label>
                <input
                  type="text"
                  name="feature_name"
                  value={formValues.feature_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Feature URL:
                </label>
                <input
                  type="text"
                  name="feature_url"
                  value={formValues.feature_url}
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
                    feature_id: 0,
                    feature_name: "",
                    feature_url: "",
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
}

export { Features };
