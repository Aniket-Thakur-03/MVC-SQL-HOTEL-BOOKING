import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import "./index.css";
import RoomProvider from "./Context/RoomContext";
function Layout() {
  const location = useLocation();
  const hideHeaderFooter =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/unauthorized" ||
    location.pathname === "/checkemail" ||
    location.pathname === "/update/profile" ||
    location.pathname === "/forget/password/:id" ||
    location.pathname === "/verifyemail";
  return (
    <RoomProvider>
      {!hideHeaderFooter && <Header />}
      <Outlet />
      {!hideHeaderFooter && <Footer />}
    </RoomProvider>
  );
}

export default Layout;
