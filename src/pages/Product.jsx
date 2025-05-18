import { useState, useEffect } from "react";
import DocTitle from "../components/DocTitle";
import {
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaStar,
  FaShoppingCart,
  FaTags,
} from "react-icons/fa";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import FancyLoader from "../components/FancyLoader";

export default function ProductPage() {
  DocTitle("Shopee Sales Dashboard - Products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
  const [rating, setRating] = useState(4.0);
  const [priceRange, setPriceRange] = useState([100, 1000]); // Min and Max Price
  const [sortField, setSortField] = useState("total_sold");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null); // Track selected product

  // Temporary states for user input
  const [tempFilter, setTempFilter] = useState("");
  const [tempRating, setTempRating] = useState(4.0);
  const [tempPriceRange, setTempPriceRange] = useState([100, 1000]); // Temporary Price Range

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const payload = {
          searchterm: filter,
          rating,
          min_price: priceRange[0],
          max_price: priceRange[1],
          sort_by: sortField,
          sort_order: sortOrder,
          limit: ITEMS_PER_PAGE,
          offset: (page - 1) * ITEMS_PER_PAGE, // Calculate offset for pagination
        };

        const response = await fetch(
          `https://corsproxy.io/?url=${encodeURIComponent(
            "https://diqe9uc0ki.execute-api.ap-southeast-1.amazonaws.com/dev/product"
          )}`,
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching products: ${response.statusText}`);
        }

        const data = await response.json();
        setProducts(data.products);
        setError(null);
      } catch (err) {
        setError(err.message || "An unknown error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filter, rating, priceRange, sortField, sortOrder, page]);

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

  const handleSearch = () => {
    // Update the actual states with the temporary states
    setFilter(tempFilter);
    setRating(tempRating);
    setPriceRange(tempPriceRange);
    setPage(1); // Reset to the first page
  };

  const handleProductClick = (productId) => {
    setSelectedProduct(productId === selectedProduct ? null : productId);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] relative overflow-hidden">
      <div className="max-w-4xl mx-auto p-6">
        {" "}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="text-white text-opacity-90 mt-2">
            Discover top products in the Shopee marketplace
          </p>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400 rounded-full opacity-30 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-700 rounded-full opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Search and Filter Controls */}
        <div className="mb-8 bg-[#1a1a1a] p-6 rounded-lg border border-[#333333] shadow-lg">
          <h2 className="text-white text-lg font-semibold mb-4 flex items-center">
            <FaSearch className="mr-2 text-orange-500" />
            Search Filters
          </h2>

          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 border-0 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all duration-200 bg-[#252525] text-gray-200 placeholder-gray-500"
                value={tempFilter}
                onChange={(e) => setTempFilter(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price Range Slider */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Price Range (RM)
                </label>
                <Slider
                  range
                  min={0}
                  max={5000}
                  step={10}
                  value={tempPriceRange}
                  onChange={(value) => setTempPriceRange(value)}
                  trackStyle={[{ backgroundColor: "#F97316" }]}
                  handleStyle={[
                    { borderColor: "#F97316", backgroundColor: "#F97316" },
                    { borderColor: "#F97316", backgroundColor: "#F97316" },
                  ]}
                  railStyle={{ backgroundColor: "#333333" }}
                />
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <span>RM {tempPriceRange[0]}</span>
                  <span>RM {tempPriceRange[1]}</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="text-sm text-gray-400 mb-2 flex items-center">
                  <FaStar className="text-orange-500 mr-1" /> Minimum Rating
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={tempRating}
                    onChange={(e) => setTempRating(Number(e.target.value))}
                    className="w-full  cursor-pointer"
                  />
                  <span className="text-white text-lg font-medium min-w-[2.5rem] text-center">
                    {tempRating.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400 text-xs mt-1">
                  <span>0</span>
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSearch}
                className="cursor-pointer px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
              >
                <FaSearch className="mr-2" />
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="mb-6 flex flex-wrap gap-2">
          <div className="text-sm text-gray-400 flex items-center mr-2">
            Sort by:
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { field: "title", label: "Title" },
              { field: "price", label: "Price" },
              { field: "sales", label: "Sales" },
              { field: "rating", label: "Rating" },
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

        {/* Stats Bar (when data is available) */}
        {!loading && !error && products.length > 0 && (
          <div className="flex justify-between items-center mb-6 bg-[#1a1a1a] p-4 rounded-lg shadow-sm border border-[#333333]">
            <div className="text-sm text-gray-400">
              Showing {products.length} products
            </div>
            <div className="text-sm text-gray-400">Page {page}</div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="flex justify-center">
              <FancyLoader />
            </div>
            <p className="mt-6 text-gray-400">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900 text-red-100 p-4 rounded-lg mb-6">
            <p className="font-medium">Error loading products</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="cursor-pointer mt-2 text-sm bg-red-800 hover:bg-red-700 px-3 py-1 rounded"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.length > 0 ? (
                products.map((product, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleProductClick(product.id)}
                    className={`bg-[#1a1a1a] rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border ${
                      selectedProduct === product.id
                        ? "border-orange-500"
                        : "border-[#333333]"
                    } cursor-pointer`}
                  >
                    <div className="h-1.5 bg-gradient-to-r from-orange-500 to-orange-400"></div>
                    <div className="p-6">
                      <h2 className="text-lg font-semibold text-white mb-3 line-clamp-2">
                        {product.title}
                      </h2>

                      <div className="flex items-center mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.round(product.rating)
                                  ? "text-orange-500"
                                  : "text-gray-700"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-gray-400 text-sm">
                          {product.rating?.toFixed(1) || "N/A"}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center py-1 border-b border-[#333333]">
                          <span className="text-gray-400">Price:</span>
                          <span className="text-white font-semibold">
                            RM {product.price?.toFixed(2) || "N/A"}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-1 border-b border-[#333333]">
                          <span className="text-gray-400 flex items-center">
                            <FaShoppingCart className="mr-1 text-orange-500" />{" "}
                            Sales:
                          </span>
                          <span className="text-white">
                            {product.sales?.toLocaleString() || "N/A"}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-1 border-b border-[#333333]">
                          <span className="text-gray-400">Seller:</span>
                          <span className="text-orange-400 hover:text-orange-300">
                            {product.seller || "Unknown"}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-1">
                          <span className="text-gray-400 flex items-center">
                            <FaTags className="mr-1 text-orange-500" />{" "}
                            Category:
                          </span>
                          <span className="text-green-400">
                            {product.category || "Uncategorized"}
                          </span>
                        </div>
                      </div>

                      {selectedProduct === product.id && (
                        <div className="mt-4 pt-4 border-t border-[#333333]">
                          <button className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded font-medium transition-colors">
                            View Details
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-[#1a1a1a] rounded-lg border border-[#333333]">
                  <p className="text-gray-400">
                    No products found matching your search
                  </p>
                  <button
                    className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium transition-colors duration-200"
                    onClick={() => {
                      setTempFilter("");
                      setTempRating(0);
                      setTempPriceRange([0, 5000]);
                      handleSearch();
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {products.length > 0 && (
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

                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 cursor-pointer rounded-full ${
                      page === i + 1
                        ? "bg-orange-500 text-white"
                        : "bg-[#1a1a1a] text-gray-300 hover:bg-[#252525] border border-[#333333]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={products.length < ITEMS_PER_PAGE}
                  className={`px-4 py-2 cursor-pointer rounded ${
                    products.length < ITEMS_PER_PAGE
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
