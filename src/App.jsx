import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SummaryCards from './SummaryCards';
import EndpointCards from './EndpointCards';
import SellersPage from './pages/Seller';
import ProductPage from './pages/Product';
import './App.css';

function TopProducts() {
  return <h1 className="text-center text-2xl font-bold mt-10 text-white">Top Products Page</h1>;
}

function SalesTrend() {
  return <h1 className="text-center text-2xl font-bold mt-10 text-white">Sales Trend Page</h1>;
}

function TopCategories() {
  return <h1 className="text-center text-2xl font-bold mt-10 text-white">Top Categories Page</h1>;
}



function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-[#0d0d0d] px-4 py-10">
              <h1 className="text-4xl font-bold text-orange-500 text-center mb-2">
                Shopee Sales
              </h1>
              <p className="text-center text-gray-400 mb-10">
                A sleek dashboard to visualize Shopee sales data.
              </p>

              {/* Summary Section */}
              <div className="mb-12">
                <SummaryCards />
              </div>

              {/* Other Endpoint Cards */}
              <EndpointCards />
            </div>
          }
        />

        {/* Additional Routes */}
        <Route path="/top-products" element={<ProductPage />} />
        <Route path="/sales-trend" element={<SalesTrend />} />
        <Route path="/top-categories" element={<TopCategories />} />
        <Route path="/top-sellers" element={<SellersPage />} />
      </Routes>
    </Router>
  );
}

export default App;