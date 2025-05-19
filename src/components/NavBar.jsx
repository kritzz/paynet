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
  FaUser,
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
              ></img>
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
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-[#252525] transition-colors"
              >
                <FaUser className="mr-2" />
                {currentUser?.displayName || "Profile"}
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
                <FaUser className="mr-3" />
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
