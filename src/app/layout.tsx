import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Priisma Edge | Trading Performance Operating System",
  description: "The all-in-one premium trading performance platform. Journal, analyze, and optimize your trading with AI-powered insights.",
  keywords: ["trading", "journal", "analytics", "performance", "prop firm", "risk management"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1f2937",
              color: "#f9fafb",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
            },
            success: {
              iconTheme: {
                primary: "#D4AF37",
                secondary: "#000",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
