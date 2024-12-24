import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
export default function AdminDashboard() {
  function getUserAdminLocation(token) {
    const decoded = jwtDecode(token);
    return { admin_id: decoded.admin_id, location_id: decoded.location_id };
  }
  const [options, setOptions] = useState([]);
  useEffect(() => {
    const la = getUserAdminLocation(localStorage.getItem("token"));
    async function fetchFeatures() {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/preference/feature/get/admin",
          la,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status == 200) {
          setOptions(response.data.features);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchFeatures();
  }, []);
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white shadow-lg border-r flex-shrink-0 min-h-full">
        <div className="p-6">
          <h2 className="text-primary font-semibold text-xl uppercase tracking-wide">
            Admin Panel
          </h2>
        </div>
        <nav className="flex flex-col gap-y-2 px-4">
          {options.map((option) => (
            <NavLink
              key={option.feature_id}
              to={`/admin/dashboard${option.feature_url}`}
              className={({ isActive }) =>
                `py-2 px-4 rounded text-gray-700 hover:bg-gray-200 ${
                  isActive ? "bg-gray-200 font-semibold text-primary" : ""
                }`
              }
            >
              {option.feature_name}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-100 overflow-x-auto">
        <div className="min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
