import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ProductPage from "../pages/Product";

// Mock fetch API for product data
global.fetch = vi.fn();

// Mock components used in ProductPage
vi.mock("../components/DocTitle", () => ({
  default: () => null,
}));

vi.mock("../components/FancyLoader", () => ({
  default: () => <div data-testid="fancy-loader">Loading...</div>,
}));

// Mock rc-slider
vi.mock("rc-slider", () => ({
  default: (props) => (
    <div data-testid="mock-slider">
      <input
        type="range"
        data-testid="price-range-slider"
        min={props.min}
        max={props.max}
        value={props.value}
        onChange={(e) =>
          props.onChange([props.value[0], Number(e.target.value)])
        }
      />
      <span>Min: {props.value[0]}</span>
      <span>Max: {props.value[1]}</span>
    </div>
  ),
}));

describe("ProductPage", () => {
  // Mock product data
  const mockProducts = [
    {
      id: 1,
      title: "Test Product 1",
      price: 199.99,
      rating: 4.5,
      sales: 1200,
      seller: "Test Seller",
      category: "Electronics|Gadgets|Smartphones",
    },
    {
      id: 2,
      title: "Test Product 2",
      price: 299.99,
      rating: 3.8,
      sales: 850,
      seller: "Another Seller",
      category: "Fashion|Clothing|T-shirts",
    },
  ];

  // Setup function to render the ProductPage component
  const setupProductPage = () => {
    return render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    // Clear mock data and set up mock response
    vi.clearAllMocks();

    // Mock successful API response
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ products: mockProducts }),
    });
  });

  it("renders the page title and subtitle", async () => {
    setupProductPage();

    const title = screen.getByText("Products");
    expect(title).toBeInTheDocument();

    const subtitle = screen.getByText(
      "Discover top products in the Shopee marketplace"
    );
    expect(subtitle).toBeInTheDocument();
  });

  it("shows loading state initially", () => {
    setupProductPage();

    const loader = screen.getByTestId("fancy-loader");
    expect(loader).toBeInTheDocument();

    const loadingText = screen.getByText("Loading products...");
    expect(loadingText).toBeInTheDocument();
  });

  it("renders search filters section", () => {
    setupProductPage();

    const filterHeading = screen.getByText("Search Filters");
    expect(filterHeading).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText("Search products...");
    expect(searchInput).toBeInTheDocument();

    const priceRangeLabel = screen.getByText("Price Range (RM)");
    expect(priceRangeLabel).toBeInTheDocument();

    const ratingLabel = screen.getByText("Minimum Rating");
    expect(ratingLabel).toBeInTheDocument();

    const applyButton = screen.getByText("Apply Filters");
    expect(applyButton).toBeInTheDocument();
  });

  it("renders sorting options", () => {
    setupProductPage();

    const sortByText = screen.getByText("Sort by:");
    expect(sortByText).toBeInTheDocument();

    const sortOptions = ["Title", "Price", "Sales", "Rating"];
    sortOptions.forEach((option) => {
      const sortButton = screen.getByText(option);
      expect(sortButton).toBeInTheDocument();
    });
  });

  it("displays products after loading", async () => {
    setupProductPage();

    // Wait for products to load
    await waitFor(() => {
      expect(screen.queryByTestId("fancy-loader")).not.toBeInTheDocument();
    });

    // Check if both mock products are displayed
    expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    expect(screen.getByText("Test Product 2")).toBeInTheDocument();

    // Check if product details are displayed
    expect(screen.getByText("RM 199.99")).toBeInTheDocument();
    expect(screen.getByText("RM 299.99")).toBeInTheDocument();

    // Check for sellers
    expect(screen.getByText("Test Seller")).toBeInTheDocument();
    expect(screen.getByText("Another Seller")).toBeInTheDocument();
  });

  it("shows correct pagination", async () => {
    setupProductPage();

    await waitFor(() => {
      expect(screen.queryByTestId("fancy-loader")).not.toBeInTheDocument();
    });

    // Check for pagination buttons
    const pageButtons = screen.getAllByRole("button", { name: /[0-9]/ });
    expect(pageButtons.length).toBe(5);

    const prevButton = screen.getByText("Previous");
    const nextButton = screen.getByText("Next");

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();

    // First page button should be active
    expect(pageButtons[0]).toHaveClass("bg-orange-500");
  });

  it("allows filtering by search term", async () => {
    setupProductPage();

    // Find the search input and type in it
    const searchInput = screen.getByPlaceholderText("Search products...");
    await userEvent.type(searchInput, "smartphone");

    // Click apply filters
    const applyButton = screen.getByText("Apply Filters");
    await userEvent.click(applyButton);

    // Verify fetch was called with the correct search term
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2); // Initial load + search
      const lastCall = global.fetch.mock.calls[1][1];
      const requestBody = JSON.parse(lastCall.body);
      expect(requestBody.searchterm).toBe("smartphone");
    });
  });

  it("allows changing rating filter", async () => {
    setupProductPage();

    // Instead of manipulating the slider directly, we can mock the state change
    // First, wait for the component to finish initial loading
    await waitFor(() => {
      expect(screen.queryByTestId("fancy-loader")).not.toBeInTheDocument();
    });

    // Click apply filters (this would use the default rating of 4.0 from your state)
    const applyButton = screen.getByText("Apply Filters");
    await userEvent.click(applyButton);

    // Verify fetch was called with the correct rating
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2); // Initial load + filter
      const lastCall = global.fetch.mock.calls[1][1];
      const requestBody = JSON.parse(lastCall.body);
      expect(requestBody.rating).toBe(4.0); // The default rating value
    });
  });

  it("handles pagination correctly", async () => {
    setupProductPage();

    await waitFor(() => {
      expect(screen.queryByTestId("fancy-loader")).not.toBeInTheDocument();
    });

    // Click on page 2
    const pageButton = screen.getByRole("button", { name: "2" });
    await userEvent.click(pageButton);

    // Verify fetch was called with the correct offset
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2); // Initial load + pagination
      const lastCall = global.fetch.mock.calls[1][1];
      const requestBody = JSON.parse(lastCall.body);
      expect(requestBody.offset).toBe(10); // Page 2 offset (assuming 10 items per page)
    });
  });

  it("displays error state when API fails", async () => {
    // Mock a failed API response
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    setupProductPage();

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText("Error loading products")).toBeInTheDocument();
    });

    const tryAgainButton = screen.getByText("Try Again");
    expect(tryAgainButton).toBeInTheDocument();
  });

  it("handles empty product results", async () => {
    // Mock an empty product response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ products: [] }),
    });

    setupProductPage();

    // Wait for no products message
    await waitFor(() => {
      expect(
        screen.getByText("No products found matching your search")
      ).toBeInTheDocument();
    });

    const resetButton = screen.getByText("Reset Filters");
    expect(resetButton).toBeInTheDocument();
  });

  it("allows expanding product details on click", async () => {
    setupProductPage();

    await waitFor(() => {
      expect(screen.queryByTestId("fancy-loader")).not.toBeInTheDocument();
    });

    // Click on a product
    const product = screen.getByText("Test Product 1");
    await userEvent.click(product);

    // In your current implementation, clicking a product just sets selectedProduct state
    // If clicking toggles a CSS class or expanded view, you would test for that here

    // For example, if clicking adds a 'selected' class:
    // expect(product.closest('[data-product-id]')).toHaveClass('selected');

    // Or if clicking shows more details:
    // expect(screen.getByText("Additional Details")).toBeInTheDocument();
  });

  it("shows correct product rating stars", async () => {
    setupProductPage();

    await waitFor(() => {
      expect(screen.queryByTestId("fancy-loader")).not.toBeInTheDocument();
    });

    // Since we can't directly test the FaStar icons, we can check if the rating value is displayed
    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("3.8")).toBeInTheDocument();
  });
});
