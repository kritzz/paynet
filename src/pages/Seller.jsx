import { useState, useEffect } from "react";
import { FaStar, FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

// Function to generate a color based on name
const generateColor = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase().padStart(6, "0");
  return `#${c}`;
};

// Function to get initials from name
const getInitials = (name = "") => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

export default function SellersPage() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState("average_rating");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [isDataValid, setIsDataValid] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoading(true);
        const originalUrl = `https://diqe9uc0ki.execute-api.ap-southeast-1.amazonaws.com/dev/seller?sort_by=${sortField}&sort_order=${sortOrder}`;
        const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(
          originalUrl
        )}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) {
          throw new Error(`Error fetching sellers: ${response.statusText}`);
        }

        const data = await response.json();

        const isValid =
          Array.isArray(data) &&
          data.every((seller) => typeof seller === "object" && seller !== null);

        setIsDataValid(isValid);

        if (isValid) {
          setSellers(data);
          setError(null);
        } else {
          throw new Error("Received invalid data format from API");
        }
      } catch (err) {
        setError(err.message || "An unknown error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, [sortField, sortOrder]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const getSortIcon = (field) => {
    if (field !== sortField) return <FaSort className="ml-1" />;
    return sortOrder === "asc" ? (
      <FaSortUp className="ml-1" />
    ) : (
      <FaSortDown className="ml-1" />
    );
  };

  const filteredSellers = sellers.filter((seller) => {
    const sellerName = seller.seller_name || "";
    return sellerName.toLowerCase().includes(filter.toLowerCase());
  });

  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(filteredSellers.length / ITEMS_PER_PAGE);
  const paginatedSellers = filteredSellers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header remains similar, just with a different background gradient */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-white">Verified Sellers</h1>
          <p className="text-white text-opacity-90 mt-2">
            Discover quality merchants on our platform
          </p>
        </div>

        {!isDataValid && (
          <div className="bg-yellow-900 text-yellow-100 p-4 rounded-lg mb-6">
            <p className="font-medium">Warning</p>
            <p className="text-sm mt-1">
              The API returned data in an unexpected format. Some information
              may be missing.
            </p>
          </div>
        )}

        <div className="mb-8 space-y-4">
          {/* Dark-themed search input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search sellers..."
              className="w-full pl-10 pr-4 py-3 border-0 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all duration-200 bg-[#1a1a1a] text-gray-200 placeholder-gray-500"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1); // Reset to the first page when filtering
              }}
            />
          </div>

          {/* Dark-themed sort controls */}
          <div className="flex flex-wrap gap-2">
            <div className="text-sm text-gray-400 mb-2">Sort by:</div>
            <div className="flex flex-wrap gap-2">
              {[
                { field: "seller_name", label: "Seller Name" },
                { field: "total_orders", label: "Orders" },
                { field: "total_ratings", label: "Ratings" },
                { field: "total_sales", label: "Sales" },
                { field: "unique_products", label: "Products" },
              ].map(({ field, label }) => (
                <button
                  key={field}
                  onClick={() => handleSort(field)}
                  className={`cursor-pointer flex items-center px-3 py-1.5 rounded text-sm ${
                    sortField === field
                      ? "bg-orange-500 text-white font-medium"
                      : "bg-[#1a1a1a] text-gray-300 hover:bg-[#252525]"
                  }`}
                >
                  {label} {getSortIcon(field)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {!loading && !error && (
          <div className="flex justify-between items-center mb-6 bg-[#1a1a1a] p-4 rounded-lg shadow-sm border border-[#333333]">
            <div className="text-sm text-gray-400">
              Showing {paginatedSellers.length} of {filteredSellers.length}{" "}
              sellers
            </div>
            <div className="text-sm text-gray-400">
              Page {page} of {totalPages || 1}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-400">Loading sellers...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900 text-red-100 p-4 rounded-lg mb-6">
            <p className="font-medium">Error loading sellers</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm bg-red-800 hover:bg-red-700 px-3 py-1 rounded"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedSellers.length > 0 ? (
                paginatedSellers.map((seller) => (
                  <div
                    key={seller.seller_name}
                    className="bg-[#1a1a1a] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-[#333333]"
                  >
                    <div className="p-6 flex items-start space-x-4">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold shadow-md flex-shrink-0"
                        style={{
                          backgroundColor: generateColor(seller.seller_name),
                        }}
                      >
                        {getInitials(seller.seller_name)}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-white">
                          {seller.seller_name || "Unknown Seller"}
                        </h2>
                        <div className="flex items-center mt-2">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.round(seller.average_rating)
                                  ? "text-orange-500"
                                  : "text-gray-700"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-gray-400 text-sm">
                            {seller.average_rating.toFixed(1)}
                          </span>
                        </div>

                        {/* Dark-themed seller stats */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-orange-600 mr-2"></div>
                            <span className="text-gray-400">Orders:</span>
                            <span className="ml-1 font-medium text-gray-300">
                              {seller.total_orders?.toLocaleString() || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
                            <span className="text-gray-400">Ratings:</span>
                            <span className="ml-1 font-medium text-gray-300">
                              {seller.total_ratings?.toLocaleString() || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-green-600 mr-2"></div>
                            <span className="text-gray-400">Sales:</span>
                            <span className="ml-1 font-medium text-gray-300">
                              {seller.total_sales?.toLocaleString() || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-purple-600 mr-2"></div>
                            <span className="text-gray-400">Products:</span>
                            <span className="ml-1 font-medium text-gray-300">
                              {seller.unique_products?.toLocaleString() ||
                                "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-[#1a1a1a] rounded-lg border border-[#333333]">
                  <p className="text-gray-400">
                    No sellers found matching your search
                  </p>
                  <button
                    className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium transition-colors duration-200"
                    onClick={() => setFilter("")}
                  >
                    Show all sellers
                  </button>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded cursor-pointer ${
                    page === 1
                      ? "bg-[#252525] text-gray-600 cursor-not-allowed"
                      : "bg-[#1a1a1a] text-orange-500 hover:bg-[#252525] border border-[#333333]"
                  }`}
                >
                  Previous
                </button>

                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 cursor-pointer rounded-full ${
                        page === pageNum
                          ? "bg-orange-500 text-white"
                          : "bg-[#1a1a1a] text-gray-300 hover:bg-[#252525] border border-[#333333]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className={`px-4 py-2 cursor-pointer rounded ${
                    page === totalPages
                      ? "bg-[#252525] text-gray-600 cursor-not-allowed"
                      : "bg-[#1a1a1a] text-orange-500 hover:bg-[#252525] border border-[#333333]"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
