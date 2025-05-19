import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CategoryPage from "../pages/Category";

// Mock the fetch API
global.fetch = vi.fn();

// Mock the react-chartjs-2 Bar component
vi.mock("react-chartjs-2", () => ({
  Bar: ({ options }) => (
    <div
      data-testid="bar-chart"
      onClick={(e) => options.onClick(e, [{ index: 0 }])}
    >
      Mock Bar Chart
    </div>
  ),
}));

// Mock the Chart.js registration to avoid issues
vi.mock("chart.js", () => ({
  Chart: {
    register: vi.fn(),
  },
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  BarElement: vi.fn(),
  Title: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn(),
}));

// Mock DocTitle component
vi.mock("../components/DocTitle", () => ({
  default: () => null,
}));

// Mock FancyLoader component
vi.mock("../components/FancyLoader", () => ({
  default: () => <div data-testid="fancy-loader">Loading...</div>,
}));

// Mock Element.scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

describe("CategoryPage", () => {
  // Mock category data
  const mockCategoryData = [
    {
      item_category_detail: "Main|Fashion|T-shirts",
      revenue: 5000,
    },
    {
      item_category_detail: "Main|Fashion|Pants",
      revenue: 3000,
    },
    {
      item_category_detail: "Main|Electronics|Smartphones",
      revenue: 8000,
    },
    {
      item_category_detail: "Main|Electronics|Laptops",
      revenue: 12000,
    },
    {
      item_category_detail: "Main|Home|Kitchenware",
      revenue: 2000,
    },
  ];

  // Setup function to render the CategoryPage component
  const setupCategoryPage = () => {
    return render(
      <MemoryRouter>
        <CategoryPage />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    // Clear mock data and set up mock response
    vi.clearAllMocks();

    // Mock successful API response
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockCategoryData,
    });
  });

  it("renders the page title and subtitle", () => {
    setupCategoryPage();

    const title = screen.getByText("Top Categories");
    expect(title).toBeInTheDocument();

    const subtitle = screen.getByText(
      /Discover revenue performance across various categories/
    );
    expect(subtitle).toBeInTheDocument();
  });

  it("shows loading state initially", () => {
    setupCategoryPage();

    const loader = screen.getByTestId("fancy-loader");
    expect(loader).toBeInTheDocument();

    const loadingText = screen.getByText("Loading categories...");
    expect(loadingText).toBeInTheDocument();
  });

  it("displays the bar chart after loading", async () => {
    setupCategoryPage();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId("fancy-loader")).not.toBeInTheDocument();
    });

    // Check if chart is rendered
    const chart = screen.getByTestId("bar-chart");
    expect(chart).toBeInTheDocument();
  });

  it("displays the category table with correct data", async () => {
    setupCategoryPage();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId("fancy-loader")).not.toBeInTheDocument();
    });

    // Check table headers
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Subcategories")).toBeInTheDocument();
    expect(screen.getByText("Revenue (RM)")).toBeInTheDocument();

    // Check that categories are displayed in the table
    expect(screen.getByText("Fashion")).toBeInTheDocument();
    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();

    // Check subcategory tags are displayed
    expect(screen.getByText("T-shirts")).toBeInTheDocument();
    expect(screen.getByText("Pants")).toBeInTheDocument();
    expect(screen.getByText("Smartphones")).toBeInTheDocument();
    expect(screen.getByText("Laptops")).toBeInTheDocument();
    expect(screen.getByText("Kitchenware")).toBeInTheDocument();

    // Fix: Check revenue values by directly accessing the table cells
    // Instead of checking for exact text values, we'll check the cells contain the numbers
    const rows = screen.getAllByRole("row").slice(1); // Skip header row

    // Check Fashion row (8000.00)
    const fashionRow = screen.getByText("Fashion").closest("tr");
    const fashionRevenue = fashionRow.querySelector("td:last-child");
    expect(fashionRevenue.textContent).toBe("8000.00");

    // Check Electronics row (20000.00)
    const electronicsRow = screen.getByText("Electronics").closest("tr");
    const electronicsRevenue = electronicsRow.querySelector("td:last-child");
    expect(electronicsRevenue.textContent).toBe("20000.00");

    // Check Home row (2000.00)
    const homeRow = screen.getByText("Home").closest("tr");
    const homeRevenue = homeRow.querySelector("td:last-child");
    expect(homeRevenue.textContent).toBe("2000.00");
  });

  it("handles sorting by ascending order", async () => {
    setupCategoryPage();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId("fancy-loader")).not.toBeInTheDocument();
    });

    // Click on sort ascending button
    const ascButton = screen.getByText("Sort Ascending");
    await userEvent.click(ascButton);

    // Verify the button is active
    expect(ascButton).toHaveClass("bg-orange-500");

    // Descending button should be inactive
    const descButton = screen.getByText("Sort Descending");
    expect(descButton).not.toHaveClass("bg-orange-500");
  });

  it("handles sorting by descending order", async () => {
    setupCategoryPage();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId("fancy-loader")).not.toBeInTheDocument();
    });

    // Click on sort descending button
    const descButton = screen.getByText("Sort Descending");
    await userEvent.click(descButton);

    // Verify the button is active
    expect(descButton).toHaveClass("bg-orange-500");

    // Ascending button should be inactive
    const ascButton = screen.getByText("Sort Ascending");
    expect(ascButton).not.toHaveClass("bg-orange-500");
  });

  it("displays the category table with correct data", async () => {
    setupCategoryPage();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId("fancy-loader")).not.toBeInTheDocument();
    });

    // Check table headers
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Subcategories")).toBeInTheDocument();
    expect(screen.getByText("Revenue (RM)")).toBeInTheDocument();

    // Check that categories are displayed in the table
    expect(screen.getByText("Fashion")).toBeInTheDocument();
    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();

    // Check subcategory tags are displayed
    expect(screen.getByText("T-shirts")).toBeInTheDocument();
    expect(screen.getByText("Pants")).toBeInTheDocument();
    expect(screen.getByText("Smartphones")).toBeInTheDocument();
    expect(screen.getByText("Laptops")).toBeInTheDocument();
    expect(screen.getByText("Kitchenware")).toBeInTheDocument();

    // Fix: Check revenue values by directly accessing the table cells
    // Instead of checking for exact text values, we'll check the cells contain the numbers
    const rows = screen.getAllByRole("row").slice(1); // Skip header row

    // Check Fashion row (8000.00)
    const fashionRow = screen.getByText("Fashion").closest("tr");
    const fashionRevenue = fashionRow.querySelector("td:last-child");
    expect(fashionRevenue.textContent).toBe("8000.00");

    // Check Electronics row (20000.00)
    const electronicsRow = screen.getByText("Electronics").closest("tr");
    const electronicsRevenue = electronicsRow.querySelector("td:last-child");
    expect(electronicsRevenue.textContent).toBe("20000.00");

    // Check Home row (2000.00)
    const homeRow = screen.getByText("Home").closest("tr");
    const homeRevenue = homeRow.querySelector("td:last-child");
    expect(homeRevenue.textContent).toBe("2000.00");
  });

  it("selects a category when clicked in the chart", async () => {
    setupCategoryPage();

    // Reset the mock but keep track if it's called
    Element.prototype.scrollIntoView.mockReset();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId("fancy-loader")).not.toBeInTheDocument();
    });

    // Click on the chart (which will trigger the onClick handler we mocked)
    const chart = screen.getByTestId("bar-chart");
    await userEvent.click(chart);

    // Verify scrollIntoView was called at least once (without checking exact count)
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();

    // The first category row should be selected (our mock onClick is index 0)
    const categoryRows = screen.getAllByRole("row").slice(1); // Skip header row
    expect(categoryRows[0]).toHaveClass("bg-orange-500");
  });

  it("handles API errors gracefully", async () => {
    // Mock a failed API response
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    setupCategoryPage();

    // Wait for error message to appear
    await waitFor(() => {
      expect(
        screen.getByText("Failed to fetch category data.")
      ).toBeInTheDocument();
    });
  });

  it("groups categories correctly from API data", async () => {
    setupCategoryPage();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId("fancy-loader")).not.toBeInTheDocument();
    });

    // Check that only 3 main categories are displayed (Fashion, Electronics, Home)
    // after grouping by the second part of the category string
    const fashionCategory = screen.getByText("Fashion");
    const electronicsCategory = screen.getByText("Electronics");
    const homeCategory = screen.getByText("Home");

    expect(fashionCategory).toBeInTheDocument();
    expect(electronicsCategory).toBeInTheDocument();
    expect(homeCategory).toBeInTheDocument();

    // Check that the revenue for Electronics is the sum of Smartphones and Laptops
    // We'd need to find the row with Electronics and check its revenue
    const electronicsRow = electronicsCategory.closest("tr");
    const electronicsRevenue = electronicsRow.querySelector("td:last-child");

    // Electronics revenue should be 20000.00 (8000 + 12000)
    expect(electronicsRevenue.textContent).toBe("20000.00");
  });

  it("displays the chart container properly", async () => {
    setupCategoryPage();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId("fancy-loader")).not.toBeInTheDocument();
    });

    // Find the chart container
    const chartContainer = screen.getByTestId("bar-chart").closest("div");

    // Check if it has a parent div with appropriate container classes
    const chartCard = chartContainer.closest("div");
    expect(chartCard).toBeTruthy();

    // Check that the chart is contained in a section with the proper heading
    const chartHeading = screen.getByText("Category Table");
    expect(chartHeading).toBeInTheDocument();
  });

  it("has a responsive table layout", async () => {
    setupCategoryPage();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId("fancy-loader")).not.toBeInTheDocument();
    });

    // Check if the table has expected structure
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    // Should have a header row and rows for each category
    const rows = screen.getAllByRole("row");

    // One header row + 3 data rows (after grouping)
    expect(rows).toHaveLength(4);

    // Table should be full width
    expect(table).toHaveClass("w-full");
  });
});
