import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import CustomAlert from "./Notification/CustomAlert";
const resetSchema = z.object({
    password: z
    .string()
    .min(8, "Password must have at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[@$!%*?&#]/,
      "Password must contain at least one special character (@$!%*?&#)"
    ),
    repassword: z
    .string()
    .min(8, "Password must have at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[@$!%*?&#]/,
      "Password must contain at least one special character (@$!%*?&#)"
    ),
})
function ResetPassword() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uid, setUId] = useState(0);
  const { id } = useParams();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [alertCallback, setAlertCallback] = useState(null); 

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
  const triggerAlert = (message, type, callback = null) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertCallback(() => callback);
    setShowAlert(true);
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
          {typeof error ==="object" && error.password &&  <div className="text-red-500 text-sm mb-4">{error.password}</div>}
          <label
            htmlFor="re_password"
            className="block text-gray-700 font-medium mb-2"
          >
            Re-type your new password
          </label>
          <input
            type="password"
            name="re_password"
            id="re_password"
            placeholder="Re-type New Password"
            value={repassword}
            onChange={(e) => setRepassword(e.target.value)}
            className="w-full border rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {typeof error ==="object" && error.repassword &&  <div className="text-red-500 text-sm mb-4">{error.repassword}</div>}
          {(typeof error === "string"
          ) && <div className="text-red-500 text-sm mb-4">{error}</div>}
          <button
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            onClick={async (e) => {
              e.preventDefault();
              if(password === repassword){
                const formData = { password, repassword};
                const validation = resetSchema.safeParse(formData);
                if(validation.success){
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
                      triggerAlert("Password Reset successfully","success",() => navigate("/") )
                    }
                  } catch (error) {
                    setError(`${error.response?.data.message || error.message}`);
                  } finally {
                    setLoading(false);
                  }
                }else{
                  setError({password: fieldErrors.password?._errors[0],
                    repassword: fieldErrors.repassword?._errors[0]
                  })
                }
              }else{
                setError("password and re-type password are not same")
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
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          type={alertType}
          onClose={() => {setShowAlert(false)
            if (alertCallback) alertCallback();
          }}
        />
      )}
    </div>
  );
}

export default ResetPassword;
