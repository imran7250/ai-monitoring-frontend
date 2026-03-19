import { createContext, useContext, useState } from "react";

// ✅ FIX #3 — AuthContext fully implemented
// Before: this file was completely empty
// After: user data is shared across all components reactively
// When profile is updated, Sidebar name updates immediately
// without needing a page refresh

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    // Safe parse — prevents crash if localStorage value is corrupted
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });

  // Call this after login to store user
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Call this after profile update
  const updateUser = (updatedUser) => {
    const merged = { ...user, ...updatedUser };
    localStorage.setItem("user", JSON.stringify(merged));
    setUser(merged);
  };

  // Call this on logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser({});
  };

  const isAdmin = user?.role === "ROLE_ADMIN";
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <AuthContext.Provider value={{ user, login, updateUser, logout, isAdmin, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — use this in any component instead of reading localStorage directly
// Example: const { user, isAdmin, logout } = useAuth();
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
