import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SummaryCards from "./SummaryCards";
import EndpointCards from "./EndpointCards";
import SellersPage from "./pages/Seller";
import ProductPage from "./pages/Product";
import CategoryPage from "./pages/Category";
import SalesTrendPage from "./pages/SalesTrend";
import "./App.css";
import Navbar from "./components/NavBar";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-[#0d0d0d] px-4 py-6">
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col items-center text-center mb-10">
                  <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400 mb-3">
                    Shopee Sales Dashboard
                  </h1>
                  <p className="text-gray-400 max-w-2xl text-lg">
                    A comprehensive analytics platform for visualizing and
                    analyzing Shopee marketplace data.
                  </p>
                </div>

                {/* Summary Section */}
                <div className="mb-14">
                  <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-orange-500 pl-3">
                    Key Metrics
                  </h2>
                  <SummaryCards />
                </div>

                {/* Analytics Sections */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-orange-500 pl-3">
                    Analytics
                  </h2>
                  <EndpointCards />
                </div>
              </div>
            </div>
          }
        />

        {/* Additional Routes */}
        <Route path="/top-products" element={<ProductPage />} />
        <Route path="/sales-trend" element={<SalesTrendPage />} />
        <Route path="/top-categories" element={<CategoryPage />} />
        <Route path="/top-sellers" element={<SellersPage />} />
      </Routes>
    </Router>
  );
}

export default App;
