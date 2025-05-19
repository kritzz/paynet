import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

// Mock Router to prevent double Router nesting
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    // Return identity function to prevent nesting of BrowserRouter in App
    BrowserRouter: ({ children }) => children,
  };
});

// Mock dependencies
vi.mock("../SummaryCards", () => ({
  default: () => <div data-testid="summary-cards">Summary Cards</div>,
}));

vi.mock("../EndpointCards", () => ({
  default: () => <div data-testid="endpoint-cards">Endpoint Cards</div>,
}));

vi.mock("../components/NavBar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

vi.mock("../components/AuthenticatedLayout", () => ({
  default: ({ children }) => (
    <div data-testid="authenticated-layout">{children}</div>
  ),
}));

vi.mock("../components/PrivateRoute", () => ({
  default: ({ children }) => <div data-testid="private-route">{children}</div>,
}));

vi.mock("../contexts/AuthContext", () => ({
  AuthProvider: ({ children }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
  useAuth: () => ({
    currentUser: { uid: "123", email: "test@example.com" },
  }),
}));

describe("Homepage", () => {
  it("renders the Explore Analytics button", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    // Since we've mocked the context and routes, we can check if the button renders
    const exploreButton = screen.getByText("Explore Analytics");
    expect(exploreButton).toBeInTheDocument();
  });

  it("has the correct link destination", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    const exploreButton = screen.getByText("Explore Analytics");
    const linkElement = exploreButton.closest("a");
    expect(linkElement).toHaveAttribute("href", "/top-products");
  });
});
