"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  textPrimary: string;
  textSecondary: string;
}

export const defaultTheme: ThemeColors = {
  primary: "#059669", // emerald-600
  secondary: "#10b981", // emerald-500
  accent: "#f0fdf4", // emerald-50
  background: "#ffffff",
  textPrimary: "#111827", // gray-900
  textSecondary: "#4b5563", // gray-600
};

interface ThemeContextType {
  theme: ThemeColors;
  updateTheme: (newTheme: Partial<ThemeColors>) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeColors>(defaultTheme);

  useEffect(() => {
    const savedTheme = localStorage.getItem("brand-theme");
    if (savedTheme) {
      try {
        setTheme(JSON.parse(savedTheme));
      } catch (e) {
        console.error("Failed to parse saved theme", e);
      }
    }
  }, []);

  useEffect(() => {
    // Apply theme to CSS variables
    const root = document.documentElement;
    root.style.setProperty("--primary-color", theme.primary);
    root.style.setProperty("--secondary-color", theme.secondary);
    root.style.setProperty("--accent-color", theme.accent);
    root.style.setProperty("--background-color", theme.background);
    root.style.setProperty("--text-primary-color", theme.textPrimary);
    root.style.setProperty("--text-secondary-color", theme.textSecondary);

    // Derived colors (for button hovers, etc - simple darkening/lightening simulation)
    // we could use a library but let's keep it simple for prototype
    localStorage.setItem("brand-theme", JSON.stringify(theme));
  }, [theme]);

  const updateTheme = (newTheme: Partial<ThemeColors>) => {
    setTheme((prev) => ({ ...prev, ...newTheme }));
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
