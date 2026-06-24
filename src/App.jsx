// import React from "react";
// import AppRouter from "./router/AppRouter";
// import ErrorBoundary from "./components/ui/ErrorBoundary";
// export default function App() {
//   return (
//     <ErrorBoundary>
//       <AppRouter />
//     </ErrorBoundary>
//   );
// }

// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\App.jsx

// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\App.jsx

import React from "react";
import AppRouter from "./router/AppRouter";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext.jsx"; // ✅ Import AuthProvider

export default function App() {
  return (
    <AuthProvider>  {/* ✅ Wrap everything with AuthProvider */}
      <ErrorBoundary>
        <AppRouter />
      </ErrorBoundary>
    </AuthProvider>
  );
}