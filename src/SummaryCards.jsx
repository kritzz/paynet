import { useEffect, useState } from "react";

function SummaryCards() {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace with your actual API endpoint
    const fetchData = async () => {
      try {
        const response = await fetch("https://diqe9uc0ki.execute-api.ap-southeast-1.amazonaws.com/dev/summary");
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
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
      {summaryData.map((item, idx) => (
        <div
          key={idx}
          className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 flex flex-col justify-between"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-400">{item.title}</h3>
            <span className="text-xl">{item.icon}</span>
          </div>
          <div className="mt-4 text-3xl font-bold">{item.value}</div>
          <div className="mt-2 text-sm text-gray-500">{item.subtitle}</div>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;