import { BadgeAlert } from "lucide-react";
import React from "react";

const CustomAlert = ({ message, type, onClose }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50 z-50">
      <div
        className={`p-6 rounded-md shadow-lg text-primary bg-white max-w-sm w-full`}
      >
        <div className="flex items-center space-x-4">
          <span className="text-2xl">
            <BadgeAlert />
          </span>
          <span
            className={`flex-1 ${
              type === "success" ? "text-green-500" : "text-red-500"
            } `}
          >
            {message}
          </span>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 ${
              type === "success"
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-red-500 text-white hover:bg-gray-700"
            } rounded-md `}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
