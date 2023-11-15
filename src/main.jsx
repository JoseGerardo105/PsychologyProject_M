import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const originalError = console.error;

console.error = (message, ...optionalParams) => {
  if (
    message.includes("flushSync was called from inside a lifecycle method.")
  ) {
    return;
  }
  originalError(message, ...optionalParams);
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
