import { useState, useEffect } from "react";
import { FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function ProductPage() {
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

    const ITEMS_PER_PAGE = 6;

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
        setSelectedProduct(productId);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full bg-gradient-to-r from-orange-500 to-orange-400 py-8 mb-8">
                <div className="max-w-4xl mx-auto px-6">
                    <h1 className="text-3xl font-bold text-white">Products</h1>
                    <p className="text-white text-opacity-90 mt-2">
                        Search and explore products on Shopee
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-6">
                {/* Search and Filter Controls */}
                <div className="mb-8 space-y-4">
                    <div className="flex gap-4 items-end">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-3 border-0 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-500"
                                value={tempFilter}
                                onChange={(e) => setTempFilter(e.target.value)}
                            />
                        </div>

                        {/* Price Range Slider */}
                        <div className="flex-1">
                            <label className="block text-sm text-gray-600 mb-1">Price Range</label>
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
                                railStyle={{ backgroundColor: "#E5E7EB" }}
                            />
                            <div className="flex justify-between text-sm text-gray-600 mt-2">
                                <span>RM {tempPriceRange[0]}</span>
                                <span>RM {tempPriceRange[1]}</span>
                            </div>
                        </div>

                        {/* Rating Filter */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Rating</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                value={tempRating}
                                onChange={(e) => setTempRating(Number(e.target.value))}
                                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-800"
                            />
                        </div>

                        {/* Search Button */}
                        <div>
                            <button
                                onClick={handleSearch}
                                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium transition-colors duration-200"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sort Controls */}
                <div className="flex flex-wrap gap-2">
                    <div className="text-sm text-gray-600 mb-2">Sort by:</div>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { field: "title", label: "Title" },
                            { field: "price", label: "Price" },
                            { field: "sales", label: "Sales" },
                        ].map(({ field, label }) => (
                            <button
                                key={field}
                                onClick={() => handleSort(field)}
                                className={`cursor-pointer flex items-center px-2 py-1 rounded text-xs ${sortField === field
                                    ? "bg-orange-100 text-orange-700 font-medium"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                {label} {getSortIcon(field)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-2 text-gray-600">Loading products...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                        <p className="font-medium">Error loading products</p>
                        <p className="text-sm mt-1">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-2 text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded"
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
                                        className={`bg-gradient-to-b from-orange-50 to-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border ${selectedProduct === product.id
                                            ? "border-orange-500 shadow-lg"
                                            : "border-gray-300"
                                            }`}
                                    >
                                        <div className="p-6">
                                            <h2 className="text-lg font-semibold text-gray-800 bg-orange-100 p-2 rounded">
                                                {product.title}
                                            </h2>
                                            <div className="mt-4 text-sm text-gray-600 space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-800">Price:</span>
                                                    <span>RM {product.price.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-800">Sales:</span>
                                                    <span>{product.sales}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-800">Seller:</span>
                                                    <span>{product.seller}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-800">Category:</span>
                                                    <span>{product.category}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12 bg-white rounded-lg">
                                    <p className="text-gray-500">No products found matching your search</p>
                                    <button
                                        className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium transition-colors duration-200"
                                        onClick={() => setFilter("")}
                                    >
                                        Show all products
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex justify-center mt-8 space-x-2">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className={`px-4 py-2 rounded cursor-pointer ${page === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-orange-500 hover:bg-orange-50"
                                    }`}
                            >
                                Previous
                            </button>

                            {[...Array(5)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-10 h-10 cursor-pointer rounded-full ${page === i + 1
                                        ? "bg-orange-500 text-white"
                                        : "bg-white text-gray-700 hover:bg-orange-50"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={products.length < ITEMS_PER_PAGE}
                                className={`px-4 py-2 rounded cursor-pointer ${products.length < ITEMS_PER_PAGE
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-orange-500 hover:bg-orange-50"
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}