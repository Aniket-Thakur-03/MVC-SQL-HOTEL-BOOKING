import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ResetPassword() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uid, setUId] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();

  const verifyUser = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/users/forget/password/${id}`
      );
      if (response.status == 200) {
        setStatus("success");
        setMessage(response.data.message);
        setUId(response.data.id);
      }
    } catch (error) {
      setStatus("error");
      setMessage(error.response?.data.message || error.message);
    }
  };

  useEffect(() => {
    if (!id) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }
    verifyUser(id);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {status === "loading" && (
        <p className="text-lg font-semibold text-blue-500">
          Verifying your email...
        </p>
      )}
      {status === "success" && (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Email Verified!
          </h2>
          <p className="text-gray-700 mb-6">{message}</p>
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-2"
          >
            Please type your new password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          <button
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            onClick={async (e) => {
              e.preventDefault();
              try {
                setLoading(true);
                const response = await axios.post(
                  "http://localhost:8000/api/users/forget/password",
                  {
                    password: password,
                    id: uid,
                  }
                );
                if (response.status == 200) {
                  navigate("/login");
                  setError("");
                }
              } catch (error) {
                setError(`${error.response?.data.message || error.message}`);
              } finally {
                setLoading(false);
              }
            }}
          >
            Update Password
          </button>
        </div>
      )}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="animate-spin h-16 w-16 border-t-4 border-b-4 border-white rounded-full"></div>
        </div>
      )}
      {status === "error" && (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            ❌ Verification Failed
          </h2>
          <p className="text-gray-700">{message}</p>
        </div>
      )}
    </div>
  );
}

export default ResetPassword;
