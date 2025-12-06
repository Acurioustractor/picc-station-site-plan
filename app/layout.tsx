import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Centre - Interactive Site Map",
  description: "The Centre – Palm Island–Townsville Circular Economy & Youth Pathways Precinct interactive site plan",
  keywords: ["The Centre", "PICC", "Palm Island", "Townsville", "circular economy", "youth pathways"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
