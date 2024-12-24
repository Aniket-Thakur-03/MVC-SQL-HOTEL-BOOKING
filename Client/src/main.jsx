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
import ReviewBoooking from "./Components/ReviewBoooking.jsx";
import { CreateUser } from "./Components/CreateUser.jsx";
import { AdminControl } from "./Components/AdminControl.jsx";
import { Locations } from "./Components/Location.jsx";
import AllBookings from "./Components/AllBookings.jsx";
import AllCheckins from "./Components/AllCheckins.jsx";
import AllCheckouts from "./Components/AllCheckouts.jsx";
import UpdatePayment from "./Components/UpdatePayment.jsx";
// import UpdateRoom from "./Components/UpdateRoom.jsx";
import { AllCountries } from "./Components/AllCountries.jsx";
import { AllStates } from "./Components/AllStates.jsx";
import { AllCities } from "./Components/AllCities.jsx";
import { CreateEditRoom } from "./Components/CreateEditRoom.jsx";
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
        children: [
          { path: "create-user", element: <CreateUser /> },
          { path: "admin-control", element: <AdminControl /> },
          { path: "location", element: <Locations /> },
          { path: "all-bookings", element: <AllBookings /> },
          { path: "check-ins", element: <AllCheckins /> },
          { path: "check-outs", element: <AllCheckouts /> },
          { path: "update-payment-status", element: <UpdatePayment /> },
          { path: "update-rooms", element: <CreateEditRoom /> },
          { path: "update-countries", element: <AllCountries /> },
          { path: "update-states", element: <AllStates /> },
          { path: "update-cities", element: <AllCities /> },
        ],
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
      {
        path: "review-booking",
        element: <ReviewBoooking />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
