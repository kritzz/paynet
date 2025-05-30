import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaChartBar,
  FaBoxes,
  FaStoreAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Dashboard", icon: <FaHome /> },
    { path: "/top-products", label: "Products", icon: <FaBoxes /> },
    { path: "/sales-trend", label: "Sales Trend", icon: <FaChartBar /> },
    { path: "/top-categories", label: "Categories", icon: <FaChartBar /> },
    { path: "/top-sellers", label: "Sellers", icon: <FaStoreAlt /> },
  ];

  return (
    <nav className="bg-[#1a1a1a] border-b border-[#333333] sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-orange-500">
                Shopee Sales
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
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
          </div>
        </div>
      )}
    </nav>
  );
}
