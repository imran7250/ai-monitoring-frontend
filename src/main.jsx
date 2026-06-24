// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.jsx"; // ✅ IMPORT THIS

// ✅ Viewport meta tag for responsive
const metaViewport = document.createElement("meta");
metaViewport.name = "viewport";
metaViewport.content = "width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover";
document.head.appendChild(metaViewport);

// ✅ Theme color for mobile browsers
const metaThemeColor = document.createElement("meta");
metaThemeColor.name = "theme-color";
metaThemeColor.content = "#0f172a";
document.head.appendChild(metaThemeColor);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>  {/* ✅ WRAP APP WITH AuthProvider - THIS IS THE FIX */}
      <App />
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            maxWidth: "90vw",
            wordBreak: "break-word",
          },
          duration: 4000,
        }}
      />
    </AuthProvider>
  </React.StrictMode>
);