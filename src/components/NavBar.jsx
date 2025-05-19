import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaChartBar,
  FaBoxes,
  FaStoreAlt,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const navLinks = [
    { path: "/", label: "Dashboard", icon: <FaHome /> },
    { path: "/top-products", label: "Products", icon: <FaBoxes /> },
    { path: "/sales-trend", label: "Sales Trend", icon: <FaChartBar /> },
    { path: "/top-categories", label: "Categories", icon: <FaChartBar /> },
    { path: "/top-sellers", label: "Sellers", icon: <FaStoreAlt /> },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  // Function to get user initials
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <nav className="bg-[#1a1a1a] border-b border-[#333333] sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/Slogo.png"
                width={45}
                style={{ marginRight: "1rem" }}
              />
              <span className="text-xl font-bold text-orange-500">
                Shopee Sales
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-2 rounded-md my-2 text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "bg-orange-500 text-white"
                    : "text-gray-300 hover:bg-[#252525]"
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}

            {/* Profile and Logout buttons for desktop */}
            <div className="flex items-center ml-4 border-l border-[#333333] pl-4">
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-[#252525] transition-colors"
              >
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-orange-500"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold">
                    {getInitials(currentUser?.displayName)}
                  </div>
                )}
                <span>{currentUser?.displayName || "Profile"}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="cursor-pointer flex items-center px-3 py-2 ml-2 rounded-md text-sm font-medium text-gray-300 hover:bg-[#252525] transition-colors"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Navigation Button */}
          <div className="flex items-center md:hidden">
            {/* User Avatar for Mobile */}
            <Link to="/profile" className="mr-4">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-orange-500"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold">
                  {getInitials(currentUser?.displayName)}
                </div>
              )}
            </Link>

            <button
              className="text-gray-300 hover:text-white focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1a1a1a] border-b border-[#333333]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? "bg-orange-500 text-white"
                    : "text-gray-300 hover:bg-[#252525]"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-3">{link.icon}</span>
                {link.label}
              </Link>
            ))}

            {/* Profile and Logout buttons for mobile */}
            <div className="border-t border-[#333333] pt-2 mt-2">
              <Link
                to="/profile"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-[#252525]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold mr-3">
                  {getInitials(currentUser?.displayName)}
                </div>
                Profile
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-[#252525]"
              >
                <FaSignOutAlt className="mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
