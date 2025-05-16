import { useEffect, useState } from "react";

function SummaryCards() {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("2023-04-24"); // Default start date
  const [endDate, setEndDate] = useState("2023-05-13"); // Default end date

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
  }, [startDate, endDate]); // Re-run fetchData when startDate or endDate changes

  function formatKey(key) {
    return key
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
  }

  return (
    <div>
         <p className="text-center text-gray-400 mb-4">
      Use the calendars below to select a date range for filtering the summary data.
    </p>
    {/* Date Range Inputs */}
<div className="mb-6 flex justify-center gap-4">
  <div>
    <label className="block text-white mb-2">Start Date:</label>
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      min="2023-04-24" // Disable dates before the original start date
      max={endDate} // Ensure start date is not after the selected end date
      className="p-2 rounded bg-gray-800 text-white border border-gray-600"
    />
  </div>
  <div>
    <label className="block text-white mb-2">End Date:</label>
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      min={startDate} // Ensure end date is not before the selected start date
      max="2023-05-13" // Disable dates after the original end date
      className="p-2 rounded bg-gray-800 text-white border border-gray-600"
    />
  </div>
</div>

      {/* Summary Cards or Loading Animation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 flex flex-col items-center justify-center text-center animate-pulse"
              >
                <div className="h-6 w-3/4 bg-gray-700 rounded mb-4"></div>
                <div className="h-8 w-1/2 bg-gray-700 rounded"></div>
              </div>
            ))
          : Object.entries(summaryData).map(([key, value], idx) => (
              <div
                key={idx}
                className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 flex flex-col items-center justify-center text-center"
              >
                <h3 className="text-lg font-bold text-orange-500 mb-2">{formatKey(key)}</h3>
                <div className="text-xl font-medium break-words">{value}</div>
              </div>
            ))}
      </div>
    </div>
  );
}

export default SummaryCards;