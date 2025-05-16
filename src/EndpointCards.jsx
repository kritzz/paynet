import { useNavigate } from "react-router-dom";

function EndpointCards() {
  const navigate = useNavigate(); // React Router hook for navigation

  const endpoints = [
    { title: "Top Products", desc: "Best-performing products", route: "/top-products" },
    { title: "Sales Trend", desc: "Sales trend over time", route: "/sales-trend" },
    { title: "Top Categories", desc: "Most popular categories", route: "/top-categories" },
    { title: "Top Sellers", desc: "High-performing sellers", route: "/top-sellers" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {endpoints.map((card, idx) => (
        <div
          key={idx}
          className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition-all cursor-pointer"
          onClick={() => navigate(card.route)} // Navigate to the specified route
        >
          <h3 className="font-semibold text-orange-500 text-lg">{card.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{card.desc}</p>
        </div>
      ))}
    </div>
  );
}

export default EndpointCards;