"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme-constants";

export type Theme = "dark" | "light";

const listeners = new Set<() => void>();

/** The DOM attribute is the source of truth — the inline script in
 *  layout.tsx already set it correctly before hydration ever runs. */
function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}
function getServerSnapshot(): Theme {
  return "dark";
}
function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

const THEME_COLOR: Record<Theme, string> = { dark: "#060607", light: "#f5f4ef" };

/** Force the browser chrome color to match, overriding the static
 *  prefers-color-scheme meta tags once the visitor picks a theme by hand. */
function syncThemeColorMeta(theme: Theme) {
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((el) => el.setAttribute("content", THEME_COLOR[theme]));
}

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // useSyncExternalStore (not state+effect) because the real value lives
  // in the DOM attribute the inline script set before hydration — this
  // reconciles the SSR-time guess with the client's actual value in one
  // pass instead of a state update chained off an effect.
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    syncThemeColorMeta(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const next: Theme = getSnapshot() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // localStorage unavailable (private mode, disabled storage) — theme
      // still applies for this session, it just won't persist.
    }
    listeners.forEach((cb) => cb());
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
