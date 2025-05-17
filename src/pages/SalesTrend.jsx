import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function SalesTrendPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSales, setShowSales] = useState(true);
    const [showOrders, setShowOrders] = useState(true);
    const [showProducts, setShowProducts] = useState(true);

    const capOutliers = (data, field, capPercentile = 85) => {
        const values = data.map((item) => item[field]);
        const sortedValues = [...values].sort((a, b) => a - b);
        const capValue = sortedValues[Math.floor((capPercentile / 100) * sortedValues.length)];

        return data.map((item) => ({
            ...item,
            [field]: Math.min(item[field], capValue), // Cap the value
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `https://corsproxy.io/?url=${encodeURIComponent(
                        "https://diqe9uc0ki.execute-api.ap-southeast-1.amazonaws.com/dev/sales-trend"
                    )}`
                );

                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.statusText}`);
                }

                let result = await response.json();
                // Cap outliers for total_sales
                result = capOutliers(result, "total_sales");
                setData(result);
                setError(null);
            } catch (err) {
                setError("Failed to fetch sales trend data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Calculate percentage changes
    const calculatePercentageChange = (start, end) => (((end - start) / start) * 100).toFixed(2);

    const salesChange =
        data.length > 1 ? calculatePercentageChange(data[0].total_sales, data[data.length - 1].total_sales) : 0;
    const ordersChange =
        data.length > 1 ? calculatePercentageChange(data[0].total_orders, data[data.length - 1].total_orders) : 0;

    // Prepare data for the line chart
    const chartData = {
        labels: data.map((item) => item.date),
        datasets: [
            {
                label: "Total Sales (RM)",
                data: showSales ? data.map((item) => item.total_sales) : [],
                borderColor: "rgba(234, 88, 12, 1)", // Orange
                backgroundColor: "rgba(234, 88, 12, 0.2)",
                tension: 0.4,
            },
            {
                label: "Total Orders",
                data: showOrders ? data.map((item) => item.total_orders) : [],
                borderColor: "rgba(59, 130, 246, 1)", // Blue
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                tension: 0.4,
            },
            {
                label: "Unique Products",
                data: showProducts ? data.map((item) => item.unique_products) : [],
                borderColor: "rgba(16, 185, 129, 1)", // Green
                backgroundColor: "rgba(16, 185, 129, 0.2)",
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: "#fff", // White text for legend
                },
            },
            title: {
                display: true,
                text: "Sales Trend",
                color: "#fff", // White text for title
            },
        },
        scales: {
            x: {
                ticks: {
                    color: "#ccc", // Light gray for x-axis labels
                },
            },
            y: {
                ticks: {
                    color: "#ccc", // Light gray for y-axis labels
                },
            },
        },
    };

    return (
        <div className="min-h-screen bg-[#0d0d0d] p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header remains similar, just with a different background gradient */}
                <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg shadow-lg p-8 mb-8">
                    <h1 className="text-3xl font-bold text-white">Sales Trend</h1>
                    <p className="text-white text-opacity-90 mt-2">
                        Discover sales, orders, unique products metrics performance      </p>
                </div>
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-2 text-gray-400">Loading sales trend...</p>
                    </div>
                )}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && (
                    <>
                        {/* Percentage Change Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-md border border-[#333333]">
                                <h2 className="text-lg font-bold text-gray-300">Total Sales Change</h2>
                                <p
                                    className={`text-4xl font-bold ${salesChange >= 0 ? "text-green-500" : "text-red-500"
                                        } mt-2`}
                                >
                                    {salesChange}%
                                </p>
                            </div>
                            <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-md border border-[#333333]">
                                <h2 className="text-lg font-bold text-gray-300">Total Orders Change</h2>
                                <p
                                    className={`text-4xl font-bold ${ordersChange >= 0 ? "text-green-500" : "text-red-500"
                                        } mt-2`}
                                >
                                    {ordersChange}%
                                </p>
                            </div>
                        </div>

                        {/* Line Chart */}
                        <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-md border border-[#333333] mb-6">
                            <Line data={chartData} options={chartOptions} />
                        </div>

                        {/* Toggles for Lines */}
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowSales(!showSales)}
                                className={`px-4 py-2 rounded ${showSales ? "bg-orange-500 text-white" : "bg-[#1a1a1a] text-gray-300 hover:bg-[#252525]"
                                    }`}
                            >
                                Sales
                            </button>
                            <button
                                onClick={() => setShowOrders(!showOrders)}
                                className={`px-4 py-2 rounded ${showOrders ? "bg-blue-500 text-white" : "bg-[#1a1a1a] text-gray-300 hover:bg-[#252525]"
                                    }`}
                            >
                                Orders
                            </button>
                            <button
                                onClick={() => setShowProducts(!showProducts)}
                                className={`px-4 py-2 rounded ${showProducts ? "bg-green-500 text-white" : "bg-[#1a1a1a] text-gray-300 hover:bg-[#252525]"
                                    }`}
                            >
                                Products
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}