import "../styles/globals.css";
import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";

export const metadata = {
  title: "Mifta.dev – Full-Stack Developer",
  description: "Portfolio of Mifta, a full-stack developer and builder.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-white">
        <div className="relative min-h-screen overflow-hidden">
          <Navbar />
          <PageTransition>
            <main className="mx-auto max-w-7xl px-6 pb-16 pt-24 md:pt-28">
              {children}
            </main>
          </PageTransition>
          <Footer />
        </div>
      </body>
    </html>
  );
}

