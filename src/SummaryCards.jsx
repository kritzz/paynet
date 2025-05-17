import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaChartLine,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";

function SummaryCards() {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("2023-04-24");
  const [endDate, setEndDate] = useState("2023-05-13");

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://corsproxy.io/?url=https://diqe9uc0ki.execute-api.ap-southeast-1.amazonaws.com/dev/summary?start_date=${startDate}&end_date=${endDate}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setSummaryData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  function formatKey(key) {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  // Icons for each metric
  const getIconForKey = (key) => {
    switch (key) {
      case "total_sales":
        return <FaChartLine className="h-6 w-6" />;
      case "total_orders":
        return <FaShoppingCart className="h-6 w-6" />;
      case "total_buyers":
        return <FaUsers className="h-6 w-6" />;
      default:
        return <FaChartLine className="h-6 w-6" />;
    }
  };

  return (
    <div>
      {/* Date Range Selector */}
      <div className="mb-8 p-4 bg-[#1a1a1a] rounded-lg border border-[#333333]">
        <div className="flex items-center mb-4">
          <FaCalendarAlt className="text-orange-500 mr-2" />
          <span className="text-white font-medium">Date Range Filter</span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1">
            <label className="block text-gray-400 text-sm mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min="2023-04-24"
              max={endDate}
              className="w-full p-2.5 rounded bg-[#252525] text-white border border-[#333333] focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-400 text-sm mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              max="2023-05-13"
              className="w-full p-2.5 rounded bg-[#252525] text-white border border-[#333333] focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-900 text-red-100 rounded-lg">
          <p className="font-medium">Error loading data</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-[#1a1a1a] rounded-lg border border-[#333333] p-6 shadow-lg animate-pulse"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#252525]"></div>
                  <div className="ml-3 h-4 w-24 bg-[#252525] rounded"></div>
                </div>
                <div className="h-8 w-32 bg-[#252525] rounded"></div>
              </div>
            ))
          : Object.entries(summaryData).map(([key, value], idx) => (
              <div
                key={idx}
                className="bg-[#1a1a1a] rounded-lg border border-[#333333] p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500 bg-opacity-20 flex items-center justify-center text-orange-500">
                    {getIconForKey(key)}
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-gray-300">
                    {formatKey(key)}
                  </h3>
                </div>
                <div className="text-2xl font-bold text-white">
                  {key === "total_sales"
                    ? `RM ${parseFloat(value).toLocaleString()}`
                    : parseInt(value).toLocaleString()}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

export default SummaryCards;
