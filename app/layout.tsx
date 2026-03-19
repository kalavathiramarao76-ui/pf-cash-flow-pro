import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Cash Flow Pro — Automated Cash Flow Forecasting",
    template: "%s | Cash Flow Pro",
  },
  description:
    "Cash Flow Pro helps freelancers and small businesses automate cash flow forecasting, track income and expenses, and project future balances with precision. Take control of your financial future today.",
  keywords: [
    "cash flow forecasting",
    "cash flow management",
    "freelancer finance",
    "small business accounting",
    "income tracking",
    "expense tracking",
    "financial projections",
    "automated forecasting",
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
    title: "Cash Flow Pro — Automated Cash Flow Forecasting",
    description:
      "Automate your cash flow forecasting. Track income, manage expenses, and project future balances with precision. Built for freelancers and small businesses.",
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
    title: "Cash Flow Pro — Automated Cash Flow Forecasting",
    description:
      "Automate your cash flow forecasting. Built for freelancers and small businesses.",
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
