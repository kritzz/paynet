import { useNavigate } from "react-router-dom";
import { FaBoxes, FaChartBar, FaListUl, FaStoreAlt } from "react-icons/fa";

function EndpointCards() {
  const navigate = useNavigate();

  const endpoints = [
    {
      title: "Top Products",
      desc: "Analyze the most successful products in the marketplace",
      route: "/top-products",
      icon: <FaBoxes className="h-6 w-6" />,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Sales Trend",
      desc: "Track sales performance over specific time periods",
      route: "/sales-trend",
      icon: <FaChartBar className="h-6 w-6" />,
      color: "from-blue-500 to-purple-500",
    },
    {
      title: "Top Categories",
      desc: "Discover the highest-performing product categories",
      route: "/top-categories",
      icon: <FaListUl className="h-6 w-6" />,
      color: "from-green-500 to-teal-500",
    },
    {
      title: "Top Sellers",
      desc: "Identify and analyze the most successful sellers",
      route: "/top-sellers",
      icon: <FaStoreAlt className="h-6 w-6" />,
      color: "from-orange-400 to-yellow-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {endpoints.map((card, idx) => (
        <div
          key={idx}
          onClick={() => navigate(card.route)}
          className="bg-[#1a1a1a] rounded-lg border border-[#333333] overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group"
        >
          <div className={`h-1.5 w-full bg-gradient-to-r ${card.color}`}></div>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#252525] flex items-center justify-center text-gray-300 group-hover:text-white transition-colors">
                {card.icon}
              </div>
              <h3 className="ml-4 text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                {card.title}
              </h3>
            </div>
            <p className="text-gray-400">{card.desc}</p>
            <div className="mt-4 flex justify-end">
              <span className="text-sm text-orange-500 group-hover:text-orange-400 transition-colors">
                View Analysis →
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EndpointCards;
