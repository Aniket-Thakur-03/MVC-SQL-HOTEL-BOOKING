import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Home from "./Components/Home.jsx";
import Layout from "./Layout.jsx";
import About from "./Components/About.jsx";
import "./index.css";
import Contact from "./Components/Contact.jsx";
import Login from "./Components/Login.jsx";
import Signup from "./Components/Signup.jsx";
import RoomDetails from "./Components/RoomDetails.jsx";
import Restaurants from "./Components/Restaurants.jsx";
import RoomInfo from "./Components/RoomInfo.jsx";
import BookHistory from "./Components/BookHistory.jsx";
import AdminDashboard from "./Components/AdminDashboard.jsx";
import Unauthorized from "./Components/Unauthorized.jsx";
import VerifyEmail from "./Components/VerifyEmail.jsx";
import CheckEmail from "./Components/CheckEmail.jsx";
import UpdateProfile from "./Components/UpdateProfile.jsx";
import ResetPassword from "./Components/ResetPassword.jsx";
function getUserRole(token) {
  const decoded = jwtDecode(token);
  return decoded.role;
}
function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = token ? getUserRole(token) : null;

  return role === "admin" ? children : <Navigate to="/unauthorized" />;
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "room/:id",
        element: <RoomDetails />,
      },
      {
        path: "restaurant",
        element: <Restaurants />,
      },
      {
        path: "rooms",
        element: <RoomInfo />,
      },
      {
        path: "bookhistory",
        element: <BookHistory />,
      },
      {
        path: "admin/dashboard",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      {
        path: "unauthorized",
        element: <Unauthorized />,
      },
      {
        path: "verifyemail",
        element: <VerifyEmail />,
      },
      {
        path: "checkemail",
        element: <CheckEmail />,
      },
      {
        path: "update/profile",
        element: <UpdateProfile />,
      },
      {
        path: "forget/password/:id",
        element: <ResetPassword />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
