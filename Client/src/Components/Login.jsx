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
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { email, password };
    const validation = loginSchema.safeParse(formData);

    if (validation.success) {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/users/login",
          formData,
          { timeout: 5000 }
        );
        toast.success(`${response.data.message}`);
        setErrors({});
        localStorage.setItem("token", `${response.data.token}`);
        localStorage.setItem("isLoggedIn", true);
        if (getUserRole(localStorage.getItem("token")) === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Login error:", error.response?.data);
        setErrors({
          api: `${error.response?.message || error.message}`,
        });
      }
    } else {
      const fieldErrors = validation.error.format();
      setErrors({
        username: fieldErrors.username?._errors[0],
        email: fieldErrors.email?._errors[0],
        password: fieldErrors.password?._errors[0],
      });
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
      </div>
    </section>
  );
}

export default Login;
