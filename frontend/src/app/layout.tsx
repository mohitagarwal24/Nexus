import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/navbars/navbar";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import ClientProviders from "@/app/providers/ClientProviders";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

// Note: GT Alpina font will be loaded via CSS @font-face rules in globals.css

export const metadata: Metadata = {
  title: "Nexus",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-gt-alpina bg-gypsum text-onyx antialiased`}
        suppressHydrationWarning={true}
      >
        {/* Cloudflare Turnstile CAPTCHA Script - Must be in body for Next.js */}
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="beforeInteractive"
        />
        <ClientProviders>
          <Navbar />
          {children}
        </ClientProviders>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
