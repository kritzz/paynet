import React from 'react';
import SummaryCards from './SummaryCards';
import EndpointCards from './EndpointCards';
import './App.css'

function App() {
  return (
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
  );
}


export default App
