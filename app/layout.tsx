import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Automated Cash Flow Forecasting | Cash Flow Pro",
    template: "%s | Cash Flow Pro",
  },
  description:
    "Unlock accurate financial predictions with Cash Flow Pro, the ultimate tool for freelancers and small businesses to automate cash flow forecasting, track income and expenses, and project future balances with precision.",
  keywords: [
    "cash flow forecasting",
    "automated cash flow management",
    "financial forecasting software",
    "small business accounting tools",
    "freelance finance management",
    "income and expense tracking",
    "financial projections and analysis",
    "cash flow prediction and planning",
    "business budgeting and forecasting",
    "financial planning",
    "cash flow management",
    "forecasting software",
    "financial management tools",
    "small business finance",
    "freelance accounting",
  ],
  authors: [{ name: "Cash Flow Pro Team" }],
  creator: "Cash Flow Pro",
  publisher: "Cash Flow Pro",
  metadataBase: new URL("https://cashflowpro.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cashflowpro.app",
    siteName: "Cash Flow Pro",
    title: "Automated Cash Flow Forecasting | Cash Flow Pro",
    description:
      "Discover the power of automated cash flow forecasting with Cash Flow Pro. Streamline your financial management, track income and expenses, and make informed decisions with precise financial projections.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cash Flow Pro Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Automated Cash Flow Forecasting | Cash Flow Pro",
    description:
      "Transform your financial management with Cash Flow Pro. Automate cash flow forecasting, track income and expenses, and unlock data-driven insights for informed decision-making.",
    images: ["/og-image.png"],
    creator: "@cashflowpro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}