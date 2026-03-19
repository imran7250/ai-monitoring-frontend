import { useEffect } from "react";

// ✅ usePageTitle hook
// Updates browser tab title when user navigates between pages
// Usage: usePageTitle("Dashboard") → tab shows "Dashboard — AI Monitor"
//
// Add one line to each page component:
// Dashboard.jsx  → usePageTitle("Dashboard");
// Services.jsx   → usePageTitle("Services");
// Incidents.jsx  → usePageTitle("Incidents");
// etc.

export function usePageTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} — AI Monitor` : "AI Monitor";
    // Restore previous title when component unmounts
    return () => {
      document.title = prev;
    };
  }, [title]);
}