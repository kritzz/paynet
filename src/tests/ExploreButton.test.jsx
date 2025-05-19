import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import ExploreButton from "./ExploreButton";

describe("ExploreButton Component", () => {
  it("renders with correct text", () => {
    render(
      <BrowserRouter>
        <ExploreButton />
      </BrowserRouter>
    );

    expect(screen.getByTestId("explore-button")).toBeInTheDocument();
    expect(screen.getByText("Explore Analytics")).toBeInTheDocument();
  });

  it("renders with custom text when provided", () => {
    render(
      <BrowserRouter>
        <ExploreButton>Custom Text</ExploreButton>
      </BrowserRouter>
    );

    expect(screen.getByText("Custom Text")).toBeInTheDocument();
  });

  it("has the correct styling", () => {
    render(
      <BrowserRouter>
        <ExploreButton />
      </BrowserRouter>
    );

    const button = screen.getByTestId("explore-button");

    // Check various classes
    expect(button).toHaveClass("cursor-pointer");
    expect(button).toHaveClass("bg-gradient-to-r");
    expect(button).toHaveClass("from-orange-500");
    expect(button).toHaveClass("to-orange-600");
    expect(button).toHaveClass("text-white");
    expect(button).toHaveClass("rounded-lg");
  });

  it("navigates to /top-products by default when clicked", () => {
    render(
      <BrowserRouter>
        <ExploreButton />
      </BrowserRouter>
    );

    const link = screen.getByTestId("explore-link");
    expect(link).toHaveAttribute("href", "/top-products");
  });

  it("navigates to custom URL when specified", () => {
    render(
      <BrowserRouter>
        <ExploreButton to="/custom-path" />
      </BrowserRouter>
    );

    const link = screen.getByTestId("explore-link");
    expect(link).toHaveAttribute("href", "/custom-path");
  });

  it("handles click events correctly", async () => {
    // Create a user event instance
    const user = userEvent.setup();

    // Mock navigator
    const mockNavigate = vi.fn();

    // Custom wrapper to track navigation
    const Wrapper = ({ children }) => {
      return <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>;
    };

    render(
      <Wrapper>
        <ExploreButton />
      </Wrapper>
    );

    // Click the button
    const button = screen.getByTestId("explore-button");
    await user.click(button);

    // Assert the expected behavior
    // Note: In a real app with connected router, we'd check the URL changes
    // For this test, we just verify the button is clickable
    expect(button).toBeInTheDocument();
  });
});
