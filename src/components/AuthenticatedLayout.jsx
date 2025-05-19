import React from "react";
import Navbar from "./NavBar";

export default function AuthenticatedLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
