import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Ubuntu } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/ThemeProvider";
import { THEME_STORAGE_KEY } from "@/lib/theme-constants";
import "./globals.css";

// Runs before hydration so the correct theme applies before first paint —
// no flash of the wrong theme. Kept in sync with ThemeProvider.tsx.
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const ubuntu = Ubuntu({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-ubuntu",
  display: "swap",
});

const operatorMono = localFont({
  src: [
    {
      path: "./fonts/operator-mono/OperatorMonoLig-Book.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/operator-mono/OperatorMonoLig-BookItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/operator-mono/OperatorMonoLig-Medium.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/operator-mono/OperatorMonoLig-MediumItalic.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-operator-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NURUDDIN KAWSAR — SQA Engineer | COVERAGE",
  description:
    "A cinematic test run in seven acts. Nuruddin Kawsar — SQA Engineer testing web, API and SaaS platforms from Dhaka, Bangladesh. Playwright, Cypress, Selenium, and the discipline of catching it before production does.",
  keywords: [
    "SQA Engineer",
    "QA Automation",
    "Playwright",
    "Cypress",
    "Selenium",
    "Nuruddin Kawsar",
    "Software Quality Assurance",
    "API Testing",
  ],
  authors: [{ name: "Nuruddin Kawsar", url: "https://nuruddinkawsar.me/" }],
  openGraph: {
    title: "NURUDDIN KAWSAR — COVERAGE",
    description:
      "Every release has a test plan. Scroll to execute. A cinematic QA experience in seven acts.",
    url: "https://nuruddinkawsar.me/",
    siteName: "COVERAGE — Nuruddin Kawsar",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#060607" },
  ],
  width: "device-width",
  initialScale: 1,
  // cinematic frame: no pinch zoom — also stops iOS Safari from
  // auto-zooming (and staying zoomed) when the 11px terminal input focuses
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: browser extensions (e.g. ColorZilla injects
    // cz-shortcut-listen="true") mutate <html>/<body> before React hydrates.
    // That diff is external noise — never our content — so don't warn on it.
    <html
      lang="en"
      className={`bg-void ${bebas.variable} ${ubuntu.variable} ${operatorMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
