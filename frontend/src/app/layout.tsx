import type { Metadata } from "next";
import { Gabarito } from "next/font/google";
import "./globals.css";

const gabarito = Gabarito({
  subsets: ["latin"],
  variable: "--font-gabarito",
});

export const metadata: Metadata = {
  title: "DFCU Bank Payment Gateway",
  description: "Secure payment processing gateway for financial transactions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={gabarito.className}>{children}</body>
    </html>
  );
}
