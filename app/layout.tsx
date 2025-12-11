import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mounty Yarns - Interactive Site Plan",
  description: "Mounty Yarns amplifies lived-experience stories and collective solutions shared by Aboriginal young people to create a safer, fairer future for Mount Druitt. Interactive site development plan on Darug Country.",
  keywords: ["Mounty Yarns", "Mount Druitt", "Aboriginal youth", "Darug Country", "Just Reinvest", "community development", "interactive map"],
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
