/**
 * Plain (non "use client") module so this constant is safe to import from
 * both the Server Component layout.tsx and the client ThemeProvider —
 * importing a value export from a "use client" file into a Server
 * Component doesn't survive the RSC boundary (it resolves to undefined).
 */
export const THEME_STORAGE_KEY = "kawsar-theme";
