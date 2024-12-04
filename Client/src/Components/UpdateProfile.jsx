import { useEffect, useState } from "react";
import { z } from "zod";
import CustomAlert from "./Notification/CustomAlert";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function UpdateProfile() {
  const token = localStorage.getItem("token") || null;
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [password, setPassword] = useState("");
  const [newusername, setNewUsername] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false);
  const [updateUsername, setUpdateUsername] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);

  const triggerAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  useEffect(() => {
    if (!token) {
      triggerAlert("You are not logged in, please login", "error");
    }
  }, []);

  const updateSchema = z.object({
    password: z
      .string()
      .min(8, "Password must have at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[@$!%*?&#]/, "Password must contain at least one special character (@$!%*?&#)"),
    newpassword: z
      .string()
      .min(8, "Password must have at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[@$!%*?&#]/, "Password must contain at least one special character (@$!%*?&#)"),
    newusername: z.string().min(4, "Username is required"),
  });

  // Check current password validity
  const checkCurrentPassword = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/verify/password",
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setIsCurrentPasswordValid(true);
        setShowForm(true);
        triggerAlert("Password verified successfully", "success");
      } else {
        triggerAlert("Incorrect password, please try again", "error");
      }
    } catch (error) {
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
      console.log(error)
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = {};
    if (updateUsername) {
      formData.newusername = newusername;
    }
    if (updatePassword) {
      formData.password = password;
      formData.newpassword = newpassword;
    }

    const validate = updateSchema.safeParse(formData);
    const flag = Number(updateUsername)+Number(updatePassword);
    const id = jwtDecode(token).user_id;
    if (validate.success) {
      if (jwtDecode(token).username === newusername && updateUsername) {
        triggerAlert("Username is the same as before", "error");
      } else {
        try {
          const response = await axios.patch(
            `http://localhost:8000/api/users/update/info/${id}`,
            {...formData, flag:flag},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response);
          if (response.status === 200) {
            triggerAlert(`${response.data.message}`, "success");
            localStorage.removeItem("token");
            localStorage.setItem("token", `${response.data.token}`);
            // window.location.href = "/";
          }
        } catch (error) {
          triggerAlert("Error updating profile, please try again", "error");
          console.log(error);
        }
      }
    } else {
      const fieldErrors = validate.error.format();
      setAlertMessage(fieldErrors.newusername?._errors[0] || fieldErrors.password?._errors[0] || fieldErrors.newpassword?._errors[0]);
      setAlertType("error");
      setShowAlert(true);
    }
  }

  return (
    <>
      <section className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold text-center text-gray-800">Update Profile</h2>

          {/* Ask for current password */}
          {!showForm && !isCurrentPasswordValid && (
            <div>
              <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                id="current_password"
                placeholder="Enter your current password"
                className="w-full px-4 py-3 mt-1 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={checkCurrentPassword}
                className="w-full px-4 py-3 mt-4 text-lg font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Verify Password
              </button>
            </div>
          )}

          {/* Show the form to update username and/or password */}
          {showForm && (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Choose what to update:</label>
                <div className="flex items-center space-x-4">
                  <label>
                    <input
                      type="checkbox"
                      checked={updateUsername}
                      onChange={() => setUpdateUsername(!updateUsername)}
                    />
                    Update Username
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={updatePassword}
                      onChange={() => setUpdatePassword(!updatePassword)}
                    />
                    Update Password
                  </label>
                </div>
              </div>

              {/* New Username */}
              {updateUsername && (
                <div>
                  <label htmlFor="new_username" className="block text-sm font-medium text-gray-700">
                    New Username
                  </label>
                  <input
                    type="text"
                    id="new_username"
                    placeholder="Enter your new username"
                    className="w-full px-4 py-3 mt-1 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    value={newusername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                </div>
              )}

              {/* New Password */}
              {updatePassword && (
                <div>
                  <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="new_password"
                    placeholder="Enter your new password"
                    className="w-full px-4 py-3 mt-1 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    value={newpassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full px-4 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Update
              </button>
            </form>
          )}
        </div>
      </section>

      {showAlert && (
        <CustomAlert
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
        />
      )}
    </>
  );
}
