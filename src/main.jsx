import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import Navbar from "./components/NavBar.jsx";
// i think Navbar is a typo 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
