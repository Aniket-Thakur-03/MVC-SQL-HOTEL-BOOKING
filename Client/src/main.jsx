import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Home from "./pages/Home.jsx";
import Layout from "./Layout.jsx";
import "./index.css";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import RoomDetails from "./pages/RoomDetails.jsx";
import Restaurants from "./pages/Restaurants.jsx";
import RoomInfo from "./pages/RoomInfo.jsx";
import BookHistory from "./pages/BookHistory.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Unauthorized from "./Components/Unauthorized.jsx";
import VerifyEmail from "./Components/VerifyEmail.jsx";
import CheckEmail from "./Components/CheckEmail.jsx";
import UpdateProfile from "./pages/UpdateProfile.jsx";
import ResetPassword from "./Components/ResetPassword.jsx";
import ReviewBoooking from "./pages/ReviewBoooking.jsx";
import { CreateUser } from "./Components/admin/CreateUser.jsx";
import { AdminControl } from "./Components/admin/AdminControl.jsx";
import { Locations } from "./Components/admin/Location.jsx";
import AllBookings from "./Components/admin/AllBookings.jsx";
import AllCheckins from "./Components/admin/AllCheckins.jsx";
import AllCheckouts from "./Components/admin/AllCheckouts.jsx";
import UpdatePayment from "./Components/admin/UpdatePayment.jsx";
// import UpdateRoom from "./Components/UpdateRoom.jsx";
import { AllCountries } from "./Components/admin/AllCountries.jsx";
import { AllStates } from "./Components/admin/AllStates.jsx";
import { AllCities } from "./Components/admin/AllCities.jsx";
import { CreateEditRoom } from "./Components/admin/CreateEditRoom.jsx";
import HistoryBook from "./Components/admin/HistoryBook.jsx";
import { ExtraServices } from "./Components/admin/ExtraServices.jsx";
import { ViewInvoices } from "./Components/admin/ViewInvoices.jsx";
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
          { path: "book-history", element: <HistoryBook /> },
          { path: "extra-services", element: <ExtraServices /> },
          { path: "view-invoices", element: <ViewInvoices /> },
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
