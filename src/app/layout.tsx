import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jb",
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
  themeColor: "#060607",
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
    <html lang="en" className="bg-void" suppressHydrationWarning>
      <body
        className={`${bebas.variable} ${grotesk.variable} ${jetbrains.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
