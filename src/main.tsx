import "@/styles/globals.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app";

import "@/config/i18n";

document.title = import.meta.env.VITE_APP_NAME;
createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <App />
  // </StrictMode>
);
