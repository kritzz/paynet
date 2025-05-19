import React from "react";
import { Link } from "react-router-dom";

const ExploreButton = ({
  to = "/top-products",
  children = "Explore Analytics",
}) => {
  return (
    <Link to={to} data-testid="explore-link">
      <button
        className="cursor-pointer px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg shadow-lg hover:shadow-orange-500/20 hover:translate-y-[-2px] transition-all duration-300"
        data-testid="explore-button"
      >
        {children}
      </button>
    </Link>
  );
};

export default ExploreButton;
