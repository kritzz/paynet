import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SummaryCards from "./SummaryCards";
import EndpointCards from "./EndpointCards";
import SellersPage from "./pages/Seller";
import ProductPage from "./pages/Product";
import CategoryPage from "./pages/Category";
import SalesTrendPage from "./pages/SalesTrend";
import { FaChartLine, FaChartBar } from "react-icons/fa";
import "./App.css";
import Navbar from "./components/NavBar";
import { Link } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import ForgotPassword from "./pages/ForgotPassword";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AuthenticatedLayout from "./components/AuthenticatedLayout";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Landing Page */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <AuthenticatedLayout>
                  <div className="min-h-screen bg-[#0d0d0d] relative overflow-hidden">
                    {/* Background elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full opacity-40 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full opacity-40 blur-3xl"></div>
                    <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-500 rounded-full opacity-40 blur-3xl"></div>

                    {/* Main content */}
                    <div className="relative px-4 py-12 lg:py-20">
                      <div className="max-w-6xl mx-auto">
                        {/* Hero Section with animation */}
                        <div className="flex flex-col items-center text-center mb-16 animate-fadeIn">
                          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400 mb-6">
                            Shopee Sales Dashboard
                          </h1>
                          <p className="text-gray-400 max-w-2xl text-lg md:text-xl leading-relaxed">
                            A comprehensive analytics platform for visualizing
                            and analyzing Shopee marketplace data with real-time
                            insights.
                          </p>
                        </div>

                        {/* Summary Section */}
                        <div className="mb-20 scroll-m-20" id="metrics">
                          <div className="flex items-center mb-8">
                            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mr-4">
                              <FaChartLine className="h-5 w-5" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                              Key Metrics
                            </h2>
                          </div>
                          <SummaryCards />
                        </div>

                        {/* Analytics Sections */}
                        <div className="scroll-m-20" id="analytics">
                          <div className="flex items-center mb-8">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mr-4">
                              <FaChartBar className="h-5 w-5" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                              Analytics Tools
                            </h2>
                          </div>
                          <EndpointCards />

                          {/* Call to action */}
                          <div className="mt-20 text-center p-10 rounded-2xl bg-gradient-to-r from-[#1a1a1a] to-[#252525] border border-[#333333]">
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                              Ready to gain deeper insights?
                            </h3>
                            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                              Explore our comprehensive analytics tools and
                              discover actionable insights for your e-commerce
                              business.
                            </p>
                            <Link to="/top-products">
                              <button className="cursor-pointer px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg shadow-lg hover:shadow-orange-500/20 hover:translate-y-[-2px] transition-all duration-300">
                                Explore Analytics
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AuthenticatedLayout>
              </PrivateRoute>
            }
          />

          {/* Additional Routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <AuthenticatedLayout>
                  <Profile />
                </AuthenticatedLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/top-products"
            element={
              <PrivateRoute>
                <AuthenticatedLayout>
                  <ProductPage />
                </AuthenticatedLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/sales-trend"
            element={
              <PrivateRoute>
                <AuthenticatedLayout>
                  <SalesTrendPage />
                </AuthenticatedLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/top-categories"
            element={
              <PrivateRoute>
                <AuthenticatedLayout>
                  <CategoryPage />
                </AuthenticatedLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/top-sellers"
            element={
              <PrivateRoute>
                <AuthenticatedLayout>
                  <SellersPage />
                </AuthenticatedLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
