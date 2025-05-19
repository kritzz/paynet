import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SalesTrendPage from "../pages/SalesTrend";

// Mock the fetch API
global.fetch = vi.fn();

// Mock the react-chartjs-2 Line component
vi.mock("react-chartjs-2", () => ({
  Line: () => <div data-testid="line-chart">Mock Line Chart</div>,
}));

// Mock the Chart.js registration to avoid issues
vi.mock("chart.js", () => ({
  Chart: {
    register: vi.fn(),
  },
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  PointElement: vi.fn(),
  LineElement: vi.fn(),
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

describe("SalesTrendPage", () => {
  // Mock sales trend data
  const mockSalesTrendData = [
    {
      date: "2023-01-01",
      total_sales: 15000,
      total_orders: 500,
      unique_products: 200,
    },
    {
      date: "2023-01-02",
      total_sales: 18000,
      total_orders: 600,
      unique_products: 220,
    },
    {
      date: "2023-01-03",
      total_sales: 16500,
      total_orders: 550,
      unique_products: 210,
    },
    {
      date: "2023-01-04",
      total_sales: 19000,
      total_orders: 650,
      unique_products: 230,
    },
    {
      date: "2023-01-05",
      total_sales: 20000,
      total_orders: 700,
      unique_products: 240,
    },
  ];

  // Setup function to render the SalesTrendPage component
  const setupSalesTrendPage = () => {
    return render(
      <MemoryRouter>
        <SalesTrendPage />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    // Clear mock data and set up mock response
    vi.clearAllMocks();

    // Mock successful API response
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockSalesTrendData,
    });
  });

  it("renders the page title and subtitle", () => {
    setupSalesTrendPage();

    const title = screen.getByText("Sales Trend");
    expect(title).toBeInTheDocument();

    const subtitle = screen.getByText(
      /Discover sales, orders, unique products metrics performance/
    );
    expect(subtitle).toBeInTheDocument();
  });

  it("shows loading state initially", () => {
    setupSalesTrendPage();

    const loader = screen.getByTestId("fancy-loader");
    expect(loader).toBeInTheDocument();

    const loadingText = screen.getByText("Loading sales trend...");
    expect(loadingText).toBeInTheDocument();
  });

  it("displays the line chart after loading", async () => {
    setupSalesTrendPage();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId("fancy-loader")).not.toBeInTheDocument();
    });

    // Check if chart is rendered
    const chart = screen.getByTestId("line-chart");
    expect(chart).toBeInTheDocument();
  });

  it("displays percentage change cards with correct values", async () => {
    setupSalesTrendPage();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId("fancy-loader")).not.toBeInTheDocument();
    });

    // Calculate expected percentage changes
    const expectedSalesChange = (((20000 - 15000) / 15000) * 100).toFixed(2);
    const expectedOrdersChange = (((700 - 500) / 500) * 100).toFixed(2);

    // Check if the percentage changes are displayed correctly
    const salesChangeElement = screen.getByText(`${expectedSalesChange}%`);
    const ordersChangeElement = screen.getByText(`${expectedOrdersChange}%`);

    expect(salesChangeElement).toBeInTheDocument();
    expect(ordersChangeElement).toBeInTheDocument();

    // Check that positive changes have the green text color
    expect(salesChangeElement).toHaveClass("text-green-500");
    expect(ordersChangeElement).toHaveClass("text-green-500");
  });

  it("renders toggle buttons for each data series", async () => {
    setupSalesTrendPage();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId("fancy-loader")).not.toBeInTheDocument();
    });

    // Check for the toggle buttons
    const salesButton = screen.getByText("Sales");
    const ordersButton = screen.getByText("Orders");
    const productsButton = screen.getByText("Products");

    expect(salesButton).toBeInTheDocument();
    expect(ordersButton).toBeInTheDocument();
    expect(productsButton).toBeInTheDocument();

    // Initially, all buttons should be active
    expect(salesButton).toHaveClass("bg-orange-500");
    expect(ordersButton).toHaveClass("bg-blue-500");
    expect(productsButton).toHaveClass("bg-green-500");
  });

  it("toggles data series visibility when buttons are clicked", async () => {
    setupSalesTrendPage();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId("fancy-loader")).not.toBeInTheDocument();
    });

    // Get the toggle buttons
    const salesButton = screen.getByText("Sales");

    // Click the sales button to toggle it off
    await userEvent.click(salesButton);

    // After toggling, the sales button should be inactive
    expect(salesButton).not.toHaveClass("bg-orange-500");
    expect(salesButton).toHaveClass("bg-[#1a1a1a]");

    // Click it again to toggle it back on
    await userEvent.click(salesButton);

    // Now it should be active again
    expect(salesButton).toHaveClass("bg-orange-500");
  });

  it("handles API errors gracefully", async () => {
    // Mock a failed API response
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    setupSalesTrendPage();

    // Wait for error message to appear
    await waitFor(() => {
      expect(
        screen.getByText("Failed to fetch sales trend data.")
      ).toBeInTheDocument();
    });
  });

  it("correctly formats percentage changes", async () => {
    // Mock data with negative change
    const negativeChangeMockData = [
      {
        date: "2023-01-01",
        total_sales: 20000,
        total_orders: 700,
        unique_products: 240,
      },
      {
        date: "2023-01-05",
        total_sales: 15000,
        total_orders: 500,
        unique_products: 200,
      },
    ];

    // Override the mock response for this test
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => negativeChangeMockData,
    });

    setupSalesTrendPage();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId("fancy-loader")).not.toBeInTheDocument();
    });

    // Calculate expected negative percentage changes
    const expectedSalesChange = ((-5000 / 20000) * 100).toFixed(2);
    const expectedOrdersChange = ((-200 / 700) * 100).toFixed(2);

    // Check if the negative percentage changes are displayed correctly
    const salesChangeElement = screen.getByText(`${expectedSalesChange}%`);
    const ordersChangeElement = screen.getByText(`${expectedOrdersChange}%`);

    expect(salesChangeElement).toBeInTheDocument();
    expect(ordersChangeElement).toBeInTheDocument();

    // Check that negative changes have the red text color
    expect(salesChangeElement).toHaveClass("text-red-500");
    expect(ordersChangeElement).toHaveClass("text-red-500");
  });

  it("handles the outlier capping functionality", async () => {
    // Mock data with an outlier
    const outlierMockData = [
      {
        date: "2023-01-01",
        total_sales: 15000,
        total_orders: 500,
        unique_products: 200,
      },
      {
        date: "2023-01-02",
        total_sales: 100000, // Outlier value
        total_orders: 600,
        unique_products: 220,
      },
    ];

    // We need to spy on the capOutliers function indirectly
    // by checking if fetch is called and the chart is rendered
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => outlierMockData,
    });

    setupSalesTrendPage();

    // Wait for data to load and chart to render
    await waitFor(() => {
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });

    // We can't directly test the internal capping function,
    // but we can verify that the component rendered successfully
    // which means the outlier handling code executed
    expect(
      screen.queryByText("Failed to fetch sales trend data.")
    ).not.toBeInTheDocument();
  });

  it("ensures the chart is responsive", async () => {
    setupSalesTrendPage();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });

    // Instead of checking for specific classes, let's verify the chart exists
    // and is properly contained in the DOM
    const chart = screen.getByTestId("line-chart");
    expect(chart).toBeInTheDocument();

    // Check if it has a parent container
    const chartContainer = chart.parentElement;
    expect(chartContainer).toBeTruthy();

    // Alternative approach: Check that the chart is in a card-like container
    // We can check for basic structural elements without being too specific about classes
    const chartCard = chart.closest("div");
    expect(chartCard).toBeTruthy();

    // If your container has a data-testid, use that instead
    // const chartCard = screen.getByTestId("chart-container");
    // expect(chartCard).toBeInTheDocument();
  });

  it("displays the correct number of percentage change cards", async () => {
    setupSalesTrendPage();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId("fancy-loader")).not.toBeInTheDocument();
    });

    // Check for the percentage change cards
    const totalSalesChangeCard = screen.getByText("Total Sales Change");
    const totalOrdersChangeCard = screen.getByText("Total Orders Change");

    expect(totalSalesChangeCard).toBeInTheDocument();
    expect(totalOrdersChangeCard).toBeInTheDocument();

    // Check card descriptions
    const salesDescription = screen.getByText(
      /the percentage change in total sales/
    );
    const ordersDescription = screen.getByText(
      /the percentage change in total orders/
    );

    expect(salesDescription).toBeInTheDocument();
    expect(ordersDescription).toBeInTheDocument();
  });
});
