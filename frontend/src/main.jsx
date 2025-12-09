/**
 * Application Entry Point
 * 
 * Initializes the React application with routing and global styles.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./components/App";
import "./styles/tailwind.css";

// Get root element
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Ensure 'root' div exists in index.html");
}

// Initialize React application
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
