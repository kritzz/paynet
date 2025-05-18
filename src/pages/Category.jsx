import { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import DocTitle from "../components/DocTitle";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import FancyLoader from "../components/FancyLoader";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function CategoryPage() {
  // Set the browser tab title
  DocTitle("Shopee Sales Dashboard - Categories");

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order
  const [selectedCategory, setSelectedCategory] = useState(null); // Track selected category
  const tableRefs = useRef([]); // Refs for table rows

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        // Fetch data from the endpoint using corsproxy.io
        const response = await fetch(
          `https://corsproxy.io/?url=${encodeURIComponent(
            "https://diqe9uc0ki.execute-api.ap-southeast-1.amazonaws.com/dev/top-category?sort_by=revenue&sort_order=asc&limit=1000"
          )}`
        );

        if (!response.ok) {
          throw new Error(`Error fetching categories: ${response.statusText}`);
        }

        const data = await response.json();

        // Group by the second part of `item_category_detail` and sum up revenue
        const groupedData = data.reduce((acc, item) => {
          const categoryParts = item.item_category_detail
            .split("|")
            .map((part) => part.trim());
          const category = categoryParts[1]; // Extract the second part
          const subcategory = categoryParts[2]; // Extract the third part (subcategory)

          if (!acc[category]) {
            acc[category] = { revenue: 0, subcategories: new Set() };
          }

          acc[category].revenue += item.revenue; // Sum up revenue
          acc[category].subcategories.add(subcategory); // Add subcategory to the set

          return acc;
        }, {});

        // Convert grouped data into an array for the chart and table
        const formattedData = Object.entries(groupedData).map(
          ([category, { revenue, subcategories }]) => ({
            category,
            revenue,
            subcategories: Array.from(subcategories), // Convert subcategories set to an array
          })
        );

        // Sort data in ascending order by default
        const sortedData = formattedData.sort((a, b) => a.revenue - b.revenue);

        setCategories(sortedData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch category data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle sorting by revenue
  const handleSort = (order) => {
    const sortedCategories = [...categories].sort((a, b) =>
      order === "asc" ? a.revenue - b.revenue : b.revenue - a.revenue
    );
    setCategories(sortedCategories);
    setSortOrder(order);
  };

  // Handle selection of a category
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);

    // Scroll to the corresponding table row
    const index = categories.findIndex((item) => item.category === category);
    if (tableRefs.current[index]) {
      tableRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // Prepare data for the bar chart
  const chartData = {
    labels: categories.map((item) => item.category),
    datasets: [
      {
        label: "Revenue (RM)",
        data: categories.map((item) => item.revenue),
        backgroundColor: categories.map((item) =>
          item.category === selectedCategory
            ? "rgba(255, 255, 255, 1)"
            : "rgba(234, 88, 12, 1)"
        ), // Default orange, selected white
        borderColor: categories.map((item) =>
          item.category === selectedCategory
            ? "rgba(255, 255, 255, 1)"
            : "rgba(234, 88, 12, 1)"
        ),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Display legends at the top
      },
      title: {
        display: true,
        text: "Revenue by Category",
      },
      tooltip: {
        callbacks: {
          label: (context) => `RM ${context.raw.toFixed(2)}`, // Format tooltip values with RM
        },
      },
    },
    scales: {
      x: {
        display: false, // Hide x-axis labels (categories)
      },
      y: {
        title: {
          display: true,
          text: "Revenue (RM)", // Add unit to y-axis
        },
        ticks: {
          callback: (value) => `RM ${value}`, // Format y-axis ticks with RM
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const category = categories[index].category;
        handleSelectCategory(category);

        // Scroll to the corresponding table row
        if (tableRefs.current[index]) {
          tableRefs.current[index].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    },
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header remains similar, just with a different background gradient */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-white">Top Categories</h1>
          <p className="text-white text-opacity-90 mt-2">
            Discover revenue performance across various categories{" "}
          </p>
        </div>
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="flex justify-center">
              <FancyLoader />
            </div>
            <p className="mt-6 text-gray-400">Loading categories...</p>
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            {/* Sorting Controls */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => handleSort("asc")}
                className={`cursor-pointer px-4 py-2 mr-2 rounded ${
                  sortOrder === "asc"
                    ? "bg-orange-500 text-white"
                    : "bg-[#1a1a1a] text-gray-300 hover:bg-[#252525]"
                }`}
              >
                Sort Ascending
              </button>
              <button
                onClick={() => handleSort("desc")}
                className={`cursor-pointer px-4 py-2 rounded ${
                  sortOrder === "desc"
                    ? "bg-orange-500 text-white"
                    : "bg-[#1a1a1a] text-gray-300 hover:bg-[#252525]"
                }`}
              >
                Sort Descending
              </button>
            </div>

            {/* Bar Chart */}
            <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-md mb-6 border border-[#333333]">
              <Bar data={chartData} options={chartOptions} />
            </div>

            {/* Table */}
            <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-md border border-[#333333]">
              <h2 className="text-xl font-bold text-white mb-4">
                Category Table
              </h2>
              <table className="w-full border-collapse border border-[#333333]">
                <thead>
                  <tr className="bg-[#252525]">
                    <th className="border border-[#333333] px-4 py-2 text-left text-gray-300">
                      Category
                    </th>
                    <th className="border border-[#333333] px-4 py-2 text-left text-gray-300">
                      Subcategories
                    </th>
                    <th className="border border-[#333333] px-4 py-2 text-right text-gray-300">
                      Revenue (RM)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((item, index) => (
                    <tr
                      key={index}
                      ref={(el) => (tableRefs.current[index] = el)} // Assign ref to each row
                      className={`hover:bg-[#252525] cursor-pointer ${
                        item.category === selectedCategory
                          ? "bg-orange-500"
                          : ""
                      }`}
                      onClick={() => handleSelectCategory(item.category)}
                    >
                      <td className="border border-[#333333] px-4 py-2 text-gray-300">
                        {item.category}
                      </td>
                      <td className="border border-[#333333] px-4 py-2">
                        <div className="flex flex-wrap gap-2">
                          {item.subcategories.map((subcategory, subIndex) => (
                            <span
                              key={subIndex}
                              className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                            >
                              {subcategory}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="border border-[#333333] px-4 py-2 text-right text-gray-300">
                        {item.revenue.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
