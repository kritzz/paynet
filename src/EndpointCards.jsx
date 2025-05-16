function EndpointCards() {
    const endpoints = [
      { title: "Top Products", endpoint: "/api/top-products", desc: "Best-performing products" },
      { title: "Sales Trend", endpoint: "/api/sales-trend", desc: "Sales trend over time" },
      { title: "Top Categories", endpoint: "/api/top-categories", desc: "Most popular categories" },
      { title: "Top Sellers", endpoint: "/api/seller", desc: "High-performing sellers" }
    ];
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {endpoints.map((card, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition-all">
            <h3 className="font-semibold text-orange-500 text-lg">{card.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{card.desc}</p>
            <p className="text-xs text-gray-400 mt-2 italic">Endpoint: {card.endpoint}</p>
          </div>
        ))}
      </div>
    );
  }
  
  export default EndpointCards;
  