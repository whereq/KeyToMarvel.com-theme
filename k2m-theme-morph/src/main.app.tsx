import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Define a React component that wraps the App component
const MainApp = () => (
  <StrictMode>
    <App />
  </StrictMode>
);

// Export the MainApp component as the default export
export default MainApp;

// Render the MainApp component to the DOM
const root = createRoot(document.getElementById("root")!);
root.render(<MainApp />);