import type { Metadata } from "next";
import "./globals.css";
import { SupabaseProvider } from "@/components/SupabaseProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "SportsMarkers — Showcase Your Athletic Journey",
  description:
    "Create stunning portfolios, stay updated with sports news, and discover events near you.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased overflow-x-hidden">
        <SupabaseProvider>
          <Header />
          <main className="flex min-h-screen flex-col">{children}</main>
          <Footer />
        </SupabaseProvider>
      </body>
    </html>
  );
}
