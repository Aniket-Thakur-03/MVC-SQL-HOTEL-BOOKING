import axios from "axios";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import CustomAlert from "../Notification/CustomAlert";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { User, Mail, Phone, Lock, UserCircle } from "lucide-react";
const adminSchema = z.object({
  fullname: z
    .string()
    .min(1, "Full name is required")
    .regex(
      /^[a-zA-Z]+(?:[\s'][a-zA-Z]+)*$/,
      "Full name must only contain alphabets, spaces, or apostrophes"
    ),
  adminusername: z.string().min(4, "Username must have at least 4 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneno: z
    .string()
    .regex(/^\d{10}$/, "Phone no must be of exactly 10 digits"),
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
});
function CreateUser() {
  const navigate = useNavigate();
  const locationId = jwtDecode(localStorage.getItem("token")).location_id;
  const adminId = jwtDecode(localStorage.getItem("token")).admin_id;
  const [fullname, setFullname] = useState("");
  const [adminusername, setAdminusername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const triggerAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/preference/search/feature/access/v1/admin",
          {
            feature_id: 9,
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { fullname, adminusername, email, phoneno, password };
    const validation = adminSchema.safeParse({ ...formData, repassword });

    if (validation.success) {
      if (password === repassword) {
        setLoading(true);
        try {
          const response = await axios.post(
            "http://localhost:8000/api/users/admin/register",
            formData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (response.status == 200) {
            triggerAlert(`${response.data.message}`, "success");

            setErrors({});
          }
        } catch (error) {
          console.error("Signup error:", error.response?.data || error);
          triggerAlert(
            `${error.response?.data.message || error.message}`,
            "error"
          );
        } finally {
          setLoading(false);
        }
      } else {
        triggerAlert("Retype Password is not same as password", "error");
      }
    } else {
      const fieldErrors = validation.error.format();
      setErrors({
        fullname: fieldErrors.fullname?._errors[0],
        adminusername: fieldErrors.adminusername?._errors[0],
        email: fieldErrors.email?._errors[0],
        phoneno: fieldErrors.phoneno?._errors[0],
        password: fieldErrors.password?._errors[0],
        repassword: fieldErrors.repassword?._errors[0],
      });
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-600 mt-2">Enter your details to register</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="relative">
                <label
                  htmlFor="fullname"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    id="fullname"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      errors.fullname ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150`}
                    placeholder="Enter FullName"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </div>
                {errors.fullname && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullname}</p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    id="username"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      errors.username ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150`}
                    placeholder="Enter UserName"
                    value={adminusername}
                    onChange={(e) => setAdminusername(e.target.value)}
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    id="email"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150`}
                    placeholder="Enter Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="phoneno"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="tel"
                    id="phoneno"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      errors.phoneno ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150`}
                    placeholder="Enter Phone Number"
                    value={phoneno}
                    onChange={(e) => setPhoneno(e.target.value)}
                  />
                </div>
                {errors.phoneno && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneno}</p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="password"
                    id="password"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150`}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              <div className="relative">
                <label
                  htmlFor="repassword"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Re-Enter Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="password"
                    id="repassword"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150`}
                    placeholder="Rewrite Password"
                    value={repassword}
                    onChange={(e) => setRePassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-150 ease-in-out transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {showAlert && (
        <CustomAlert
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
        />
      )}
    </section>
  );
}

export { CreateUser };
