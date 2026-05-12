import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Max Rewards",
  description: "Credit card rewards recommendations based on real spending habits."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
