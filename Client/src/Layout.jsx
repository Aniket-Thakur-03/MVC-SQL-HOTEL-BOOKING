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
    location.pathname.startsWith("/forget/password") ||
    location.pathname === "/verifyemail";

  return (
    <RoomProvider>
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        {!hideHeaderFooter && <Header />}
        <div className="flex-1">
          <Outlet />
        </div>
        {!hideHeaderFooter && <Footer />}
      </div>
    </RoomProvider>
  );
}

export default Layout;
