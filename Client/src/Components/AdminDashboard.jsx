import React, { useState } from "react";
import AllCheckins from "./AllCheckins";
import AllCheckouts from "./AllCheckouts";
import UpdatePayment from "./UpdatePayment";
import AllBookings from "./AllBookings";
import UpdateRoom from "./UpdateRoom";
import { AllCountries } from "./AllCountries";
import { AllStates } from "./AllStates";
import { AllCities } from "./AllCities";

export default function AdminDashboard() {
  const [activeOption, setActiveOption] = useState("check-ins");

  const options = [
    { name: "All Bookings", value: "all-bookings" },
    { name: "Check-ins", value: "check-ins" },
    { name: "Check-outs", value: "check-outs" },
    { name: "Update Payment Status", value: "update-payment-status" },
    { name: "Rooms", value: "update-rooms" },
    { name: "Countries", value: "update-countries" },
    { name: "States & UTs", value: "update-states" },
    { name: "Citites", value: "update-cities" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg border-r">
        <div className="p-6">
          <h2 className="text-primary font-semibold text-xl uppercase tracking-wide">
            Admin Panel
          </h2>
        </div>
        <nav className="flex flex-col gap-y-2 px-4">
          {options.map((option) => (
            <button
              key={option.value}
              className={`py-2 px-4 text-left rounded transition ${
                activeOption === option.value
                  ? "bg-accent text-white"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveOption(option.value)}
            >
              {option.name}
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-primary mb-6">
          {activeOption === "check-ins"
            ? "Check-ins"
            : activeOption === "check-outs"
            ? "Check-outs"
            : activeOption === "update-payment-status"
            ? "Update Payment Status"
            : activeOption === "update-rooms"
            ? "Rooms"
            : activeOption === "update-countries"
            ? "Countries"
            : activeOption === "update-states"
            ? "States & UTs"
            : activeOption === "update-cities"
            ? "Cities"
            : "All Bookings"}
        </h1>
        <div className="bg-white p-6 rounded shadow-lg">
          {activeOption === "all-bookings" && (
            <>
              <p>
                Manage all the Bookings here. You can view and update records.
              </p>
              <AllBookings />
            </>
          )}
          {activeOption === "check-ins" && (
            <>
              <p>
                Manage all the check-ins here. You can view and update records.
              </p>
              <AllCheckins />
            </>
          )}
          {activeOption === "check-outs" && (
            <>
              <p>
                Manage all the check-outs here. You can view and finalize
                records.
              </p>
              <AllCheckouts />
            </>
          )}
          {activeOption === "update-payment-status" && (
            <>
              <p>
                Update the payment status of bookings here. Ensure the payment
                details are accurate.
              </p>
              <UpdatePayment />
            </>
          )}
          {activeOption === "update-rooms" && (
            <>
              <p>Update the rooms here.</p>
              <UpdateRoom />
            </>
          )}
          {activeOption === "update-countries" && (
            <>
              <AllCountries />
            </>
          )}
          {activeOption === "update-states" && (
            <>
              <AllStates />
            </>
          )}
          {activeOption === "update-cities" && (
            <>
              <AllCities />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
