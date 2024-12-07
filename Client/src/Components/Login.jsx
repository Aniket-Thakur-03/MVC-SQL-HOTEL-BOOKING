import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
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
});

function getUserRole(token) {
  const decoded = jwtDecode(token);
  return decoded.role;
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { email, password };
    const validation = loginSchema.safeParse(formData);

    if (validation.success) {
      try {
        setLoading(true);
        const response = await axios.post(
          "http://localhost:8000/api/users/login",
          formData,
          { timeout: 5000 }
        );
        if (response.status === 200) {
          toast.success(`${response.data.message}`);
          setErrors({});
          localStorage.setItem("token", `${response.data.token}`);
          localStorage.setItem("isLoggedIn", true);
          if (getUserRole(localStorage.getItem("token")) === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Login error:", error);
        setErrors({
          api: `${error.response?.data.message || error.message}`,
        });
      } finally {
        setLoading(false);
      }
    } else {
      const fieldErrors = validation.error.format();
      setErrors({
        email: fieldErrors.email?._errors[0],
        password: fieldErrors.password?._errors[0],
      });
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/users/send/reset/password",
        { email: resetEmail }
      );
      if (response.status === 200) {
        toast.success("Password reset email sent!");
        setIsModalOpen(false);
        setResetEmail("");
      }
    } catch (error) {
      setResetError(
        error.response?.data?.message || "Error sending reset email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-center text-gray-800">
          Login
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 mt-1 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 mt-1 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Login
          </button>
          {errors.api && (
            <p className="text-sm text-red-600 mt-2">{errors.api}</p>
          )}
        </form>
        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-sm text-blue-500 hover:underline focus:outline-none"
          >
            Forgot Password?
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Reset Password</h3>
            <form onSubmit={handlePasswordReset}>
              <div className="mb-4">
                <label
                  htmlFor="resetEmail"
                  className="block text-sm font-medium text-gray-700"
                >
                  Enter your registered email
                </label>
                <input
                  type="email"
                  id="resetEmail"
                  className="w-full px-4 py-2 mt-1 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
                {resetError && (
                  <p className="text-sm text-red-600 mt-2">{resetError}</p>
                )}
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="animate-spin h-16 w-16 border-t-4 border-b-4 border-white rounded-full"></div>
        </div>
      )}

      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </section>
  );
}

export default Login;
