import { NavLink } from "react-router-dom";
import LogoDark from "../../assets/img/logo-dark.svg";
import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [role, setRole] = useState("simple_user");
  function getUserUsername(token) {
    const decoded = jwtDecode(token);
    return decoded.username;
  }

  function getUserEmail(token) {
    const decoded = jwtDecode(token);
    return decoded.email;
  }
  function getUserRole(token) {
    const decoded = jwtDecode(token);
    return decoded.role;
  }

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setIsLoggedIn(false);
    } else {
      setRole(getUserRole(localStorage.getItem("token")));
    }
  }, []);
  const handleSignOut = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.href = "/";
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <header className="bg-white py-4 shadow-lg fixed z-50 w-full transition-all duration-500">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-y-4 lg:flex-row lg:justify-between lg:gap-y-0">
            <a href="/" className="lg:mr-8">
              <img className="w-[140px]" src={LogoDark} alt="Logo" />
            </a>
            <nav className="text-primary flex flex-wrap justify-center gap-x-4 lg:gap-x-8 font-tertiary tracking-[3px] text-[15px] items-center uppercase">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `py-2 ${isActive ? "text-accent" : "text-base"}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/Rooms"
                className={({ isActive }) =>
                  `py-2 ${isActive ? "text-accent" : "text-base"}`
                }
              >
                Rooms
              </NavLink>
              <NavLink
                to="/restaurant"
                className={({ isActive }) =>
                  `py-2 ${isActive ? "text-accent" : "text-base"}`
                }
              >
                Restaurant
              </NavLink>
              {role === "admin" ?  (
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    `py-2 ${isActive ? "text-accent" : "text-base"}`
                  }
                >
                  Admin
                </NavLink>
              ): null}
            </nav>

            {isLoggedIn ? (
              <div className="flex gap-x-3 mt-4 lg:mt-0">
                {role === "simple_user" ? (
                  <NavLink
                    to="/bookhistory"
                    className="text-primary border-primary border px-3 py-2 rounded uppercase tracking-wide hover:bg-accent hover:text-white transition text-sm"
                  >
                    Book History
                  </NavLink>
                ) : null}
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="text-primary border-primary border px-3 py-2 rounded uppercase tracking-wide hover:bg-accent hover:text-white transition text-sm"
                  >
                    Profile
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                      <div className="px-4 py-2 text-gray-700">
                        <p className="font-semibold">
                          {getUserUsername(localStorage.getItem("token"))}
                        </p>
                        <p className="text-sm">
                          {getUserEmail(localStorage.getItem("token"))}
                        </p>
                      </div>
                      <div className="border-t border-gray-200">
                        <NavLink
                        to="/update/profile"
                          className="w-full px-4 py-2 text-left text-sm text-blue-500 hover:bg-blue-100"
                        >
                          Update Profile
                        </NavLink>
                      </div>
                      <div className="border-t border-gray-200">
                        <button
                          onClick={handleSignOut}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-100"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex gap-x-3 mt-4 lg:mt-0">
                <NavLink
                  to="/login"
                  className="text-primary border-primary border px-3 py-2 rounded uppercase tracking-wide hover:bg-accent hover:text-white transition text-sm"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="text-primary border-primary border px-3 py-2 rounded uppercase tracking-wide hover:bg-accent hover:text-white transition text-sm"
                >
                  Signup
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="h-[144px] lg:h-[80px]"></div>
    </>
  );
}
