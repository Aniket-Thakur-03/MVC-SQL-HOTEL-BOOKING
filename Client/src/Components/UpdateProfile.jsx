import { useEffect, useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import CustomAlert from "./Notification/CustomAlert";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function UpdateProfile() {
  const navigate = useNavigate(); // Initialize navigate
  const token = localStorage.getItem("token");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [alertCallback, setAlertCallback] = useState(null); // Add a callback state
  const [password, setPassword] = useState("");
  const [newusername, setNewUsername] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");

  const triggerAlert = (message, type, callback = null) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertCallback(() => callback); // Store the callback
    setShowAlert(true);
  };

  // Fetch user data on mount
  useEffect(() => {
    if (!token) {
      triggerAlert("You are not logged in, please login", "error");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/users/get/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { full_name, phone_no, username } = response.data.user;
        setFullName(full_name || "");
        setPhoneNo(phone_no || "");
        setNewUsername(username || "");
      } catch (error) {
        triggerAlert("Failed to fetch user profile", "error");
        console.error(error);
      }
    };

    fetchUserProfile();
  }, [token]);

  const updateSchema = z.object({
    fullName: z.string().optional(),
    phoneNo: z.string().min(10, "Phone no must be 10 digits").optional(),
    newusername: z
      .string()
      .min(4, "Username must have at least 4 characters")
      .optional(),
    password: z
      .string()
      .min(8, "Password must have at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&#]/,
        "Password must contain at least one special character (@$!%*?&#)"
      )
      .optional(),
    newpassword: z
      .string()
      .min(8, "Password must have at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&#]/,
        "Password must contain at least one special character (@$!%*?&#)"
      )
      .optional(),
  });

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
      console.log(error);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const id = jwtDecode(token).user_id;

    // Prepare formData only with filled fields
    const formData = {};
    if (fullName) formData.fullName = fullName;
    if (phoneNo) formData.phoneNo = phoneNo;
    if (newusername) formData.newusername = newusername;
    if (password) formData.password = password;
    if (newpassword) formData.newpassword = newpassword;

    // Validate only provided fields
    const validate = updateSchema.safeParse(formData);

    if (!validate.success) {
      const fieldErrors = validate.error.format();
      setAlertMessage(
        fieldErrors.fullName?._errors[0] ||
          fieldErrors.phoneNo?._errors[0] ||
          fieldErrors.newusername?._errors[0] ||
          fieldErrors.password?._errors[0] ||
          fieldErrors.newpassword?._errors[0]
      );
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:8000/api/users/update/info/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        triggerAlert(
          `${response.data.message}`,
          "success",
          () => navigate("/") // Navigate to "/" after alert
        );
        localStorage.removeItem("token");
        localStorage.setItem("token", `${response.data.token}`);
      }
    } catch (error) {
      triggerAlert("Error updating profile, please try again", "error");
      console.log(error);
    }
  }

  return (
    <>
      <section className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold text-center text-gray-800">
            Update Profile
          </h2>

          {!showForm && !isCurrentPasswordValid && (
            <div>
              <label
                htmlFor="current_password"
                className="block text-sm font-medium text-gray-700"
              >
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

          {showForm && (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="full_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="full_name"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 mt-1 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="new_username"
                  className="block text-sm font-medium text-gray-700"
                >
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
              <div>
                <label
                  htmlFor="phone_no"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone No
                </label>
                <input
                  type="text"
                  id="phone_no"
                  placeholder="Enter Phone No"
                  className="w-full px-4 py-3 mt-1 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="new_password"
                  className="block text-sm font-medium text-gray-700"
                >
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
              <button
                type="submit"
                className="w-full px-4 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Update Profile
              </button>
            </form>
          )}
        </div>
      </section>

      {showAlert && (
        <CustomAlert
          type={alertType}
          message={alertMessage}
          onClose={() => {
            setShowAlert(false);
            if (alertCallback) {
              alertCallback();
            }
          }}
        />
      )}
    </>
  );
}
